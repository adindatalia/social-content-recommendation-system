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

# Peta bantu: dari berbagai bentuk input (label/variasi/format) -> key resmi
_ALIAS_TO_KEY = {}
for _key, _cfg in STRATEGY_CONFIG.items():
    label_lower = _cfg["label"].lower()
    _ALIAS_TO_KEY[_key.lower()] = _key                                  # key resmi
    _ALIAS_TO_KEY[label_lower] = _key                                   # "showcase positif"
    _ALIAS_TO_KEY[label_lower.replace(" ", "_")] = _key                 # "showcase_positif"
    _ALIAS_TO_KEY[label_lower.replace(" ", "")] = _key                  # "showcasepositif"
    _ALIAS_TO_KEY[label_lower.replace(" ", "-")] = _key                 # "showcase-positif"  <- BARU

# Alias kata tunggal sentimen sebagai jaring pengaman tambahan  <- BARU
_ALIAS_TO_KEY["negatif"] = "address_pain_point"
_ALIAS_TO_KEY["netral"] = "edukasi_informatif"
_ALIAS_TO_KEY["positif"] = "showcase_positif"
_ALIAS_TO_KEY["pain_point"] = "address_pain_point"
_ALIAS_TO_KEY["pain-point"] = "address_pain_point"
_ALIAS_TO_KEY["edukasi"] = "edukasi_informatif"
_ALIAS_TO_KEY["informatif"] = "edukasi_informatif"
_ALIAS_TO_KEY["showcase"] = "showcase_positif"


def _normalize_choice(chosen):
    """Ubah apa pun yang dikirim frontend (key/label/variasi/format) jadi key resmi."""
    if not chosen:
        return None
    t = str(chosen).strip().lower()
    # Normalisasi tambahan: hilangkan strip ganda, spasi ganda
    t = t.replace("--", "-").replace("  ", " ")
    return _ALIAS_TO_KEY.get(t)


def recommend_strategy(distribution: dict) -> str:
    if not distribution or sum(distribution.values()) == 0:
        return "edukasi_informatif"
    dominant = max(distribution, key=distribution.get)
    return _DOMINANT_TO_STRATEGY.get(dominant, "edukasi_informatif")


def resolve_strategy(distribution: dict, chosen=None) -> dict:
    """
    Tentukan strategi final.
    - Kalau user memilih angle (chosen), pakai itu (menerima key/label/variasi).
    - Kalau tidak/tidak cocok, pakai rekomendasi dari sentimen dominan.
    """
    recommended = recommend_strategy(distribution)
    normalized = _normalize_choice(chosen)
    key = normalized if normalized in STRATEGY_CONFIG else recommended

    config = STRATEGY_CONFIG[key].copy()
    config["key"] = key
    config["is_recommended"] = (key == recommended)
    # DEBUG: log untuk memastikan nilai chosen_angle yang diterima
    print(f"[strategy_service] chosen='{chosen}' -> normalized='{normalized}' -> key final='{key}'")
    return config
