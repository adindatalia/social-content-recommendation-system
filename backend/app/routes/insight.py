from flask import Blueprint, jsonify

from app.services import insight_cache

insight_bp = Blueprint("insight", __name__)


@insight_bp.route("/api/insights", methods=["GET"])
def get_insights():
    """
    Ringkasan awal (sebelum user menganalisis keyword apa pun) -- dari
    SELURUH dataset asli. Dataset statis, jadi ringkasan ini dihitung
    SEKALI saat server startup (app/__init__.py, di dalam app context)
    dan disimpan di insight_cache.

    Endpoint ini TIDAK PERNAH memanggil build_insight()/IndoBERT sendiri
    -- kalau cache belum siap (precompute gagal saat startup), balas 503
    daripada diam-diam menghitung ulang saat request masuk.
    """
    cached = insight_cache.get()
    if cached is None:
        return jsonify({
            "error": "insight_not_ready",
            "message": "Ringkasan insight belum siap. Cek log server: precompute saat startup kemungkinan gagal.",
        }), 503
    return jsonify(cached)
