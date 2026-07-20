"""
history_service.py
------------------
Menyimpan dan mengambil riwayat pembuatan ide konten dari PostgreSQL.
"""
from app import db
from app.models import History, GeneratedIdea



def save_history(result: dict, strategy_key: str | None = None) -> int:
    """
    Simpan hasil generate ke tabel history.
    `result` adalah dict output endpoint /api/generate.
    Return id record yang tersimpan.
    """
    record = History(
        keyword=result.get("keyword", ""),
        angle=result.get("angle", ""),
        periode=str(result.get("periode", "")),
        timestamp=result.get("timestamp", "")
    )
    db.session.add(record)
    db.session.flush() # flush to get record.id

    # Add the ideas to GeneratedIdea model
    ideas = result.get("ideas", [])
    for idea in ideas:
        new_idea = GeneratedIdea(
            history_id=record.id,
            title=idea.get("title", f"Ide untuk {record.keyword}"),
            format=idea.get("format", "TIKTOK - REELS"),
            category=idea.get("category", record.angle),
            hook=idea.get("hook", ""),
            body=idea.get("body", ""),
            cta=idea.get("cta", ""),
            hashtags=idea.get("hashtags", []),
            justification=idea.get("justification", "")
        )
        db.session.add(new_idea)

    db.session.commit()
    return record.id


def get_all_history(limit: int = 50) -> list[dict]:
    """Ambil daftar riwayat terbaru (untuk tabel Riwayat di frontend)."""
    rows = (
        History.query
        .order_by(History.created_at.desc())
        .limit(limit)
        .all()
    )
    return [r.to_dict() for r in rows]


def get_history_by_id(history_id: int) -> dict | None:
    """Ambil satu riwayat (untuk fitur 'Muat Ulang')."""
    row = History.query.get(history_id)
    return row.to_dict() if row else None

