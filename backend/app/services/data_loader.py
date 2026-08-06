from app.services.embedding_service import embedding_service
import pandas as pd
import re

# Cache global (diisi sekali saat startup)
_COMMENTS: list[dict] = []

def is_valid_comment(text: str) -> bool:
    """
    Filter komentar yang layak dipakai untuk semantic search.
    """

    if not text:
        return False

    text = str(text).strip().lower()

    # terlalu pendek
    if len(text) < 20:
        return False

    # terlalu banyak link
    if text.count("http") >= 2:
        return False

    # dominan karakter non latin
    latin = len(re.findall(r"[a-z]", text))
    nonlatin = len(re.findall(r"[^\x00-\x7F]", text))

    if nonlatin > latin:
        return False

    return True

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

        text = col(row, "full_text", default="")

        normalized = col(
            row,
            "normalisasi",
            "normalized_text",
            "cleaning",
            default=""
        )

        # filter komentar yang tidak layak
        if not is_valid_comment(normalized):
            continue

        records.append({
            "text": text,
            "normalized_text": normalized,
            "sentiment": str(
                col(row, "sentiment", default="")
            ).strip(),
            "created_at": col(
                row,
                "created_at",
                default=""
            ),
            "favorite_count": int(
                col(row, "favorite_count", default=0) or 0
            ),
        })

    _COMMENTS = records
    print("=" * 60)
    print("STATISTIK DATASET")
    print("=" * 60)
    print(f"Data awal      : {len(df)}")
    print(f"Data dipakai   : {len(records)}")
    print(f"Data dibuang   : {len(df) - len(records)}")
    print("=" * 60)
    print(f"[dataset_final] Dataset dimuat: {len(_COMMENTS)} komentar dari {csv_path}")
    embedding_service.build_embeddings(_COMMENTS)
    print("[dataset_final] Embedding selesai dibuat.")
    return len(_COMMENTS)


def get_all_comments() -> list[dict]:
    """Kembalikan seluruh komentar (referensi cache)."""
    return _COMMENTS