from app.services.embedding_service import embedding_service
import pandas as pd

# Cache global (diisi sekali saat startup)
_COMMENTS: list[dict] = []


def load_dataset(csv_path: str) -> int:
    """Baca CSV, normalisasi nama kolom, simpan ke cache. Return jumlah baris."""
    global _COMMENTS

    df = pd.read_csv(csv_path)

    # Pastikan kolom yang dibutuhkan ada; beri nilai default bila tidak
    def col(row, *names, default=""):
        for n in names:
            if n in row and pd.notna(row[n]):
                return row[n]
        return default

    records = []
    for _, row in df.iterrows():
        records.append({
            "text": col(row, "full_text", default=""),
            "normalized_text": col(row, "normalisasi", "normalized_text", "cleaning", default=""),
            "sentiment": str(col(row, "sentiment", default="")).strip(),
            "created_at": col(row, "created_at", default=""),
            "favorite_count": int(col(row, "favorite_count", default=0) or 0),
        })

    _COMMENTS = records
    print(f"[dataset_final] Dataset dimuat: {len(_COMMENTS)} komentar dari {csv_path}")
    embedding_service.build_embeddings(_COMMENTS)
    print("[dataset_final] Embedding selesai dibuat.")
    return len(_COMMENTS)


def get_all_comments() -> list[dict]:
    """Kembalikan seluruh komentar (referensi cache)."""
    return _COMMENTS