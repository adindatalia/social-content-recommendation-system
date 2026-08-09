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
        "sudut_opsi": {
            "OPSI 1": (
                "Solusi atau langkah konkret yang bisa langsung diambil/ditanyakan "
                "audiens terkait keluhan (misal: cara mengecek, opsi yang tersedia, "
                "apa yang perlu disiapkan)."
            ),
            "OPSI 2": (
                "Transparansi proses: jelaskan faktor/alasan di balik hal yang "
                "dikeluhkan dengan bahasa yang jujur, TANPA mengklaim institusi "
                "sudah mengubah atau memperbaiki sesuatu."
            ),
            "OPSI 3": (
                "Reframing preventif: bantu audiens mengantisipasi atau "
                "mempersiapkan diri agar masalah serupa lebih mudah dihadapi "
                "ke depannya."
            ),
        },
        "frasa_terlarang": [
            "kami memahami",
            "kami mengerti kekhawatiran anda",
            "kami turut prihatin",
            "terima kasih atas masukannya",
            "kami akan terus meningkatkan pelayanan",
            "kepuasan anda adalah prioritas kami",
        ],
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
        "sudut_opsi": {
            "OPSI 1": "Penjelasan faktual langsung: apa dan kenapa, terkait isi komentar.",
            "OPSI 2": "Format mitos vs fakta yang menjawab langsung asumsi/keresahan dalam komentar.",
            "OPSI 3": "Tips atau langkah praktis yang bisa diambil audiens terkait topik.",
        },
        "frasa_terlarang": [],
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
        "sudut_opsi": {
            "OPSI 1": "Angkat pengalaman spesifik dalam komentar sebagai cerita singkat (mini-story).",
            "OPSI 2": "Highlight aspek/nilai layanan yang disebut komentar dari sudut manfaat konkret bagi audiens.",
            "OPSI 3": "Ajak audiens lain berbagi pengalaman serupa (community engagement) berbasis apa yang disebut komentar.",
        },
        "frasa_terlarang": [],
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

    sudut_opsi_text = "\n".join(
        f'- {opsi}: {deskripsi}'
        for opsi, deskripsi in cfg["sudut_opsi"].items()
    )

    if cfg["frasa_terlarang"]:
        frasa_terlarang_text = "\n".join(f'- "{f}"' for f in cfg["frasa_terlarang"])
        frasa_terlarang_block = f"""
Frasa klise yang DILARANG dipakai (termasuk variasinya):
{frasa_terlarang_text}
"""
    else:
        frasa_terlarang_block = ""

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
{frasa_terlarang_block}
=== LANGKAH SEBELUM MENULIS ===

Sebelum menyusun 3 ide, temukan SATU detail paling konkret dalam
komentar (bisa berupa angka, waktu, tempat, tindakan, kata kunci
emosional, atau situasi spesifik yang disebutkan). Detail ini WAJIB
jadi benang merah yang membedakan cara tiap ide mengangkat komentar
yang sama — bukan pengulangan kalimat yang sama dengan kata berbeda.

=== SUDUT PANDANG WAJIB PER OPSI ===

Setiap OPSI harus mengambil sudut pandang berbeda berikut, supaya
ketiganya benar-benar berbeda secara konsep (bukan cuma beda diksi):

{sudut_opsi_text}

=== ATURAN WAJIB ===

1. SETIAP ide wajib merespons isi komentar secara spesifik, termasuk
   detail konkret yang ditemukan di "LANGKAH SEBELUM MENULIS".

2. Jika komentar berisi keluhan atau pengalaman tertentu, gunakan
   detail keluhan tersebut sebagai dasar ide.

3. Jangan mengganti konteks komentar dengan masalah kesehatan umum.

4. Jangan membuat ide generik yang dapat digunakan untuk semua klinik,
   rumah sakit, atau institusi kesehatan.

5. Gunakan detail konkret dari komentar. Contohnya, jika komentar
   menyebut "menunggu hampir 2 jam", maka detail waktu tunggu tersebut
   WAJIB digunakan dalam hook, body, atau justification — bukan
   opsional.

6. Jangan mengarang fakta operasional yang tidak diberikan.
   Jangan mengatakan bahwa klinik telah menambah tenaga medis,
   menggunakan sistem antrean digital, melakukan evaluasi,
   atau melakukan tindakan tertentu kecuali hal tersebut memang
   disebutkan dalam komentar atau diberikan oleh sistem.

7. Jika memberikan solusi, gunakan bentuk saran, informasi, atau
   langkah yang bisa diambil AUDIENS sendiri — bukan klaim bahwa
   institusi sudah melakukan tindakan tertentu.

8. Konsisten dengan strategi "{strategy["label"]}".

9. Setiap ide WAJIB mengikuti sudut pandang berbeda sesuai
   "SUDUT PANDANG WAJIB PER OPSI" di atas — dilarang membuat 3 ide
   yang secara substansi sama hanya dengan kalimat pembuka berbeda.

10. Buat TEPAT 3 ide dengan format berbeda:
    {formats_list}

11. Batas panjang:
    - title maksimal 70 karakter
    - hook maksimal 25 kata
    - body maksimal 40 kata
    - cta maksimal 15 kata
    - justification maksimal 30 kata

12. Bagian "justification" WAJIB menjelaskan:
    - detail konkret dari komentar yang dipakai sebagai dasar ide,
    - sentimen yang diberikan sistem,
    - hubungan dengan topik,
    - dan alasan sudut pandang OPSI tersebut sesuai dengan strategi.

13. Jangan menyebut confidence score atau probabilitas dalam
    justification.

14. Jangan mengarang angka, statistik, jumlah pasien, persentase,
    atau fakta lain yang tidak terdapat dalam komentar.

15. Hashtag maksimal 5 dan harus relevan dengan topik serta isi komentar.

16. Dilarang membuka hook dengan basa-basi kosong (contoh: "Halo
    #TopikSehat!", "Tahukah kamu?") kecuali basa-basi itu langsung
    menyambung ke detail konkret dari komentar dalam kalimat yang sama.

=== GAYA KONTEN ===

Buat ide yang terasa seperti konten media sosial yang benar-benar
bisa digunakan oleh institusi kesehatan — spesifik ke situasi dalam
komentar, bukan template yang bisa dipakai untuk topik apa saja.

Untuk strategi Address Pain Point:
- mulai dengan pengakuan singkat terhadap keluhan TANPA memakai
  frasa klise yang dilarang di atas;
- angkat detail konkret dari keluhan secara eksplisit;
- berikan nilai nyata sesuai sudut OPSI-nya (solusi/transparansi/
  pencegahan), bukan sekadar "kami dengarkan";
- jangan menyalahkan pasien;
- jangan membuat janji atau klaim bahwa institusi sudah melakukan
  sesuatu jika tidak ada informasinya.

Untuk strategi Edukasi Informatif:
- gunakan komentar sebagai konteks masalah;
- ubah masalah menjadi edukasi yang mudah dipahami sesuai sudut
  OPSI-nya;
- tetap netral dan informatif;
- jangan membuat klaim promosi.

Untuk strategi Showcase Positif:
- gunakan pengalaman positif yang benar-benar terdapat dalam komentar;
- tonjolkan aspek positif yang relevan sesuai sudut OPSI-nya;
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
            "justification": "alasan berbasis detail konkret komentar, sentimen, topik, dan strategi"
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
            "justification": "alasan berbasis detail konkret komentar, sentimen, topik, dan strategi"
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
            "justification": "alasan berbasis detail konkret komentar, sentimen, topik, dan strategi"
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