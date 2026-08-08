from datetime import datetime

from flask import Blueprint, request, jsonify
import traceback

from app.services.insight_service import analyze_comment
from app.services.strategy_service import resolve_strategy
from app.services.llm_service import generate_ideas
from app.services.history_service import save_history


generate_bp = Blueprint("generate", __name__)


@generate_bp.route("/api/generate", methods=["POST"])
def generate():
    data = request.get_json(silent=True) or {}

    # ============================================================
    # 1. Ambil input
    # ============================================================

    topic = (data.get("topic") or "").strip()
    comment = (data.get("comment") or "").strip()
    chosen_angle = data.get("angle")
    periode = data.get("periode", "7")

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
    # 2. Analisis satu komentar menggunakan IndoBERTweet
    #
    # Hasil:
    # - sentiment
    # - confidence
    # - probabilities
    # - method
    # ============================================================

    try:
        analysis = analyze_comment(comment)

    except Exception as e:
        traceback.print_exc()

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
    # 3. Tentukan strategi berdasarkan hasil sentimen
    #
    # IndoBERTweet → sentiment
    # sentiment → strategy rule
    #
    # Confidence TIDAK digunakan untuk menentukan strategi.
    # ============================================================

    try:
        strategy = resolve_strategy(
            sentiment=sentiment,
            chosen=chosen_angle
        )

    except Exception as e:
        traceback.print_exc()

        return jsonify({
            "error": "strategy_failed",
            "message": str(e)
        }), 500

    # ============================================================
    # 4. Generate ide dengan LLM
    #
    # LLM menerima:
    # - topic
    # - comment
    # - sentiment
    # - strategy
    #
    # Confidence dan probabilities TIDAK dikirim ke LLM.
    # ============================================================

    try:
        ideas = generate_ideas(
            topic=topic,
            comment=comment,
            sentiment=sentiment,
            strategy=strategy
        )

    except Exception as e:
        traceback.print_exc()

        return jsonify({
            "error": "generation_failed",
            "message": str(e)
        }), 500

    # ============================================================
    # 5. Tambahkan category ke setiap ide
    # ============================================================

    for idea in ideas:
        idea["category"] = strategy["label"]

    # ============================================================
    # 6. Bentuk response
    # ============================================================

    result = {
        "topic": topic,
        "comment": comment,

        # Hasil klasifikasi IndoBERTweet
        "sentiment": sentiment,
        "confidence": analysis.get("confidence"),
        "probabilities": analysis.get(
            "probabilities",
            {}
        ),
        "method": analysis.get(
            "method",
            "IndoBERT"
        ),

        # Hasil strategy rule
        "angle": strategy["label"],
        "strategy": strategy,

        # Metadata
        "periode": periode,
        "timestamp": datetime.now().isoformat(
            timespec="seconds"
        ),

        # Hasil LLM
        "ideas": ideas,
    }

    # ============================================================
    # 7. Simpan history
    # ============================================================

    try:
        save_history(
            result,
            strategy_key=strategy["key"]
        )

    except Exception:
        traceback.print_exc()

    return jsonify(result)