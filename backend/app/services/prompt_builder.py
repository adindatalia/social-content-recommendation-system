
_STRATEGY_TONE = {
    "address_pain_point": {
        "arahan": (
            "Fokus menjawab keluhan publik secara spesifik. Tunjukkan empati "
            "di awal, lalu berikan solusi/tindakan konkret. Bangun kepercayaan."
        ),
        "larangan": (
            "DILARANG membuat konten promosi/testimoni positif. DILARANG "
            "mengabaikan pain point yang tersedia. DILARANG menyalahkan pasien."
        ),
    },
    "edukasi_informatif": {
        "arahan": (
            "Fokus edukasi. Jelaskan prosedur, biaya, atau regulasi dengan "
            "bahasa sederhana. Netral, informatif, dan terpercaya."
        ),
        "larangan": (
            "DILARANG menggunakan gaya clickbait atau bombastis. DILARANG "
            "membuat konten yang terkesan menjual/promosi. Gunakan bahasa formal."
        ),
    },
    "showcase_positif": {
        "arahan": (
            "Fokus mengangkat pengalaman positif dan testimoni. Tunjukkan sisi "
            "baik layanan. Inspiratif dan meyakinkan, tapi tetap kredibel."
        ),
        "larangan": (
            "DILARANG membahas keluhan/pain point. DILARANG terkesan "
            "berlebihan atau tidak realistis (hindari superlatif kosong)."
        ),
    },
}

_FORMATS = ["TIKTOK - REELS", "FEED - CAROUSEL", "INFOGRAFIK"]


def build_prompt(keyword: str, distribution: dict, pain_points: list, strategy: dict) -> str:
    dist_text = ", ".join(f"{k}: {v}%" for k, v in distribution.items())

    if pain_points:
        pains = "\n".join(f"{i+1}. {p['keyword']} (muncul {p['count']}x)"
                           for i, p in enumerate(pain_points))
        pain_instruction = (
            f"WAJIB: pilih SATU pain point BERBEDA dari daftar di atas untuk "
            f"setiap ide (total {len(pain_points)} pain point tersedia, buat 3 ide "
            f"dari pain point yang berlainan bila memungkinkan). Sebutkan pain "
            f"point tersebut secara eksplisit di bagian hook atau body -- jangan "
            f"hanya menyinggung secara implisit."
        )
    else:
        pains = "(tidak ada pain point spesifik terdeteksi dari data)"
        pain_instruction = (
            "Karena tidak ada pain point spesifik, fokuskan ide pada tema umum "
            "sesuai strategi dan kata kunci."
        )

    cfg = _STRATEGY_TONE.get(strategy["key"], _STRATEGY_TONE["edukasi_informatif"])
    formats_list = ", ".join(_FORMATS)

    return f"""Kamu adalah content strategist untuk institusi kesehatan.
Tugasmu membuat 3 ide konten media sosial berdasarkan DATA ANALISIS SENTIMEN PUBLIK berikut. Setiap ide WAJIB berbasis data ini, BUKAN pengetahuan umum tentang topik kesehatan.

=== DATA ANALISIS (WAJIB DIPAKAI) ===
Kata kunci   : "{keyword}"
Distribusi sentimen publik: {dist_text}
Pain point/keluhan yang terdeteksi:
{pains}

=== STRATEGI KONTEN: {strategy['label']} ===
Arahan gaya: {cfg['arahan']}
Larangan   : {cfg['larangan']}

=== ATURAN WAJIB ===
1. {pain_instruction}
2. DILARANG membuat ide generik yang bisa dipakai untuk topik kesehatan apa pun.
   Setiap ide harus terasa SPESIFIK untuk kata kunci "{keyword}" dan data di atas.
3. Bagian "justification" WAJIB menyebutkan angka/data konkret dari analisis
   di atas (persentase sentimen atau pain point spesifik), bukan alasan umum.
4. Buat TEPAT 3 ide, masing-masing format berbeda: {formats_list}.
5. Konsisten dengan strategi "{strategy['label']}" -- ikuti arahan gaya, hindari larangan.

=== FORMAT OUTPUT ===
Balas HANYA dalam JSON valid (tanpa teks pembuka, tanpa markdown, tanpa ```).

{{
  "ideas": [
    {{
      "title": "judul menarik, maksimal 70 karakter",
      "format": "TIKTOK - REELS",
      "hook": "kalimat pembuka yang menyebutkan pain point/data secara eksplisit",
      "body": "isi/script konten, 2-4 kalimat, actionable, spesifik ke data",
      "cta": "call to action yang jelas",
      "hashtags": ["tanpatandapagar", "maksimal5", "relevan"],
      "justification": "alasan berbasis DATA KONKRET di atas (sebutkan angka/pain point spesifik)"
    }}
  ]
}}

Pastikan ada TEPAT 3 objek di "ideas", satu untuk tiap format: {formats_list}.
Gunakan Bahasa Indonesia yang natural."""
