from flask import Blueprint, request, jsonify

from app.services.insight_service import analyze_comment
from app.services.strategy_service import resolve_strategy


analyze_bp = Blueprint("analyze", __name__)


@analyze_bp.route("/api/analyze", methods=["POST"])
def analyze():
    data = request.get_json(silent=True) or {}

    # Ambil input

    topic = (data.get("topic") or "").strip()
    comment = (data.get("comment") or "").strip()
    chosen_angle = data.get("angle")

    if not topic:
        return jsonify({
            "error": "topic_required",
            "message": "Topik wajib diisi"
        }), 400

    if not comment:
        return jsonify({
            "error": "comment_required",
            "message": "Komentar wajib diisi"
        }), 400

    # Analisis satu komentar dengan IndoBERTweet

    try:
        analysis = analyze_comment(comment)

    except Exception as e:
        return jsonify({
            "error": "analysis_failed",
            "message": str(e)
        }), 500

    sentiment = analysis.get("sentiment")

    if not sentiment:
        return jsonify({
            "error": "sentiment_not_found",
            "message": "Hasil sentimen tidak ditemukan"
        }), 500

    # Tentukan strategi
    # Strategi ditentukan berdasarkan sentiment.
    # User tetap dapat memilih angle secara manual.

    try:
        strategy = resolve_strategy(
            sentiment=sentiment,
            chosen=chosen_angle
        )

    except Exception as e:
        return jsonify({
            "error": "strategy_failed",
            "message": str(e)
        }), 500

    # Response
    return jsonify({
        "topic": topic,
        "comment": comment,

        # Hasil IndoBERTweet
        "sentiment": analysis.get("sentiment"),
        "confidence": analysis.get("confidence"),
        "probabilities": analysis.get("probabilities", {}),
        "method": analysis.get("method", "IndoBERTweet"),

        # Hasil rekomendasi strategi
        "strategy": strategy,
        "recommended_strategy": strategy,

        # Mode analisis
        "mode": "single"
    })