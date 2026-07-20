from flask import Blueprint, request, jsonify
from app.services.sentiment_service import sentiment_service

analyze_bp = Blueprint(
    "analyze",
    __name__,
    url_prefix="/api"
)


@analyze_bp.route("/analyze", methods=["POST"])
def analyze():

    data = request.get_json()

    if not data:
        return jsonify({
            "error": "Request body kosong"
        }), 400

    text = data.get("text")

    if not text:
        return jsonify({
            "error": "Field 'text' wajib diisi"
        }), 400

    result = sentiment_service.predict_sentiment(text)

    return jsonify(result)