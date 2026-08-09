from app import db
from datetime import datetime


class History(db.Model):
    __tablename__ = "history"

    id = db.Column(db.Integer, primary_key=True)

    # ============================================================
    # INPUT
    # ============================================================

    keyword = db.Column(db.String(255))
    comment = db.Column(db.Text)

    # ============================================================
    # HASIL INDOBERTWEET
    # ============================================================

    sentiment = db.Column(db.String(20))
    confidence = db.Column(db.Float)
    probabilities = db.Column(db.JSON)

    # ============================================================
    # STRATEGY
    # ============================================================

    angle = db.Column(db.String(100))
    periode = db.Column(db.String(20))

    # ============================================================
    # METADATA
    # ============================================================

    timestamp = db.Column(db.String(50))
    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    # ============================================================
    # STRATEGY RECOMMENDATION
    # ============================================================

    recommended_strategy = db.Column(db.JSON)

    # ============================================================
    # RELATIONSHIP IDEAS
    # ============================================================

    ideas = db.relationship(
        "GeneratedIdea",
        backref="history",
        lazy=True,
        cascade="all, delete-orphan"
    )

    # ============================================================
    # TO DICT
    # ============================================================

    def to_dict(self):
        return {
            "id": self.id,

            # Input
            "keyword": self.keyword,
            "topic": self.keyword,
            "comment": self.comment,

            # Hasil IndoBERTweet
            "sentiment": self.sentiment,
            "confidence": self.confidence,
            "probabilities": self.probabilities,

            # Strategy
            "angle": self.angle,
            "periode": self.periode,
            "recommended_strategy": self.recommended_strategy,

            # Metadata
            "timestamp": self.timestamp,

            # Ideas
            "ideas": [
                idea.to_dict()
                for idea in self.ideas
            ]
        }