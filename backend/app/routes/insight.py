import json
import os

from flask import Blueprint, jsonify

insight_bp = Blueprint("insight", __name__)

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
JSON_PATH = os.path.join(BASE_DIR, "data", "dashboard_summary.json")


@insight_bp.route("/api/insights", methods=["GET"])
def get_insights():
    try:
        with open(JSON_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)

        return jsonify(data)

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500