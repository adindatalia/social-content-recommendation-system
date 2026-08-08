from flask import Blueprint, request, jsonify

from app.services.insight_service import build_insight
from app.services.strategy_service import resolve_strategy
from app.services.sentiment_service import sentiment_service

analyze_bp = Blueprint("analyze", __name__)


@analyze_bp.route("/api/analyze", methods=["POST"])
def analyze():
    data = request.get_json(silent=True) or {}

    keyword = (data.get("keyword") or "").strip()
    raw_comments = data.get("comments")

    if not keyword:
        return jsonify({
            "error": "keyword_required",
            "message": "Keyword wajib diisi"
        }), 400

    if not isinstance(raw_comments, list) or not raw_comments:
        return jsonify({
            "error": "comments_required",
            "message": "Minimal satu komentar wajib diisi"
        }), 400

    comments = [
        {
            "text": str(text).strip(),
            "normalized_text": str(text).strip()
        }
        for text in raw_comments
        if str(text).strip()
    ]

    if not comments:
        return jsonify({
            "error": "comments_empty",
            "message": "Komentar tidak boleh kosong"
        }), 400

    # ==================================================
    # 1. SINGLE COMMENT
    # ==================================================
    if len(comments) == 1:
        result = sentiment_service.predict_sentiment(
            comments[0]["text"]
        )

        return jsonify({
            "keyword": keyword,
            "mode": "single",
            "total_comments": 1,
            "sentiment": result["sentiment"],
            "probabilities": result["probabilities"],
            "method": result["method"]
        })

    # ==================================================
    # 2. MULTIPLE COMMENTS
    # ==================================================
    insight = build_insight(comments)

    strategy = resolve_strategy(
        insight["distribution"],
        chosen=None,
        dominant_phrases=insight["dominant_phrases"]
    )

    return jsonify({
        "keyword": keyword,
        "mode": "batch",
        "total_comments": insight["total_comments"],
        "distribution": insight["distribution"],
        "dominant_phrases": insight["dominant_phrases"],
        "recommended_strategy": strategy
    })