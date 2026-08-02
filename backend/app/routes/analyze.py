from flask import Blueprint, request, jsonify

from app.services.keyword_service import get_comments_by_keyword
from app.services.insight_service import build_insight
from app.services.strategy_service import resolve_strategy

analyze_bp = Blueprint("analyze", __name__)


@analyze_bp.route("/api/analyze", methods=["POST"])
def analyze():
    data = request.get_json(silent=True) or {}
    keyword = (data.get("keyword") or "").strip()

    if not keyword:
        return jsonify({"error": "keyword_required", "message": "Keyword wajib diisi"}), 400

    # 1. Ambil komentar yang mengandung keyword (sudah berlabel dari knowledge base)
    comments = get_comments_by_keyword(keyword)

    if len(comments) == 0:
        return jsonify({
            "error": "no_data",
            "message": f"Tidak ada komentar yang cocok dengan '{keyword}'",
            "keyword": keyword
        }), 404

    # 2. Hitung distribusi + frasa dominan per kategori sentimen
    insight = build_insight(comments)

    # 3. Tentukan angle rekomendasi dari sentimen dominan + frasa dominan (reasoning)
    strategy = resolve_strategy(insight["distribution"], chosen=None, dominant_phrases=insight["dominant_phrases"])

    return jsonify({
        "keyword": keyword,
        "total_comments": insight["total_comments"],
        "distribution": insight["distribution"],
        "dominant_phrases": insight["dominant_phrases"],
        "recommended_strategy": strategy,
    })