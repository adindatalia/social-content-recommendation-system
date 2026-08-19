import json
import os
import re
from functools import lru_cache


RESOURCE_PATH = os.path.join(
    os.path.dirname(os.path.dirname(__file__)),
    "resources",
    "normalization_dictionary.json",
)


@lru_cache(maxsize=1)
def _load_normalization_dictionary() -> dict[str, str]:
    if not os.path.exists(RESOURCE_PATH):
        raise RuntimeError(
            "Kamus normalisasi tidak ditemukan. "
            "Pastikan backend/app/resources/normalization_dictionary.json tersedia."
        )

    with open(RESOURCE_PATH, "r", encoding="utf-8") as file:
        data = json.load(file)

    return {
        str(key): str(value)
        for key, value in data.items()
    }


def preprocess_text(text: str) -> str:
    """
    Preprocessing inference yang disamakan dengan pipeline training:
    1. case folding
    2. cleansing mention, hashtag, retweet marker, URL, karakter khusus
    3. normalisasi kata menggunakan kamus yang sama dengan training

    Stopword removal dan stemming tidak digunakan.
    """
    value = str(text or "").strip()

    if not value:
        raise ValueError("Teks komentar tidak boleh kosong.")

    # Tahap 1 — Case folding
    value = value.lower()

    # Tahap 2 — Cleansing
    value = re.sub(r"@[A-Za-z0-9_]+", "", value)
    value = re.sub(r"#\w+", "", value)
    value = re.sub(r"RT[\s]+", "", value)
    value = re.sub(r"https?://\S+", "", value)
    value = re.sub(r"[^A-Za-z0-9 ]", " ", value)
    value = re.sub(r"\s+", " ", value).strip()

    if not value:
        raise ValueError("Komentar kosong setelah preprocessing.")

    # Tahap 3 — Normalisasi kata
    normalization_dictionary = _load_normalization_dictionary()
    words = value.split()
    normalized = " ".join(
        normalization_dictionary.get(word, word)
        for word in words
    )

    return normalized.strip()
