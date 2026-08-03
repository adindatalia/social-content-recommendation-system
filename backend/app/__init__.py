from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from config import Config
from urllib.parse import urlsplit
import os

db = SQLAlchemy()
cors = CORS()

def _log_database_target(uri: str) -> None:
    """
    Cetak host/nama database (TANPA password) yang dipakai backend saat
    startup. Supaya gampang diverifikasi apakah ini database yang sama
    dengan yang dibuka di pgAdmin -- penyebab paling umum "data tidak
    muncul di pgAdmin" adalah backend & pgAdmin nyambung ke database
    yang berbeda.
    """
    try:
        parts = urlsplit(uri)
        target = f"{parts.hostname}:{parts.port or ''}{parts.path}"
    except Exception:
        target = "(gagal parse DATABASE_URL)"
    print(f"[startup] Backend akan menyimpan history ke database: {target}")


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    _log_database_target(app.config["SQLALCHEMY_DATABASE_URI"])

    db.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": "*"}})

    # Register routes
    from app.routes.insight import insight_bp
    from app.routes.generate import generate_bp
    from app.routes.history import history_bp
    from app.routes.analyze import analyze_bp
    from app.services import data_loader, insight_cache
    from app.services.insight_service import build_general_insight

    app.register_blueprint(insight_bp)
    app.register_blueprint(generate_bp)
    app.register_blueprint(history_bp)
    app.register_blueprint(analyze_bp)

    # Semua proses yang butuh app context (db, load dataset, DAN precompute
    # insight -- yang di dalamnya memanggil sentiment_service.init_model()
    # via current_app.config) HARUS jalan di dalam app context yang sama.
    # Sebelumnya precompute insight jalan DI LUAR app context, jadi
    # current_app tidak tersedia -> precompute gagal diam-diam saat
    # startup, dan IndoBERT baru benar-benar dimuat saat request pertama
    # masuk (karena Flask otomatis mendorong app context per-request).
    with app.app_context():
        db.create_all()
        print("[startup] Tabel database siap (db.create_all selesai).")

        csv_path = os.path.join(
            os.path.dirname(os.path.dirname(__file__)),
            "data",
            "dataset_final.csv"
        )
        data_loader.load_dataset(csv_path)

        print("[startup] Menghitung ringkasan insight umum dari dataset (memuat IndoBERT jika belum)...")
        insight_cache.set(build_general_insight(data_loader.get_all_comments()))
        print("[startup] Ringkasan insight umum siap (precomputed & di-cache).")

    return app
