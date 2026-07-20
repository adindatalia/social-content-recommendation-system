import os
from typing import Optional, Any

import torch
import numpy as np
from flask import current_app
from transformers import AutoTokenizer
from transformers import AutoModelForSequenceClassification, PreTrainedModel


class SentimentService:
    model: Optional[PreTrainedModel]
    tokenizer: Optional[Any]

    def __init__(self):
        self.model = None
        self.tokenizer = None
        self.use_fallback = True
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    def init_model(self):
        if self.model is not None:
            return

        model_path = current_app.config["INDOBERT_MODEL_PATH"]
        config_file = os.path.join(model_path, "config.json")

        if os.path.exists(config_file):
            try:
                print(f"Loading IndoBERT model from {model_path} on device: {self.device}...")
                self.tokenizer = AutoTokenizer.from_pretrained(model_path)
                self.model = AutoModelForSequenceClassification.from_pretrained(model_path)
                self.model.to(self.device)
                self.model.eval()
                self.use_fallback = False
                print("IndoBERT model loaded successfully.")
            except Exception as e:
                print(f"Error loading IndoBERT model: {e}")
                self.use_fallback = True
        else:
            print(f"IndoBERT model files not found at {model_path}. Using fallback.")
            self.use_fallback = True

    # ---------- PREDIKSI SATU TEKS (tetap ada) ----------
    def predict_sentiment(self, text):
        self.init_model()

        if not self.use_fallback and self.model is not None and self.tokenizer is not None:
            try:
                inputs = self.tokenizer(
                    text, return_tensors="pt", padding=True, truncation=True, max_length=128
                )
                inputs = {k: v.to(self.device) for k, v in inputs.items()}
                with torch.no_grad():
                    logits = self.model(**inputs).logits
                probs = torch.nn.functional.softmax(logits, dim=-1).cpu().numpy()[0]
                pred_idx = int(np.argmax(probs))
                labels = ["Negatif", "Netral", "Positif"]
                return {
                    "sentiment": labels[pred_idx],
                    "probabilities": {
                        "Negatif": float(probs[0]),
                        "Netral": float(probs[1]) if len(probs) > 2 else 0.0,
                        "Positif": float(probs[2]) if len(probs) > 2 else float(probs[1]),
                    },
                    "method": "IndoBERT",
                }
            except Exception as e:
                print(f"Error during IndoBERT prediction: {e}. Using fallback.")

        return self._fallback_predict(text)

    # ---------- PREDIKSI BATCH (BARU - INI OPTIMASINYA) ----------
    def predict_batch(self, texts, batch_size: int = 32):
        """
        Prediksi sentimen banyak teks sekaligus (batch).
        Jauh lebih cepat daripada memanggil predict_sentiment satu per satu.
        Return: list label urut sesuai input.
        """
        self.init_model()
        if not texts:
            return []

        if self.use_fallback or self.model is None or self.tokenizer is None:
            return [self._fallback_predict(str(t))["sentiment"] for t in texts]

        labels = ["Negatif", "Netral", "Positif"]
        results = []

        for i in range(0, len(texts), batch_size):
            batch = [str(t) for t in texts[i:i + batch_size]]
            inputs = self.tokenizer(
                batch, return_tensors="pt", padding=True, truncation=True, max_length=128
            )
            inputs = {k: v.to(self.device) for k, v in inputs.items()}
            with torch.no_grad():
                logits = self.model(**inputs).logits
            preds = torch.argmax(logits, dim=-1).cpu().numpy()
            results.extend(labels[int(p)] for p in preds)

        return results

    def _fallback_predict(self, text):
        text_lower = text.lower()
        neg = ["lama", "antri", "kecewa", "lambat", "mahal", "buruk", "antrean",
               "antrian", "judes", "galak", "kotor", "capek", "ribet"]
        pos = ["puas", "cepat", "bagus", "bersih", "ramah", "mudah", "membantu",
               "terima kasih", "senang", "sehat", "rekomendasi"]
        neg_score = sum(1 for w in neg if w in text_lower)
        pos_score = sum(1 for w in pos if w in text_lower)
        if neg_score > pos_score:
            label = "Negatif"
        elif pos_score > neg_score:
            label = "Positif"
        else:
            label = "Netral"
        return {"sentiment": label, "probabilities": {}, "method": "Rule-Based"}


sentiment_service = SentimentService()
