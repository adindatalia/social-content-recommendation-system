from flask import Blueprint, jsonify
from app import db
from app.models import History

history_bp = Blueprint('history', __name__)

@history_bp.route('/api/history', methods=['GET'])
def get_all_history():
    try:
        items = History.query.order_by(
            History.created_at.desc()
        ).all()

        return jsonify([
            item.to_dict() for item in items
        ]), 200

    except Exception as e:
        import traceback
        traceback.print_exc()

        return jsonify({
            "error": str(e)
        }), 500


@history_bp.route('/api/history/<string:hist_id>', methods=['GET'])
def get_history_by_id(hist_id):
    try:
        # Extract ID (removing prefix "hist-" if present in the ID)
        raw_id = hist_id
        if hist_id.startswith("hist-"):
            raw_id = hist_id.replace("hist-", "")
            
        item = History.query.get(int(raw_id))
        if not item:
            return jsonify({"error": "Riwayat tidak ditemukan"}), 404
            
        return jsonify(item.to_dict()), 200
    except ValueError:
        return jsonify({"error": "ID tidak valid"}), 400
    except Exception as e:
        print(f"Error retrieving history item {hist_id}: {e}")
        return jsonify({"error": "Gagal mengambil detail riwayat"}), 500


@history_bp.route('/api/history/<string:hist_id>', methods=['DELETE'])
def delete_history_by_id(hist_id):
    try:
        raw_id = hist_id
        if hist_id.startswith("hist-"):
            raw_id = hist_id.replace("hist-", "")
            
        item = History.query.get(int(raw_id))
        if not item:
            return jsonify({"error": "Riwayat tidak ditemukan"}), 404
            
        db.session.delete(item)
        db.session.commit()
        return jsonify({"message": "Riwayat berhasil dihapus"}), 200
    except ValueError:
        return jsonify({"error": "ID tidak valid"}), 400
    except Exception as e:
        db.session.rollback()
        print(f"Error deleting history item {hist_id}: {e}")
        return jsonify({"error": "Gagal menghapus riwayat"}), 500
