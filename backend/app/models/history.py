from app import db
from datetime import datetime

class History(db.Model):
    __tablename__ = "history"

    id = db.Column(db.Integer, primary_key=True)
    keyword = db.Column(db.String(255))
    angle = db.Column(db.String(100))
    periode = db.Column(db.String(20))
    timestamp = db.Column(  db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    distribution = db.Column(db.JSON)
    dominant_phrase = db.Column(db.JSON)
    recommended_strategy = db.Column(db.JSON)

    ideas = db.relationship(
        "GeneratedIdea",
        backref="history",
        lazy=True,
        cascade="all, delete-orphan"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "keyword": self.keyword,
            "angle": self.angle,
            "periode": self.periode,
            "timestamp": self.timestamp,
            "distribution": self.distribution,
            "dominant_phrase": self.dominant_phrase,
            "recommended_strategy": self.recommended_strategy,
            "ideas": [idea.to_dict() for idea in self.ideas]
        }