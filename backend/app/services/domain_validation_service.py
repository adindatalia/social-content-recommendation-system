import re


HEALTH_DOMAIN_MARKERS = [
    "layanan kesehatan",
    "pelayanan kesehatan",
    "rumah sakit",
    "rs",
    "klinik",
    "puskesmas",
    "dokter",
    "perawat",
    "pasien",
    "bpjs",
    "kesehatan",
    "medis",
    "medical",
    "medical checkup",
    "mcu",
    "dokter gigi",
    "gigi",
    "scaling",
    "scalling",
    "konsultasi",
    "pemeriksaan",
    "laboratorium",
    "radiologi",
    "farmasi",
    "apotek",
    "resep",
    "obat",
    "vaksin",
    "imunisasi",
    "rawat inap",
    "rawat jalan",
    "igd",
    "rujukan",
    "anamnesa",
    "terapi",
    "fisioterapi",
    "psikolog",
    "psikiater",
    "bidan",
    "persalinan",
]

SERVICE_EXPERIENCE_MARKERS = [
    "pelayanan",
    "layanan",
    "petugas",
    "staff",
    "staf",
    "admin",
    "resepsionis",
    "antrian",
    "antrean",
    "antri",
    "antre",
    "nunggu",
    "menunggu",
    "jadwal",
    "biaya",
    "harga",
    "ramah",
    "lama",
    "lambat",
    "cepat",
    "membantu",
    "puas",
    "kecewa",
    "nyaman",
    "mahal",
    "murah",
    "bagus",
    "baik",
    "buruk",
    "mudah",
    "sulit",
    "ribet",
    "informatif",
    "jelas",
    "profesional",
    "responsif",
    "bersih",
    "kotor",
    "telat",
]

OUT_OF_DOMAIN_MARKERS = [
    "kpop",
    "idol",
    "fandom",
    "konser",
    "bts",
    "nct",
    "blackpink",
    "anime",
    "manga",
    "drakor",
    "film",
    "persib",
    "timnas",
    "sepak bola",
    "bola",
    "klasemen",
    "crypto",
    "bitcoin",
    "nft",
    "web3",
    "blockchain",
    "horor",
    "hantu",
    "mistis",
    "pocong",
    "pilpres",
    "pilkada",
    "capres",
    "partai",
    "dpr",
    "gubernur",
    "politik",
    "badut",
    "17 agustus",
    "istana merdeka",
]


def _normalize(text: str) -> str:
    text = (text or "").lower()
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def _contains_marker(text: str, marker: str) -> bool:
    if " " in marker:
        return marker in text

    # Singkatan seperti RS, IGD, MCU harus match sebagai kata utuh.
    if len(marker) <= 4:
        return bool(
            re.search(
                rf"\b{re.escape(marker)}\b",
                text,
            )
        )

    # Memungkinkan variasi seperti dokter -> dokternya,
    # pelayanan -> pelayanannya.
    return bool(
        re.search(
            rf"\b{re.escape(marker)}\w*\b",
            text,
        )
    )


def _contains_any(text: str, markers: list[str]) -> bool:
    return any(
        _contains_marker(text, marker)
        for marker in markers
    )


def validate_health_domain(
    topic: str,
    comment: str,
) -> None:
    normalized_topic = _normalize(topic)
    normalized_comment = _normalize(comment)

    if not normalized_topic:
        raise ValueError("Topik tidak boleh kosong.")

    if not normalized_comment:
        raise ValueError("Komentar tidak boleh kosong.")

    topic_is_health = _contains_any(
        normalized_topic,
        HEALTH_DOMAIN_MARKERS,
    )

    if not topic_is_health:
        raise ValueError(
            "Topik di luar cakupan sistem. "
            "Masukkan topik yang berkaitan dengan layanan kesehatan."
        )

    comment_has_health_context = _contains_any(
        normalized_comment,
        HEALTH_DOMAIN_MARKERS,
    )

    comment_has_service_context = _contains_any(
        normalized_comment,
        SERVICE_EXPERIENCE_MARKERS,
    )

    comment_has_out_of_domain_context = _contains_any(
        normalized_comment,
        OUT_OF_DOMAIN_MARKERS,
    )

    if (
        comment_has_out_of_domain_context
        and not comment_has_health_context
    ):
        raise ValueError(
            "Komentar di luar cakupan layanan kesehatan."
        )

    if not (
        comment_has_health_context
        or comment_has_service_context
    ):
        raise ValueError(
            "Komentar belum menunjukkan konteks layanan kesehatan "
            "atau pengalaman pelayanan yang relevan."
        )