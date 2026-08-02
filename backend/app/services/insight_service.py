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
    "sakit rumah", "layanan kesehatan", "kesehatan layanan",
    "bpjs kesehatan", "kesehatan bpjs", "sakit umum", "puskesmas rumah",
}
_GENERIC_WORDS = {"rumah", "sakit", "kesehatan", "klinik", "puskesmas", "dokter", "pasien", "bpjs"}

# Frasa domain kesehatan yang tetap BERMAKNA walau kedua katanya termasuk
# _GENERIC_WORDS -- dikecualikan dari rule "buang jika kedua kata generik"
# supaya tidak hilang jadi fragmen terpotong seperti "masuk rumah"/"biaya rumah"
# (sebelumnya bigram "rumah sakit" selalu dibuang duluan, sehingga fragmen
# tetangganya yang justru muncul sebagai hasil akhir).
_MEANINGFUL_DOMAIN_PHRASES = {"rumah sakit"}
_BAD_PHRASES = {
    "masuk rumah",
    "biaya rumah",
    "sakit penuh",
    "menunggu mommy",
    "periksa bingung",
    "bingung kemana",
}

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


def _extract_phrases_from_texts(texts: list[str], top_n: int = 5, apply_signal_bonus: bool = True) -> list[dict]:
    """
    Logika ekstraksi ASLI (tidak diubah): bigram + fallback unigram.
    `apply_signal_bonus` mengontrol apakah bonus skor + fallback prioritas
    kata sinyal keluhan (_COMPLAINT_SIGNALS) dipakai -- ini HANYA relevan
    untuk kategori Negatif. Untuk Netral/Positif, apply_signal_bonus=False
    sehingga hanya frekuensi murni yang dipakai (perhitungan dasarnya tetap
    sama persis, cuma bonus keluhan tidak diterapkan).
    """
    bigrams = Counter()
    unigrams = Counter()

    for text in texts:
        toks = _clean_tokens(text)
        for t in toks:
            unigrams[t] += 1
        for a, b in zip(toks, toks[1:]):
            bigrams[(a, b)] += 1

    scored_bigrams = []
    for (a, b), count in bigrams.items():
        phrase = f"{a} {b}"
        if phrase in _BAD_PHRASES:
            continue
        if phrase in _GENERIC_PHRASES:
            continue
        if a in _GENERIC_WORDS and b in _GENERIC_WORDS and phrase not in _MEANINGFUL_DOMAIN_PHRASES:
            continue

        if apply_signal_bonus:
            signal = (a in _COMPLAINT_SIGNALS) or (b in _COMPLAINT_SIGNALS)
            if not signal and count < 2:
                continue
            score = count * (3 if signal else 1)
        else:
            if count < 2:
                continue
            score = count

        scored_bigrams.append((phrase, count, score))

    scored_bigrams.sort(key=lambda x: x[2], reverse=True)

    phrases = [{"keyword": phrase, "count": count}
               for phrase, count, _ in scored_bigrams[:top_n]]

    if apply_signal_bonus and len(phrases) < top_n:
        existing = {p["keyword"] for p in phrases}
        signal_unigrams = [(w, c) for w, c in unigrams.most_common()
                           if w in _COMPLAINT_SIGNALS and w not in existing]
        for w, c in signal_unigrams:
            if len(phrases) >= top_n:
                break
            phrases.append({"keyword": w, "count": c})

    if len(phrases) < top_n:
        existing = {p["keyword"] for p in phrases}
        for w, c in unigrams.most_common():
            if len(phrases) >= top_n:
                break
            if w not in existing:
                phrases.append({"keyword": w, "count": c})

    return phrases[:top_n]


def extract_pain_points(comments: list[dict], top_n: int = 5) -> dict:
    """
    Jalankan logika ekstraksi yang SAMA (lihat _extract_phrases_from_texts)
    untuk ketiga kategori sentimen. Bonus sinyal keluhan hanya dipakai untuk
    Negatif; Netral/Positif memakai frekuensi murni tanpa bonus.
    """
    texts_by_sentiment = {"Negatif": [], "Netral": [], "Positif": []}
    for x in comments:
        sentiment = x.get("predicted_sentiment")
        if sentiment not in texts_by_sentiment:
            continue
        text = x.get("normalized_text") or x.get("text") or ""
        texts_by_sentiment[sentiment].append(text)

    return {
        "negative": _extract_phrases_from_texts(texts_by_sentiment["Negatif"], top_n, apply_signal_bonus=True),
        "neutral":  _extract_phrases_from_texts(texts_by_sentiment["Netral"], top_n, apply_signal_bonus=False),
        "positive": _extract_phrases_from_texts(texts_by_sentiment["Positif"], top_n, apply_signal_bonus=False),
    }


def build_insight(comments: list[dict]) -> dict:
    comments = predict_sentiments(comments)
    distribution = compute_distribution(comments)
    dominant_phrases = extract_pain_points(comments)
    return {
        "total_comments": len(comments),
        "distribution": distribution,
        "dominant_phrases": dominant_phrases,
    }