from collections import Counter
from app.services.sentiment_service import sentiment_service
import re


_STOPWORDS = {
    "yang", "di", "ke", "dari", "dan", "atau", "ini", "itu",
    "untuk", "dengan", "pada", "ada", "aku", "saya",
    "kamu", "dia", "mereka", "kita", "kami",
    "tidak", "gak", "ga", "nya", "sih", "aja",
    "ya", "juga", "udah", "sudah", "lagi",
    "kalau", "kalo", "karena", "jadi",
    "bisa", "mau", "kayak", "gitu",
    "banget", "buat", "kah",
    "pun", "tapi", "sama",
    "pakai", "pake", "masih",
    "lebih", "cuma", "bukan",
    "dalam", "oleh",
    "seperti", "hingga",
    "saat", "juga",
    "semua",
    "https", "http", "www",
    "amp", "rt"
}


_GENERIC_WORDS = {
    "rumah",
    "sakit",
    "kesehatan",
    "klinik",
    "dokter",
    "pasien",
    "bpjs"
}


_COMPLAINT_SIGNALS = {
    "lama",
    "lambat",
    "antri",
    "antrean",
    "mahal",
    "ribet",
    "susah",
    "sulit",
    "kecewa",
    "buruk",
    "jelek",
    "parah",
    "kotor",
    "penuh",
    "menunggu",
    "nunggu",
    "ditolak",
    "gagal",
    "error",
    "rusak",
    "bingung",
    "rumit",
    "biaya",
    "bayar",
    "klaim",
    "prosedur",
    "syarat"
}



def predict_sentiments(comments):

    if not comments:
        return []


    texts = [
        c.get("normalized_text")
        or c.get("text")
        or ""
        for c in comments
    ]


    sentiments = sentiment_service.predict_batch(texts)


    result = []

    for comment, sentiment in zip(
        comments,
        sentiments
    ):

        item = comment.copy()

        item["predicted_sentiment"] = sentiment

        result.append(item)


    return result



def compute_distribution(comments):

    total = len(comments)


    if total == 0:
        return {
            "Negatif":0,
            "Netral":0,
            "Positif":0
        }


    counter = Counter(
        c.get("predicted_sentiment")
        for c in comments
    )


    return {
        "Negatif":
            round(counter.get("Negatif",0)
            / total * 100),

        "Netral":
            round(counter.get("Netral",0)
            / total * 100),

        "Positif":
            round(counter.get("Positif",0)
            / total * 100),
    }



def _clean_tokens(text):

    text = text.lower()

    text = re.sub(
        r"http\S+|www\S+",
        " ",
        text
    )

    text = re.sub(
        r"\d+",
        " ",
        text
    )


    tokens = re.findall(
        r"[a-z]+",
        text
    )


    return [
        t for t in tokens
        if len(t)>=4
        and t not in _STOPWORDS
        and t not in _GENERIC_WORDS
    ]



def extract_phrases(texts, top_n=5):

    counter = Counter()


    for text in texts:

        tokens = _clean_tokens(text)


        for a,b in zip(
            tokens,
            tokens[1:]
        ):

            phrase = f"{a} {b}"

            counter[phrase]+=1



    return [
        {
            "keyword":k,
            "count":v
        }

        for k,v in counter.most_common(top_n)
    ]



def extract_pain_points(comments):

    grouped = {
        "Negatif":[],
        "Netral":[],
        "Positif":[]
    }


    for c in comments:

        sentiment = c.get(
            "predicted_sentiment"
        )


        if sentiment in grouped:

            grouped[sentiment].append(
                c.get("normalized_text")
                or c.get("text")
                or ""
            )


    return {

        "negative":
            extract_phrases(
                grouped["Negatif"]
            ),

        "neutral":
            extract_phrases(
                grouped["Netral"]
            ),

        "positive":
            extract_phrases(
                grouped["Positif"]
            )
    }




def build_insight(comments):

    comments = predict_sentiments(
        comments
    )


    distribution = compute_distribution(
        comments
    )


    dominant_phrases = extract_pain_points(
        comments
    )


    return {

        "total_comments":
            len(comments),

        "distribution":
            distribution,

        "dominant_phrases":
            dominant_phrases,

        "comments":
            comments
    }
def _dominant_phrases_to_pain_points(
    dominant_phrases,
    top_n=5
):
    """
    Mengubah hasil dominant_phrases menjadi format
    yang digunakan halaman insight frontend.
    """

    negative = dominant_phrases.get(
        "negative",
        []
    )[:top_n]


    if not negative:
        return []


    max_count = max(
        p["count"]
        for p in negative
    ) or 1


    return [
        {
            "text": p["keyword"].capitalize(),
            "count": f'{p["count"]} sebutan',
            "pct": round(
                (p["count"] / max_count) * 100
            )
        }

        for p in negative
    ]



def build_general_insight(
    comments,
    top_n=5
):
    """
    Insight umum seluruh dataset.
    Dipakai oleh insight_cache saat startup.
    """

    insight = build_insight(comments)


    return {
        "total_comments":
            insight["total_comments"],

        "distribution":
            insight["distribution"],

        "pain_points":
            _dominant_phrases_to_pain_points(
                insight["dominant_phrases"],
                top_n
            )
    }