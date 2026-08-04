from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from config import Config
import os

db = SQLAlchemy()
cors = CORS()


def create_app(config_class=Config):

    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)

    cors.init_app(
        app,
        resources={
            r"/api/*": {
                "origins": "*"
            }
        }
    )

    # Register routes
    from app.routes.insight import insight_bp
    from app.routes.generate import generate_bp
    from app.routes.history import history_bp
    from app.routes.analyze import analyze_bp

    app.register_blueprint(insight_bp)
    app.register_blueprint(generate_bp)
    app.register_blueprint(history_bp)
    app.register_blueprint(analyze_bp)

    with app.app_context():

        db.create_all()

        print(
            "[startup] Database tables initialized successfully."
        )

        # Load dataset + embedding sekali saat startup
        from app.services import data_loader

        csv_path = os.path.join(
            os.path.dirname(os.path.dirname(__file__)),
            "data",
            "dataset_final.csv"
        )

        data_loader.load_dataset(csv_path)

        print("[startup] Dataset siap.")

    return app