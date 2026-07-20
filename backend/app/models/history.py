from app import db
from datetime import datetime

class History(db.Model):
    __tablename__ = "history"

    id = db.Column(db.Integer, primary_key=True)
    keyword = db.Column(db.String(255))
    angle = db.Column(db.String(100))
    periode = db.Column(db.String(20))
    timestamp = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "keyword": self.keyword,
            "angle": self.angle,
            "periode": self.periode,
            "timestamp": self.timestamp,
        }