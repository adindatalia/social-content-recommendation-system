from collections import Counter
from app.services.sentiment_service import sentiment_service
import re

# Stopword untuk ekstraksi kata kunci tampilan (BUKAN untuk input BERT).
_STOPWORDS = {
    "yang", "di", "ke", "dari", "dan", "atau", "ini", "itu", "untuk", "dengan",
    "pada", "ada", "aku", "saya", "kamu", "dia", "mereka", "kita", "kami",
    "tidak", "gak", "ga", "nya", "sih", "aja", "kok", "deh", "ya", "juga",
    "udah", "sudah", "lagi", "biar", "kalau", "kalo", "karena", "jadi", "bisa",
    "mau", "kayak", "gitu", "banget", "bgt", "buat", "kah", "pun", "para",
    "tapi", "sama", "saja", "pakai", "pake", "akan", "masih", "kena", "harus",
    "gua", "gue", "lu", "loe", "orang", "bikin", "kenapa", "emang", "memang",
    "kan", "dong", "nih", "tuh", "yg", "sm", "dgn", "utk", "krn", "jd", "dr",
    "lebih", "cuma", "bukan", "sampe", "sampai", "waktu", "hari", "adalah",
    "dalam", "oleh", "akan", "telah", "sebagai", "agar", "supaya", "sangat",
    "seperti", "hingga", "setelah", "sebelum", "ketika", "saat", "juga", "pun",
    "tersebut", "yaitu", "antara", "hanya", "semua", "setiap", "maka", "bila",
    # kata generik yang bukan keluhan
    "https", "http", "www", "com", "amp", "rt", "via", "closed", "open",
    "mei", "april", "juni", "januari", "februari", "maret", "juli", "tanggal",
    "sih", "loh", "kok", "wkwk", "haha", "hehe",
}

# Frasa/kata terlalu generik (bukan keluhan spesifik) -> dibuang dari pain point
_GENERIC_PHRASES = {
    "rumah sakit", "sakit rumah", "layanan kesehatan", "kesehatan layanan",
    "bpjs kesehatan", "kesehatan bpjs", "sakit umum", "puskesmas rumah",
}
_GENERIC_WORDS = {"rumah", "sakit", "kesehatan", "klinik", "puskesmas", "dokter", "pasien", "bpjs"}

# Kata yang justru MENANDAKAN keluhan (untuk memfilter frasa yang relevan)
_COMPLAINT_SIGNALS = {
    "lama", "lambat", "antri", "antrian", "antre", "antrean", "mahal", "ribet",
    "susah", "sulit", "kecewa", "buruk", "jelek", "parah", "kotor", "penuh",
    "lelet", "telat", "menunggu", "nunggu", "tunggu", "ditolak", "tolak",
    "gagal", "error", "rusak", "capek", "cape", "bingung", "rumit", "berbelit",
    "judes", "galak", "cuek", "kasar", "mahal", "biaya", "bayar", "rujukan",
    "klaim", "prosedur", "syarat", "birokrasi", "diskriminasi", "beda",
}


def predict_sentiments(comments: list[dict]) -> list[dict]:
    """Jalankan IndoBERT batch untuk seluruh komentar. Tambah predicted_sentiment."""
    if not comments:
        return []
    texts = [(c.get("normalized_text") or c.get("text") or "") for c in comments]
    sentiments = sentiment_service.predict_batch(texts)
    enriched = []
    for comment, sentiment in zip(comments, sentiments):
        nc = comment.copy()
        nc["predicted_sentiment"] = sentiment
        enriched.append(nc)
    return enriched


def compute_distribution(comments: list[dict]) -> dict:
    total = len(comments)
    if total == 0:
        return {"Negatif": 0, "Netral": 0, "Positif": 0}
    c = Counter(x.get("predicted_sentiment") for x in comments)
    return {
        "Negatif": round(c.get("Negatif", 0) / total * 100),
        "Netral":  round(c.get("Netral", 0) / total * 100),
        "Positif": round(c.get("Positif", 0) / total * 100),
    }


def _clean_tokens(text: str) -> list[str]:
    """Tokenisasi + buang URL, angka, token pendek, dan stopword."""
    text = text.lower()
    text = re.sub(r"http\S+|www\.\S+", " ", text)      # buang URL
    text = re.sub(r"\d+", " ", text)                    # buang angka
    tokens = re.findall(r"[a-z]+", text)
    return [t for t in tokens if len(t) >= 4 and t not in _STOPWORDS]


def extract_pain_points(comments: list[dict], top_n: int = 5) -> list[dict]:
    """
    Ekstrak pain point sebagai FRASA BERMAKNA (bigram) dari komentar negatif,
    bukan sekadar kata dengan frekuensi tertinggi.

    Strategi:
      1. Kumpulkan bigram (2 kata berdampingan) dari komentar negatif.
      2. Prioritaskan bigram yang mengandung kata sinyal keluhan.
      3. Fallback ke unigram bila bigram terlalu sedikit.
    """
    # --- kumpulkan bigram & unigram dari komentar negatif ---
    bigrams = Counter()
    unigrams = Counter()

    for x in comments:
        if x.get("predicted_sentiment") != "Negatif":
            continue
        text = x.get("normalized_text") or x.get("text") or ""
        toks = _clean_tokens(text)

        for t in toks:
            unigrams[t] += 1
        for a, b in zip(toks, toks[1:]):
            bigrams[(a, b)] += 1

    # --- prioritaskan bigram yang mengandung sinyal keluhan ---
    scored_bigrams = []
    for (a, b), count in bigrams.items():
        phrase = f"{a} {b}"
        if phrase in _GENERIC_PHRASES:      # buang frasa terlalu umum
            continue
        # buang bigram yang KEDUA katanya generik (mis. "rumah sakit")
        if a in _GENERIC_WORDS and b in _GENERIC_WORDS:
            continue
        signal = (a in _COMPLAINT_SIGNALS) or (b in _COMPLAINT_SIGNALS)
        # Frasa keluhan diterima walau muncul 1x; frasa biasa minimal 2x.
        if not signal and count < 2:
            continue
        score = count * (3 if signal else 1)  # bonus bila frasa keluhan
        scored_bigrams.append((phrase, count, score))

    scored_bigrams.sort(key=lambda x: x[2], reverse=True)

    pain_points = [{"keyword": phrase, "count": count}
                   for phrase, count, _ in scored_bigrams[:top_n]]

    # --- fallback: bila bigram kurang, lengkapi dengan unigram sinyal keluhan ---
    if len(pain_points) < top_n:
        existing = {p["keyword"] for p in pain_points}
        signal_unigrams = [(w, c) for w, c in unigrams.most_common()
                           if w in _COMPLAINT_SIGNALS and w not in existing]
        for w, c in signal_unigrams:
            if len(pain_points) >= top_n:
                break
            pain_points.append({"keyword": w, "count": c})

    # --- fallback terakhir: unigram frekuensi tertinggi (bila masih kurang) ---
    if len(pain_points) < top_n:
        existing = {p["keyword"] for p in pain_points}
        for w, c in unigrams.most_common():
            if len(pain_points) >= top_n:
                break
            if w not in existing:
                pain_points.append({"keyword": w, "count": c})

    return pain_points[:top_n]


def build_insight(comments: list[dict]) -> dict:
    comments = predict_sentiments(comments)
    distribution = compute_distribution(comments)
    pain_points = extract_pain_points(comments)
    return {
        "total_comments": len(comments),
        "distribution": distribution,
        "pain_points": pain_points,
    }
