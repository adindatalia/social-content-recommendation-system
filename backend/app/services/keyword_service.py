from app.services.embedding_service import embedding_service

# Ambang minimal komentar agar analisis bermakna.
# Kalau hasil di threshold utama < MIN_COMMENTS, turunkan threshold bertahap.
MIN_COMMENTS = 30


def get_comments_by_keyword(keyword):
    """
    Cari komentar relevan via semantic search dengan ADAPTIVE THRESHOLD.

    Alur:
      1. Coba threshold ketat (0.40) -> hasil paling relevan.
      2. Kalau hasil terlalu sedikit (< MIN_COMMENTS), longgarkan bertahap
         (0.35, 0.30, 0.25) sampai dapat cukup komentar.
    Ini mencegah kasus keyword hanya dapat 10 komentar (bigram/pain point gagal).
    """
    for threshold in (0.40, 0.35, 0.30, 0.25):
        results = embedding_service.search(
            keyword,
            top_k=200,
            threshold=threshold,
        )
        if len(results) >= MIN_COMMENTS:
            print(f"[keyword_service] '{keyword}': {len(results)} komentar "
                  f"(threshold={threshold})")
            return results

    # Kalau tetap sedikit walau threshold sudah longgar, kembalikan apa adanya
    print(f"[keyword_service] '{keyword}': {len(results)} komentar "
          f"(threshold minimum 0.25 -- data memang sedikit)")
    return results
