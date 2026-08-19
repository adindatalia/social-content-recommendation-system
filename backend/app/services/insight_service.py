from app.services.sentiment_service import sentiment_service


def analyze_comment(comment: str) -> dict: # Menganalisis satu komentar menggunakan IndoBERTweet. """

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