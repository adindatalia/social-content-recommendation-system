from datetime import datetime
from flask import Blueprint, request, jsonify
import traceback

from app.services.keyword_service import get_comments_by_keyword
from app.services.insight_service import build_insight
from app.services.strategy_service import resolve_strategy
from app.services.llm_service import generate_ideas
from app.services.history_service import save_history

generate_bp = Blueprint("generate", __name__)


@generate_bp.route("/api/generate", methods=["POST"])
def generate():
    data = request.get_json(silent=True) or {}
    keyword = (data.get("keyword") or "").strip()
    chosen_angle = data.get("angle")            # boleh None -> auto
    periode = data.get("periode", "7")

    if not keyword:
        return jsonify({"error": "keyword_required", "message": "Keyword wajib diisi"}), 400

    # 1. Ambil komentar sesuai keyword
    comments = get_comments_by_keyword(keyword)
    if len(comments) == 0:
        return jsonify({
            "error": "no_data",
            "message": f"Tidak ada komentar yang cocok dengan '{keyword}'"
        }), 404

    # 2. Insight: distribusi + frasa dominan per kategori sentimen (IndoBERT + ekstraksi frasa)
    insight = build_insight(comments)

    # 3. Strategi final (pakai pilihan user kalau ada, kalau tidak auto) + reasoning
    strategy = resolve_strategy(insight["distribution"], chosen=chosen_angle, dominant_phrases=insight["dominant_phrases"])

    # 4. Generate ide via LLM
    try:
        ideas = generate_ideas(
            keyword=keyword,
            distribution=insight["distribution"],
            dominant_phrases=insight["dominant_phrases"],
            strategy=strategy,
        )
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "generation_failed", "message": str(e)}), 500

    # 5. Lengkapi tiap ide dengan 'category' (= label strategi)
    for idea in ideas:
        idea["category"] = strategy["label"]

    result = {
        "keyword": keyword,
        "angle": strategy["label"],
        "periode": periode,
        "timestamp": datetime.now().isoformat(timespec="seconds"),
        "ideas": ideas,
        "strategy": strategy,
        "dominant_phrase": insight["dominant_phrases"],
        "distribution": insight["distribution"],
    }

    # 6. Simpan history 
    try:
        save_history(result, strategy_key=strategy["key"])
    except Exception:
        traceback.print_exc()   

    return jsonify(result)