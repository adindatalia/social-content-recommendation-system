from collections import Counter
import re

from app.services.sentiment_service import sentiment_service


_STOPWORDS = {
    "yang", "di", "ke", "dari", "dan", "atau", "ini", "itu",
    "untuk", "dengan", "pada", "ada", "aku", "saya",
    "kamu", "dia", "mereka", "kita", "kami",
    "tidak", "gak", "ga", "nya", "sih", "aja",
    "ya", "juga", "udah", "sudah", "lagi",
    "kalau", "kalo", "karena", "jadi",
    "bisa", "mau", "kayak", "gitu",
    "banget", "buat", "kah",
    "pun", "tapi", "sama",
    "pakai", "pake", "masih",
    "lebih", "cuma", "bukan",
    "dalam", "oleh",
    "seperti", "hingga",
    "saat", "semua",
    "https", "http", "www",
    "amp", "rt"
}


_GENERIC_WORDS = {
    "rumah",
    "sakit",
    "kesehatan",
    "klinik",
    "dokter",
    "pasien",
    "bpjs"
}


_COMPLAINT_SIGNALS = {
    "lama",
    "lambat",
    "antri",
    "antrean",
    "mahal",
    "ribet",
    "susah",
    "sulit",
    "kecewa",
    "buruk",
    "jelek",
    "parah",
    "kotor",
    "penuh",
    "menunggu",
    "nunggu",
    "ditolak",
    "gagal",
    "error",
    "rusak",
    "bingung",
    "rumit",
    "biaya",
    "bayar",
    "klaim",
    "prosedur",
    "syarat"
}


# ============================================================
# ANALISIS SATU KOMENTAR
# ============================================================

def analyze_comment(comment):
    """
    Menganalisis satu komentar menggunakan IndoBERTweet.

    Return:
        {
            "text": str,
            "sentiment": str,
            "confidence": float | None,
            "probabilities": dict,
            "method": str
        }
    """

    text = (comment or "").strip()

    if not text:
        raise ValueError("Komentar tidak boleh kosong.")

    result = sentiment_service.predict_sentiment(text)

    return {
        "text": text,
        "sentiment": result["sentiment"],
        "confidence": result["confidence"],
        "probabilities": result["probabilities"],
        "method": result["method"],
    }


# ============================================================
# ANALISIS BATCH / DATASET LAMA
# Tetap dipertahankan untuk kebutuhan insight umum.
# ============================================================

def predict_sentiments(comments):
    if not comments:
        return []

    texts = [
        c.get("normalized_text")
        or c.get("text")
        or ""
        for c in comments
    ]

    predictions = sentiment_service.predict_batch(texts)

    result = []

    for comment, prediction in zip(comments, predictions):
        item = comment.copy()

        # Mendukung format baru predict_batch()
        if isinstance(prediction, dict):
            item["predicted_sentiment"] = prediction.get(
                "sentiment"
            )
            item["confidence"] = prediction.get(
                "confidence"
            )
            item["probabilities"] = prediction.get(
                "probabilities",
                {}
            )
            item["prediction_method"] = prediction.get(
                "method"
            )

        # Fallback jika masih ada format lama
        else:
            item["predicted_sentiment"] = prediction

        result.append(item)

    return result


def compute_distribution(comments):
    total = len(comments)

    if total == 0:
        return {
            "Negatif": 0,
            "Netral": 0,
            "Positif": 0
        }

    counter = Counter(
        c.get("predicted_sentiment")
        for c in comments
    )

    return {
        "Negatif": round(
            counter.get("Negatif", 0)
            / total * 100
        ),
        "Netral": round(
            counter.get("Netral", 0)
            / total * 100
        ),
        "Positif": round(
            counter.get("Positif", 0)
            / total * 100
        ),
    }


# ============================================================
# TEXT PROCESSING
# Dipertahankan untuk insight umum / legacy.
# ============================================================

def _clean_tokens(text):
    text = (text or "").lower()

    text = re.sub(
        r"http\S+|www\S+",
        " ",
        text
    )

    text = re.sub(
        r"\d+",
        " ",
        text
    )

    tokens = re.findall(
        r"[a-z]+",
        text
    )

    return [
        token
        for token in tokens
        if len(token) >= 4
        and token not in _STOPWORDS
        and token not in _GENERIC_WORDS
    ]


def extract_phrases(texts, top_n=5):
    counter = Counter()

    for text in texts:
        tokens = _clean_tokens(text)

        for a, b in zip(
            tokens,
            tokens[1:]
        ):
            phrase = f"{a} {b}"
            counter[phrase] += 1

    return [
        {
            "keyword": keyword,
            "count": count
        }
        for keyword, count
        in counter.most_common(top_n)
    ]


def extract_pain_points(comments):
    grouped = {
        "Negatif": [],
        "Netral": [],
        "Positif": []
    }

    for comment in comments:
        sentiment = comment.get(
            "predicted_sentiment"
        )

        if sentiment in grouped:
            grouped[sentiment].append(
                comment.get("normalized_text")
                or comment.get("text")
                or ""
            )

    return {
        "negative": extract_phrases(
            grouped["Negatif"]
        ),
        "neutral": extract_phrases(
            grouped["Netral"]
        ),
        "positive": extract_phrases(
            grouped["Positif"]
        )
    }


def build_insight(comments):
    comments = predict_sentiments(
        comments
    )

    distribution = compute_distribution(
        comments
    )

    dominant_phrases = extract_pain_points(
        comments
    )

    return {
        "total_comments": len(comments),
        "distribution": distribution,
        "dominant_phrases": dominant_phrases,
        "comments": comments
    }


# ============================================================
# FORMAT INSIGHT UNTUK FRONTEND
# ============================================================

def _dominant_phrases_to_pain_points(
    dominant_phrases,
    top_n=5
):
    """
    Mengubah hasil dominant_phrases menjadi
    format yang digunakan halaman insight frontend.
    """

    negative = dominant_phrases.get(
        "negative",
        []
    )[:top_n]

    if not negative:
        return []

    max_count = max(
        phrase["count"]
        for phrase in negative
    ) or 1

    return [
        {
            "text": phrase["keyword"].capitalize(),
            "count": f'{phrase["count"]} sebutan',
            "pct": round(
                (
                    phrase["count"]
                    / max_count
                ) * 100
            )
        }
        for phrase in negative
    ]


def build_general_insight(
    comments,
    top_n=5
):
    """
    Insight umum seluruh dataset.
    Dipakai oleh insight_cache saat startup.
    """

    insight = build_insight(
        comments
    )

    return {
        "total_comments": insight[
            "total_comments"
        ],
        "distribution": insight[
            "distribution"
        ],
        "pain_points": _dominant_phrases_to_pain_points(
            insight["dominant_phrases"],
            top_n
        )
    }