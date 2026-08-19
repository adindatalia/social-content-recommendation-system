STRATEGY_CONFIG = {
    "address_pain_point": {
        "label": "Address Pain Point",
        "target_sentiment": "Negatif",
        "description": (
            "Konten yang menjawab keluhan publik "
            "dengan solusi dan empati."
        ),
    },

    "edukasi_informatif": {
        "label": "Edukasi Informatif",
        "target_sentiment": "Netral",
        "description": (
            "Konten edukatif tentang prosedur, "
            "biaya, atau regulasi."
        ),
    },

    "showcase_positif": {
        "label": "Showcase Positif",
        "target_sentiment": "Positif",
        "description": (
            "Konten yang mengangkat pengalaman "
            "dan testimoni positif."
        ),
    },
}

# MAPPING SENTIMEN ke STRATEGI

_SENTIMENT_TO_STRATEGY = {
    "Negatif": "address_pain_point",
    "Netral": "edukasi_informatif",
    "Positif": "showcase_positif",
}


# NORMALISASI PILIHAN STRATEGI DARI FRONTEND

_ALIAS_TO_KEY = {}

for _key, _config in STRATEGY_CONFIG.items():

    label_lower = _config["label"].lower()

    _ALIAS_TO_KEY[_key.lower()] = _key
    _ALIAS_TO_KEY[label_lower] = _key
    _ALIAS_TO_KEY[
        label_lower.replace(" ", "_")
    ] = _key
    _ALIAS_TO_KEY[
        label_lower.replace(" ", "")
    ] = _key
    _ALIAS_TO_KEY[
        label_lower.replace(" ", "-")
    ] = _key


# Alias berdasarkan sentimen
_ALIAS_TO_KEY["negatif"] = "address_pain_point"
_ALIAS_TO_KEY["netral"] = "edukasi_informatif"
_ALIAS_TO_KEY["positif"] = "showcase_positif"

_ALIAS_TO_KEY["pain_point"] = "address_pain_point"
_ALIAS_TO_KEY["pain-point"] = "address_pain_point"

_ALIAS_TO_KEY["edukasi"] = "edukasi_informatif"
_ALIAS_TO_KEY["informatif"] = "edukasi_informatif"

_ALIAS_TO_KEY["showcase"] = "showcase_positif"


def _normalize_choice(chosen):
    """
    Mengubah input frontend menjadi
    key strategi resmi.
    """

    if not chosen:
        return None

    text = str(chosen).strip().lower()

    text = (
        text
        .replace("--", "-")
        .replace("  ", " ")
    )

    return _ALIAS_TO_KEY.get(text)


# ============================================================
# REKOMENDASI STRATEGI
# ============================================================

def recommend_strategy(sentiment: str) -> str:
    """
    Menentukan strategi berdasarkan hasil
    klasifikasi sentimen IndoBERTweet.
    """

    if not sentiment:
        return "edukasi_informatif"

    normalized_sentiment = str(
        sentiment
    ).strip().capitalize()

    return _SENTIMENT_TO_STRATEGY.get(
        normalized_sentiment,
        "edukasi_informatif"
    )


# ============================================================
# REASONING STRATEGI
# ============================================================

def _build_reasoning(
    sentiment: str,
    recommended_key: str
) -> list[str]:

    config = STRATEGY_CONFIG[
        recommended_key
    ]

    target_sentiment = config[
        "target_sentiment"
    ]

    sentiment_text = (
        str(sentiment).lower()
        if sentiment
        else "tidak diketahui"
    )

    return [
        (
            f"Komentar diklasifikasikan sebagai "
            f"sentimen {sentiment_text} oleh model "
            f"sentimen."
        ),
        (
            f"Strategi {config['label']} dipilih "
            f"karena sesuai dengan karakteristik "
            f"sentimen {target_sentiment.lower()}."
        )
    ]

def resolve_strategy(
    sentiment: str,
    chosen=None
) -> dict:
    """
    Menentukan strategi final.

    Prioritas:
    1. Jika user memilih strategi, gunakan pilihan user.
    2. Jika tidak ada pilihan, gunakan rekomendasi
       berdasarkan sentimen IndoBERTweet.
    """

    recommended = recommend_strategy(
        sentiment
    )

    normalized = _normalize_choice(
        chosen
    )

    if normalized in STRATEGY_CONFIG:
        key = normalized
    else:
        key = recommended

    config = STRATEGY_CONFIG[
        key
    ].copy()

    config["key"] = key

    config["is_recommended"] = (
        key == recommended
    )

    config["recommended_key"] = (
        recommended
    )

    config["recommended_label"] = (
        STRATEGY_CONFIG[
            recommended
        ]["label"]
    )

    config["reasoning"] = _build_reasoning(
        sentiment,
        recommended
    )

    print(
        f"[strategy_service] "
        f"sentiment='{sentiment}' "
        f"chosen='{chosen}' "
        f"normalized='{normalized}' "
        f"recommended='{recommended}' "
        f"final_strategy='{key}'"
    )

    return config