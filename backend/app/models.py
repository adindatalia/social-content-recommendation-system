from app import db
from datetime import datetime

class History(db.Model):
    __tablename__ = 'history'
    
    id = db.Column(db.Integer, primary_key=True)
    keyword = db.Column(db.String(255), nullable=False)
    angle = db.Column(db.String(100), nullable=False)
    periode = db.Column(db.String(50), nullable=False) # e.g. "7"
    timestamp = db.Column(db.String(100), default=lambda: datetime.now().strftime("%d %B %Y, %H:%M"))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationship to GeneratedIdea: one history search has many generated ideas
    ideas = db.relationship('GeneratedIdea', backref='history', lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": f"hist-{self.id}",
            "keyword": self.keyword,
            "angle": self.angle,
            "periode": self.periode,
            "timestamp": self.timestamp,
            "result": {
                "keyword": self.keyword,
                "angle": self.angle,
                "periode": f"{self.periode} Hari",
                "timestamp": self.timestamp,
                "ideas": [idea.to_dict() for idea in self.ideas]
            }
        }


class GeneratedIdea(db.Model):
    __tablename__ = 'generated_ideas'
    
    id = db.Column(db.Integer, primary_key=True)
    history_id = db.Column(db.Integer, db.ForeignKey('history.id', ondelete='CASCADE'), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    format = db.Column(db.String(100), nullable=False) 
    category = db.Column(db.String(100), nullable=False) # e.g. "Address Pain Point"
    hook = db.Column(db.Text, nullable=False)
    body = db.Column(db.Text, nullable=False)
    cta = db.Column(db.Text, nullable=False)
    hashtags = db.Column(db.JSON, nullable=False) # Stores list of strings, e.g. ["antrianrs", "tips"]
    justification = db.Column(db.Text, nullable=False)
    is_saved = db.Column(db.Boolean, default=False)
    
    def to_dict(self):
        return {
            "id": f"idea-{self.id}",
            "title": self.title,
            "format": self.format,
            "category": self.category,
            "hook": self.hook,
            "body": self.body,
            "cta": self.cta,
            "hashtags": self.hashtags,
            "justification": self.justification,
            "is_saved": self.is_saved
        }


class Draft(db.Model):
    __tablename__ = 'drafts'
    
    id = db.Column(db.Integer, primary_key=True)
    idea_id = db.Column(db.Integer, db.ForeignKey('generated_ideas.id', ondelete='CASCADE'), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationship to get details of the draft idea
    idea = db.relationship('GeneratedIdea', backref=db.backref('draft', uselist=False))
    
    def to_dict(self):
        return {
            "id": f"draft-{self.id}",
            "idea_id": f"idea-{self.idea_id}",
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            "idea_details": self.idea.to_dict() if self.idea else None
        }
