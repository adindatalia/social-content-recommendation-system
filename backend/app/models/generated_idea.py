from app import db

class GeneratedIdea(db.Model):
    __tablename__ = "generated_ideas"

    id = db.Column(db.Integer, primary_key=True)

    history_id = db.Column(
        db.Integer,
        db.ForeignKey("history.id")
    )

    title = db.Column(db.Text)
    format = db.Column(db.String(100))
    category = db.Column(db.String(100))
    hook = db.Column(db.Text)
    body = db.Column(db.Text)
    cta = db.Column(db.Text)
    hashtags = db.Column(db.JSON)
    justification = db.Column(db.Text)
    is_saved = db.Column(db.Boolean, default=False)