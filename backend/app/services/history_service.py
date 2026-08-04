from app import db
from app.models import History, GeneratedIdea


def save_history(result: dict, strategy_key: str | None = None) -> int:
    """
    Simpan hasil generate ke tabel history.
    Return id record yang tersimpan.
    """

    try:
        record = History(
            keyword=result.get("keyword", ""),
            angle=result.get("angle", ""),
            periode=str(result.get("periode", "")),
            timestamp=result.get("timestamp", ""),

            distribution=result.get("distribution"),
            dominant_phrase=result.get("dominant_phrase"),
            recommended_strategy=result.get("strategy"),
        )

        db.session.add(record)
        db.session.flush()


        ideas = result.get("ideas", [])

        for idea in ideas:
            new_idea = GeneratedIdea(
                history_id=record.id,
                title=idea.get(
                    "title",
                    f"Ide untuk {record.keyword}"
                ),
                format=idea.get(
                    "format",
                    "Opsi 1"
                ),
                category=idea.get(
                    "category",
                    record.angle
                ),
                hook=idea.get("hook", ""),
                body=idea.get("body", ""),
                cta=idea.get("cta", ""),
                hashtags=idea.get("hashtags", []),
                justification=idea.get("justification", "")
            )

            db.session.add(new_idea)


        db.session.commit()

        print(f"[history] berhasil tersimpan id={record.id}")

        return record.id


    except Exception as e:

        db.session.rollback()

        print("[history] gagal:", e)

        raise e



def get_all_history(limit: int = 50) -> list[dict]:

    rows = (
        History.query
        .order_by(History.created_at.desc())
        .limit(limit)
        .all()
    )

    return [
        r.to_dict()
        for r in rows
    ]



def get_history_by_id(history_id: int) -> dict | None:

    row = History.query.get(history_id)

    if not row:
        return None

    data = row.to_dict()

    data["ideas"] = [
        idea.to_dict()
        for idea in row.ideas
    ]

    return data