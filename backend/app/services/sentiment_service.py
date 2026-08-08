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
        self.device = torch.device(
            "cuda" if torch.cuda.is_available() else "cpu"
        )

    def init_model(self):
        if self.model is not None:
            return

        model_path = current_app.config["INDOBERT_MODEL_PATH"]
        config_file = os.path.join(model_path, "config.json")

        if os.path.exists(config_file):
            try:
                print(
                    f"Loading IndoBERT model from {model_path} "
                    f"on device: {self.device}..."
                )

                self.tokenizer = AutoTokenizer.from_pretrained(
                    model_path
                )

                self.model = AutoModelForSequenceClassification.from_pretrained(
                    model_path
                )

                self.model.to(self.device)
                self.model.eval()

                self.use_fallback = False

                print("IndoBERT model loaded successfully.")

            except Exception as e:
                print(
                    f"Error loading IndoBERT model: {e}. "
                    "Using fallback."
                )
                self.use_fallback = True

        else:
            print(
                f"IndoBERT model files not found at {model_path}. "
                "Using fallback."
            )
            self.use_fallback = True

    # ============================================================
    # PREDIKSI SATU KOMENTAR
    # ============================================================

    def predict_sentiment(self, text):
        self.init_model()

        text = str(text).strip()

        if not text:
            raise ValueError("Teks komentar tidak boleh kosong.")

        if (
            not self.use_fallback
            and self.model is not None
            and self.tokenizer is not None
        ):
            try:
                inputs = self.tokenizer(
                    text,
                    return_tensors="pt",
                    padding=True,
                    truncation=True,
                    max_length=128
                )

                inputs = {
                    k: v.to(self.device)
                    for k, v in inputs.items()
                }

                with torch.no_grad():
                    logits = self.model(**inputs).logits

                probabilities = torch.nn.functional.softmax(
                    logits,
                    dim=-1
                ).cpu().numpy()[0]

                pred_idx = int(np.argmax(probabilities))

                labels = [
                    "Negatif",
                    "Netral",
                    "Positif"
                ]

                sentiment = labels[pred_idx]

                probability_map = {
                    "Negatif": float(probabilities[0]),
                    "Netral": float(probabilities[1]),
                    "Positif": float(probabilities[2])
                }

                confidence = float(probabilities[pred_idx])

                return {
                    "sentiment": sentiment,
                    "confidence": confidence,
                    "probabilities": probability_map,
                    "method": "IndoBERT"
                }

            except Exception as e:
                print(
                    f"Error during IndoBERT prediction: {e}. "
                    "Using fallback."
                )

        return self._fallback_predict(text)

    # ============================================================
    # PREDIKSI BATCH
    # ============================================================

    def predict_batch(self, texts, batch_size: int = 32):
        """
        Prediksi banyak teks sekaligus.

        Return:
        [
            {
                "sentiment": "...",
                "confidence": 0.xxx,
                "probabilities": {...},
                "method": "IndoBERT"
            }
        ]
        """

        self.init_model()

        if not texts:
            return []

        if (
            self.use_fallback
            or self.model is None
            or self.tokenizer is None
        ):
            return [
                self._fallback_predict(str(text))
                for text in texts
            ]

        labels = [
            "Negatif",
            "Netral",
            "Positif"
        ]

        results = []

        for i in range(0, len(texts), batch_size):

            batch = [
                str(t).strip()
                for t in texts[i:i + batch_size]
            ]

            inputs = self.tokenizer(
                batch,
                return_tensors="pt",
                padding=True,
                truncation=True,
                max_length=128
            )

            inputs = {
                k: v.to(self.device)
                for k, v in inputs.items()
            }

            with torch.no_grad():
                logits = self.model(**inputs).logits

            probabilities = torch.nn.functional.softmax(
                logits,
                dim=-1
            ).cpu().numpy()

            preds = np.argmax(
                probabilities,
                axis=-1
            )

            for pred_idx, probs in zip(
                preds,
                probabilities
            ):
                pred_idx = int(pred_idx)

                probability_map = {
                    "Negatif": float(probs[0]),
                    "Netral": float(probs[1]),
                    "Positif": float(probs[2])
                }

                results.append({
                    "sentiment": labels[pred_idx],
                    "confidence": float(probs[pred_idx]),
                    "probabilities": probability_map,
                    "method": "IndoBERT"
                })

        return results

    # ============================================================
    # FALLBACK
    # ============================================================

    def _fallback_predict(self, text):
        text_lower = text.lower()

        neg = [
            "lama",
            "antri",
            "kecewa",
            "lambat",
            "mahal",
            "buruk",
            "antrean",
            "antrian",
            "judes",
            "galak",
            "kotor",
            "capek",
            "ribet"
        ]

        pos = [
            "puas",
            "cepat",
            "bagus",
            "bersih",
            "ramah",
            "mudah",
            "membantu",
            "terima kasih",
            "senang",
            "sehat",
            "rekomendasi"
        ]

        neg_score = sum(
            1 for word in neg
            if word in text_lower
        )

        pos_score = sum(
            1 for word in pos
            if word in text_lower
        )

        if neg_score > pos_score:
            label = "Negatif"
        elif pos_score > neg_score:
            label = "Positif"
        else:
            label = "Netral"

        return {
            "sentiment": label,
            "confidence": None,
            "probabilities": {},
            "method": "Rule-Based"
        }


sentiment_service = SentimentService()