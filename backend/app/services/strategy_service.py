STRATEGY_CONFIG = {
    "address_pain_point": {
        "label": "Address Pain Point",
        "target_sentiment": "Negatif",
        "description": "Konten yang menjawab keluhan publik dengan solusi dan empati.",
    },
    "edukasi_informatif": {
        "label": "Edukasi Informatif",
        "target_sentiment": "Netral",
        "description": "Konten edukatif tentang prosedur, biaya, atau regulasi.",
    },
    "showcase_positif": {
        "label": "Showcase Positif",
        "target_sentiment": "Positif",
        "description": "Konten yang mengangkat pengalaman dan testimoni positif.",
    },
}


_DOMINANT_TO_STRATEGY = {
    "Negatif": "address_pain_point",
    "Netral": "edukasi_informatif",
    "Positif": "showcase_positif",
}


# Mapping berbagai format input ke key strategi resmi
_ALIAS_TO_KEY = {}

for _key, _cfg in STRATEGY_CONFIG.items():

    label_lower = _cfg["label"].lower()

    _ALIAS_TO_KEY[_key.lower()] = _key
    _ALIAS_TO_KEY[label_lower] = _key
    _ALIAS_TO_KEY[label_lower.replace(" ", "_")] = _key
    _ALIAS_TO_KEY[label_lower.replace(" ", "")] = _key
    _ALIAS_TO_KEY[label_lower.replace(" ", "-")] = _key


# Alias tambahan
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
    Mengubah input frontend menjadi key strategi resmi.
    """

    if not chosen:
        return None

    t = str(chosen).strip().lower()

    t = (
        t
        .replace("--", "-")
        .replace("  ", " ")
    )

    return _ALIAS_TO_KEY.get(t)



def recommend_strategy(distribution: dict) -> str:
    """
    Menentukan strategi berdasarkan sentimen dominan.
    """

    # DEBUG RECOVERY
    print(
        "[strategy_service] distribution masuk:",
        distribution
    )


    if not distribution or sum(distribution.values()) == 0:

        print(
            "[strategy_service] distribution kosong -> edukasi_informatif"
        )

        return "edukasi_informatif"



    dominant = max(
        distribution,
        key=distribution.get
    )


    # DEBUG RECOVERY
    print(
        "[strategy_service] sentimen dominan:",
        dominant
    )


    strategy = _DOMINANT_TO_STRATEGY.get(
        dominant,
        "edukasi_informatif"
    )


    print(
        "[strategy_service] strategi rekomendasi:",
        strategy
    )


    return strategy



_SENTIMENT_TO_PHRASE_KEY = {
    "Negatif": "negative",
    "Netral": "neutral",
    "Positif": "positive"
}



def _build_reasoning(
    distribution: dict,
    dominant_phrases: dict,
    recommended_key: str
) -> list[str]:

    target_sentiment = (
        STRATEGY_CONFIG[recommended_key]["target_sentiment"]
    )


    pct = (
        distribution or {}
    ).get(
        target_sentiment,
        0
    )


    reasons = [
        f"Sentimen {target_sentiment.lower()} mendominasi hasil analisis ({pct}% dari komentar yang ditemukan)."
    ]


    phrase_key = _SENTIMENT_TO_PHRASE_KEY.get(
        target_sentiment
    )


    phrases = (
        (dominant_phrases or {})
        .get(
            phrase_key
        )
        or []
    )


    if phrases:

        top = phrases[0]["keyword"]

        reasons.append(
            f"Frasa dominan pada kategori {target_sentiment.lower()}: \"{top}\"."
        )


    return reasons



def resolve_strategy(
    distribution: dict,
    chosen=None,
    dominant_phrases: dict = None
) -> dict:

    """
    Menentukan strategi final.

    Prioritas:
    1. User memilih strategi -> gunakan pilihan user.
    2. Tidak memilih -> gunakan rekomendasi sistem.
    """


    recommended = recommend_strategy(
        distribution
    )


    normalized = _normalize_choice(
        chosen
    )


    key = (
        normalized
        if normalized in STRATEGY_CONFIG
        else recommended
    )


    config = STRATEGY_CONFIG[key].copy()


    config["key"] = key

    config["is_recommended"] = (
        key == recommended
    )

    config["recommended_key"] = recommended

    config["recommended_label"] = (
        STRATEGY_CONFIG[recommended]["label"]
    )


    config["reasoning"] = _build_reasoning(
        distribution,
        dominant_phrases,
        recommended
    )


    # DEBUG RECOVERY
    print(
        f"[strategy_service] chosen='{chosen}' "
        f"normalized='{normalized}' "
        f"final_strategy='{key}'"
    )


    return config