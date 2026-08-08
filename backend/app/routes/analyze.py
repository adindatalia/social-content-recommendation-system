from flask import Blueprint, request, jsonify

from app.services.insight_service import analyze_comment
from app.services.strategy_service import resolve_strategy


analyze_bp = Blueprint("analyze", __name__)


@analyze_bp.route("/api/analyze", methods=["POST"])
def analyze():
    data = request.get_json(silent=True) or {}

    # ============================================================
    # 1. Ambil input
    # ============================================================

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

    # ============================================================
    # 2. Analisis satu komentar dengan IndoBERTweet
    # ============================================================

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

    # ============================================================
    # 3. Tentukan strategi berdasarkan sentimen
    # ============================================================

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

    # ============================================================
    # 4. Response
    # ============================================================

    return jsonify({
        "topic": topic,
        "comment": comment,

        "sentiment": analysis["sentiment"],
        "confidence": analysis["confidence"],
        "probabilities": analysis["probabilities"],
        "method": analysis["method"],

        "strategy": strategy,
        "recommended_strategy": strategy,

        "mode": "single"
    })