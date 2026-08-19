import logging
import os
from typing import Any, Optional

import numpy as np
import torch
from flask import current_app
from transformers import AutoModelForSequenceClassification, AutoTokenizer, PreTrainedModel

from app.services.preprocessing_service import preprocess_text


logger = logging.getLogger(__name__)

LABELS = ["Negatif", "Netral", "Positif"]


class SentimentService:
    model: Optional[PreTrainedModel]
    tokenizer: Optional[Any]

    def __init__(self):
        self.model = None
        self.tokenizer = None
        self.device = torch.device(
            "cuda" if torch.cuda.is_available() else "cpu"
        )

    def init_model(self) -> None:
        if self.model is not None and self.tokenizer is not None:
            return

        model_path = current_app.config["INDOBERT_MODEL_PATH"]

        required_files = [
            "config.json",
            "tokenizer.json",
            "tokenizer_config.json",
        ]

        missing_files = [
            filename
            for filename in required_files
            if not os.path.exists(os.path.join(model_path, filename))
        ]

        weight_exists = any(
            os.path.exists(os.path.join(model_path, filename))
            for filename in ("model.safetensors", "pytorch_model.bin")
        )

        if missing_files or not weight_exists:
            details = []
            if missing_files:
                details.append(
                    "file wajib hilang: " + ", ".join(missing_files)
                )
            if not weight_exists:
                details.append(
                    "model.safetensors/pytorch_model.bin tidak ditemukan"
                )

            raise RuntimeError(
                "Checkpoint IndoBERTweet belum lengkap di "
                f"{model_path} ({'; '.join(details)})."
            )

        try:
            logger.info(
                "Loading IndoBERTweet model from %s on device %s",
                model_path,
                self.device,
            )

            self.tokenizer = AutoTokenizer.from_pretrained(model_path)
            self.model = AutoModelForSequenceClassification.from_pretrained(
                model_path
            )
            self.model.to(self.device)
            self.model.eval()

            logger.info("IndoBERTweet model loaded successfully")
        except Exception as exc:
            self.model = None
            self.tokenizer = None
            raise RuntimeError(
                f"Gagal memuat checkpoint IndoBERTweet: {exc}"
            ) from exc

    def predict_sentiment(self, text: str) -> dict:
        self.init_model()

        if self.model is None or self.tokenizer is None:
            raise RuntimeError("Model IndoBERTweet belum siap digunakan.")

        processed_text = preprocess_text(text)
        print("RAW TEXT       :", text)
        print("PROCESSED TEXT :", processed_text)
        try:
            inputs = self.tokenizer(
                processed_text,
                return_tensors="pt",
                padding="max_length",
                truncation=True,
                max_length=128,
            )

            inputs = {
                key: value.to(self.device)
                for key, value in inputs.items()
            }

            with torch.no_grad():
                logits = self.model(**inputs).logits

            probabilities = torch.nn.functional.softmax(
                logits,
                dim=-1,
            ).cpu().numpy()[0]

            pred_idx = int(np.argmax(probabilities))

            probability_map = {
                label: float(probabilities[index])
                for index, label in enumerate(LABELS)
            }

            return {
                "sentiment": LABELS[pred_idx],
                "confidence": float(probabilities[pred_idx]),
                "probabilities": probability_map,
                "method": "IndoBERTweet",
            }
        except Exception as exc:
            raise RuntimeError(
                f"Gagal menjalankan inferensi IndoBERTweet: {exc}"
            ) from exc


sentiment_service = SentimentService()
