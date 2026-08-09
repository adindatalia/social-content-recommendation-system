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
    # 1. AMBIL INPUT
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
    # 2. ANALISIS SATU KOMENTAR MENGGUNAKAN INDOBERTWEET
    #
    # Output:
    # - sentiment
    # - confidence
    # - probabilities
    # - method
    # ============================================================

    try:
        analysis = analyze_comment(comment)

        # ========================================================
        # DEBUG 1 — HASIL LANGSUNG DARI INDOBERTWEET
        # ========================================================

        print("\n")
        print("=" * 60)
        print("[DEBUG 1] HASIL ANALISIS INDOBERTWEET")
        print("=" * 60)
        print("Comment       :", comment)
        print("Sentiment     :", analysis.get("sentiment"))
        print("Confidence    :", analysis.get("confidence"))
        print("Probabilities :", analysis.get("probabilities"))
        print("Method        :", analysis.get("method"))
        print("Full Analysis :", analysis)
        print("=" * 60)

    except Exception as e:
        traceback.print_exc()

        return jsonify({
            "error": "analysis_failed",
            "message": str(e)
        }), 500

    # ============================================================
    # VALIDASI SENTIMENT
    # ============================================================

    sentiment = analysis.get("sentiment")

    if not sentiment:
        return jsonify({
            "error": "sentiment_not_found",
            "message": "Hasil sentimen tidak ditemukan"
        }), 500

    # ============================================================
    # 3. TENTUKAN STRATEGI
    #
    # Confidence TIDAK digunakan untuk menentukan strategi.
    # Strategi ditentukan berdasarkan sentiment + pilihan user.
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
    # 4. GENERATE IDE DENGAN LLM
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
    # 5. TAMBAHKAN CATEGORY KE SETIAP IDE
    # ============================================================

    for idea in ideas:
        idea["category"] = strategy["label"]

    # ============================================================
    # 6. BENTUK RESULT
    # ============================================================

    result = {
        # ========================================================
        # INPUT
        # ========================================================

        "topic": topic,
        "keyword": topic,
        "comment": comment,

        # ========================================================
        # HASIL INDOBERTWEET
        # ========================================================

        "sentiment": sentiment,

        "confidence": analysis.get(
            "confidence"
        ),

        "probabilities": analysis.get(
            "probabilities",
            {}
        ),

        "method": analysis.get(
            "method",
            "IndoBERTweet"
        ),


        # ========================================================
        # DOMINANT PHRASE
        # ========================================================

        "dominant_phrase": analysis.get(
            "dominant_phrase"
        ),

        # ========================================================
        # STRATEGY
        # ========================================================

        "angle": strategy["label"],
        "strategy": strategy,

        # ========================================================
        # METADATA
        # ========================================================

        "periode": periode,

        "timestamp": datetime.now().isoformat(
            timespec="seconds"
        ),

        # ========================================================
        # GENERATED IDEAS
        # ========================================================

        "ideas": ideas,
    }

    # ============================================================
    # DEBUG 2 — HASIL SEBELUM MASUK save_history()
    # ============================================================

    print("\n")
    print("=" * 60)
    print("[DEBUG 2] RESULT SEBELUM SAVE HISTORY")
    print("=" * 60)
    print("Sentiment     :", result.get("sentiment"))
    print("Confidence    :", result.get("confidence"))
    print("Probabilities :", result.get("probabilities"))
    print("=" * 60)

    # ============================================================
    # 7. SIMPAN HISTORY
    # ============================================================

    try:
        history_id = save_history(
            result,
            strategy_key=strategy["key"]
        )

        # ========================================================
        # DEBUG 3 — HASIL SETELAH save_history()
        # ========================================================

        print("\n")
        print("=" * 60)
        print("[DEBUG 3] HISTORY BERHASIL DISIMPAN")
        print("=" * 60)
        print("History ID    :", history_id)
        print("Sentiment     :", result.get("sentiment"))
        print("Confidence    :", result.get("confidence"))
        print("Probabilities :", result.get("probabilities"))
        print("=" * 60)

    except Exception:
        traceback.print_exc()

    # ============================================================
    # 8. RETURN RESPONSE
    # ============================================================

    return jsonify(result)