
_STRATEGY_TONE = {
    "address_pain_point": {
        "arahan": (
            "Fokus menjawab keluhan yang terdapat pada komentar secara spesifik. "
            "Tunjukkan empati di awal, lalu berikan solusi atau tindakan konkret. "
            "Bangun kepercayaan."
        ),
        "larangan": (
            "DILARANG membuat konten promosi atau testimoni positif. "
            "DILARANG mengabaikan keluhan pada komentar. "
            "DILARANG menyalahkan pasien."
        ),
    },

    "edukasi_informatif": {
        "arahan": (
            "Fokus pada edukasi berdasarkan konteks komentar. "
            "Jelaskan informasi yang relevan dengan bahasa sederhana, "
            "netral, informatif, dan terpercaya."
        ),
        "larangan": (
            "DILARANG menggunakan gaya clickbait atau bombastis. "
            "DILARANG membuat konten yang terkesan menjual atau promosi."
        ),
    },

    "showcase_positif": {
        "arahan": (
            "Fokus mengangkat pengalaman positif yang tercermin dalam komentar. "
            "Tunjukkan sisi baik layanan secara inspiratif dan meyakinkan, "
            "tetapi tetap kredibel."
        ),
        "larangan": (
            "DILARANG membuat klaim berlebihan atau tidak realistis. "
            "DILARANG menggunakan superlatif kosong."
        ),
    },
}


_FORMATS = [
    "OPSI 1",
    "OPSI 2",
    "OPSI 3",
]


def build_prompt(
    topic: str,
    comment: str,
    sentiment: str,
    strategy: dict
) -> str:

    cfg = _STRATEGY_TONE.get(
        strategy.get("key"),
        _STRATEGY_TONE["edukasi_informatif"]
    )

    formats_list = ", ".join(_FORMATS)

    return f"""
Kamu adalah content strategist untuk institusi kesehatan.

Tugasmu membuat 3 ide konten media sosial berdasarkan SATU komentar
pengguna dan hasil analisis sentimen dari model IndoBERTweet.

Komentar pengguna adalah sumber konteks utama. Setiap ide harus
berhubungan langsung dengan isi komentar dan topik yang diberikan.

=== DATA ANALISIS ===

Topik:
"{topic}"

Komentar pengguna:
"{comment}"

Hasil klasifikasi sentimen IndoBERTweet:
"{sentiment}"

PENTING:
- Sentimen di atas adalah hasil klasifikasi sistem.
- Jangan melakukan klasifikasi sentimen ulang.
- Jangan mengubah sentimen tersebut.
- Jangan menggunakan confidence score atau probabilitas model.
- Jangan mengarang data tambahan yang tidak terdapat pada komentar.
- Jangan menganggap komentar ini sebagai representasi seluruh publik.
- Jangan membuat klaim berdasarkan kumpulan komentar atau distribusi sentimen.

=== STRATEGI KONTEN ===

Strategi:
"{strategy["label"]}"

Target sentimen:
"{strategy["target_sentiment"]}"

Arahan:
{cfg["arahan"]}

Larangan:
{cfg["larangan"]}

=== ATURAN WAJIB ===

1. SETIAP ide wajib merespons isi komentar secara spesifik.

2. Jika komentar berisi keluhan atau pengalaman tertentu, gunakan
   detail keluhan tersebut sebagai dasar ide.

3. Jangan mengganti konteks komentar dengan masalah kesehatan umum.

4. Jangan membuat ide generik yang dapat digunakan untuk semua klinik,
   rumah sakit, atau institusi kesehatan.

5. Gunakan detail konkret dari komentar jika relevan.
   Contohnya, jika komentar menyebut "menunggu hampir 2 jam",
   maka detail waktu tunggu tersebut boleh digunakan dalam hook,
   body, atau justification.

6. Jangan mengarang fakta operasional yang tidak diberikan.
   Jangan mengatakan bahwa klinik telah menambah tenaga medis,
   menggunakan sistem antrean digital, melakukan evaluasi,
   atau melakukan tindakan tertentu kecuali hal tersebut memang
   disebutkan dalam komentar atau diberikan oleh sistem.

7. Jika memberikan solusi, gunakan bentuk saran atau rekomendasi
   yang realistis, bukan klaim bahwa institusi sudah melakukan
   tindakan tertentu.

8. Konsisten dengan strategi "{strategy["label"]}".

9. Setiap ide harus memiliki pendekatan yang berbeda, tetapi tetap
   berasal dari komentar yang sama.

10. Buat TEPAT 3 ide dengan format berbeda:
    {formats_list}

11. Batas panjang:
    - title maksimal 70 karakter
    - hook maksimal 25 kata
    - body maksimal 40 kata
    - cta maksimal 15 kata
    - justification maksimal 30 kata

12. Bagian "justification" WAJIB menjelaskan:
    - masalah atau konteks dari komentar,
    - sentimen yang diberikan sistem,
    - hubungan dengan topik,
    - dan alasan strategi tersebut sesuai.

13. Jangan menyebut confidence score atau probabilitas dalam
    justification.

14. Jangan mengarang angka, statistik, jumlah pasien, persentase,
    atau fakta lain yang tidak terdapat dalam komentar.

15. Hashtag maksimal 5 dan harus relevan dengan topik serta isi komentar.

=== GAYA KONTEN ===

Buat ide yang terasa seperti konten media sosial yang benar-benar
bisa digunakan oleh institusi kesehatan.

Untuk strategi Address Pain Point:
- mulai dengan empati terhadap keluhan;
- angkat masalah secara jelas;
- berikan edukasi, saran, atau langkah konkret;
- jangan menyalahkan pasien;
- jangan membuat janji atau klaim bahwa institusi sudah melakukan
  sesuatu jika tidak ada informasinya.

Untuk strategi Edukasi Informatif:
- gunakan komentar sebagai konteks masalah;
- ubah masalah menjadi edukasi yang mudah dipahami;
- tetap netral dan informatif;
- jangan membuat klaim promosi.

Untuk strategi Showcase Positif:
- gunakan pengalaman positif yang benar-benar terdapat dalam komentar;
- tonjolkan aspek positif yang relevan;
- jangan menambahkan pengalaman positif yang tidak disebutkan;
- hindari klaim berlebihan.

=== FORMAT OUTPUT ===

Balas HANYA dalam JSON valid.

Tanpa teks pembuka.
Tanpa markdown.
Tanpa ```.

{{
    "ideas": [
        {{
            "title": "judul menarik dan spesifik",
            "format": "OPSI 1",
            "hook": "kalimat pembuka yang relevan langsung dengan komentar",
            "body": "isi atau script konten yang spesifik, relevan, dan actionable",
            "cta": "call to action yang jelas",
            "hashtags": [
                "maksimal5",
                "relevan",
                "dengan",
                "topik"
            ],
            "justification": "alasan berbasis komentar, sentimen, topik, dan strategi"
        }},
        {{
            "title": "judul berbeda dari ide pertama",
            "format": "OPSI 2",
            "hook": "kalimat pembuka dengan pendekatan berbeda",
            "body": "isi atau script konten dengan pendekatan berbeda",
            "cta": "call to action yang jelas",
            "hashtags": [
                "maksimal5",
                "relevan",
                "dengan",
                "topik"
            ],
            "justification": "alasan berbasis komentar, sentimen, topik, dan strategi"
        }},
        {{
            "title": "judul berbeda dari ide sebelumnya",
            "format": "OPSI 3",
            "hook": "kalimat pembuka dengan pendekatan berbeda",
            "body": "isi atau script konten dengan pendekatan berbeda",
            "cta": "call to action yang jelas",
            "hashtags": [
                "maksimal5",
                "relevan",
                "dengan",
                "topik"
            ],
            "justification": "alasan berbasis komentar, sentimen, topik, dan strategi"
        }}
    ]
}}

Pastikan terdapat TEPAT 3 objek dalam "ideas":
- satu dengan format "OPSI 1"
- satu dengan format "OPSI 2"
- satu dengan format "OPSI 3"

Gunakan Bahasa Indonesia yang natural, jelas, dan cocok untuk
konten media sosial institusi kesehatan.
""".strip()