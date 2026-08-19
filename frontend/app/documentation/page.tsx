import Link from "next/link";
import Navbar from "@/components/Navbar";

const PIPELINE_STEPS = [
  {
    number: "01",
    icon: "⌨️",
    title: "Input",
    desc: "Pengguna memasukkan topik dan satu komentar layanan kesehatan.",
  },
  {
    number: "02",
    icon: "🧠",
    title: "Analisis Sentimen",
    desc: "IndoBERTweet mengklasifikasikan komentar menjadi Negatif, Netral, atau Positif.",
  },
  {
    number: "03",
    icon: "🧭",
    title: "Rekomendasi Strategi",
    desc: "Label sentimen dipetakan ke strategi konten menggunakan aturan rule-based.",
  },
  {
    number: "04",
    icon: "✓",
    title: "Pilih Strategi",
    desc: "Pengguna dapat memakai strategi rekomendasi atau memilih strategi lain.",
  },
  {
    number: "05",
    icon: "📝",
    title: "Prompt Terstruktur",
    desc: "Topik, komentar, sentimen, dan strategi final disusun menjadi prompt.",
  },
  {
    number: "06",
    icon: "✨",
    title: "Gemini",
    desc: "Gemini menghasilkan tiga alternatif ide konten dengan struktur yang telah ditentukan.",
  },
  {
    number: "07",
    icon: "🗂️",
    title: "Riwayat",
    desc: "Hasil analisis dan ide konten disimpan agar dapat dilihat kembali.",
  },
];

const STRATEGIES = [
  {
    sentiment: "Negatif",
    strategy: "Address Pain Point",
    desc: "Mengarahkan konten untuk merespons masalah atau keluhan yang terdapat pada komentar.",
    style:
      "bg-red-50 border-red-100 text-red-700",
  },
  {
    sentiment: "Netral",
    strategy: "Edukasi Informatif",
    desc: "Mengarahkan konten untuk memberikan informasi atau edukasi yang relevan.",
    style:
      "bg-amber-50 border-amber-100 text-amber-700",
  },
  {
    sentiment: "Positif",
    strategy: "Showcase Positif",
    desc: "Mengarahkan konten untuk mengangkat pengalaman atau tanggapan positif.",
    style:
      "bg-emerald-50 border-emerald-100 text-emerald-700",
  },
];

export default function DocumentationPage() {
  return (
    <div className="min-h-screen antialiased bg-white text-zinc-900 font-sans">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 pb-20">
        {/* Hero */}
        <section className="py-16 text-center space-y-5 max-w-3xl mx-auto">
          <span className="px-4 py-1.5 border rounded-full text-xs font-bold tracking-wide inline-flex items-center gap-1.5 shadow-sm bg-teal-50 border-teal-100 text-teal-700">
            Documentation
          </span>

          <h1 className="font-serif text-[clamp(2.2rem,5.5vw,3.6rem)] leading-[1.12] tracking-tight text-zinc-900 font-extrabold">
            Precision Intelligence untuk{" "}
            <span className="text-teal-600">
              Strategi Konten Kesehatan
            </span>
          </h1>

          <p className="text-[15px] leading-relaxed max-w-xl mx-auto text-zinc-500 font-medium">
            SehatFlow Content menganalisis satu komentar
            layanan kesehatan menggunakan IndoBERTweet,
            merekomendasikan strategi berdasarkan sentimen,
            lalu menghasilkan tiga alternatif ide konten
            menggunakan Gemini.
          </p>

          <div className="flex items-center justify-center gap-3 pt-2">
            <Link
              href="/"
              className="px-6 py-3 rounded-full text-xs font-bold transition shadow-md bg-zinc-900 hover:bg-zinc-800 text-white"
            >
              Mulai Analisis
            </Link>

            <Link
              href="/history"
              className="px-6 py-3 rounded-full text-xs font-bold transition border border-zinc-200 hover:border-zinc-300 bg-white text-zinc-700"
            >
              Lihat Riwayat
            </Link>
          </div>
        </section>

        {/* Cara Kerja */}
        <section className="space-y-10 border-t border-zinc-200/80 pt-12">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-[11px] font-bold tracking-widest text-teal-600 uppercase block">
              — Cara Kerja Sistem
            </span>

            <h2 className="font-serif text-2xl md:text-[2rem] tracking-tight text-zinc-900 font-extrabold">
              Alur SehatFlow Content
            </h2>

            <p className="text-sm leading-relaxed text-zinc-500 font-medium">
              Satu alur dari komentar pengguna hingga
              menjadi rekomendasi strategi dan draf ide
              konten.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-x-4 gap-y-8">
            {PIPELINE_STEPS.map((step) => (
              <div
                key={step.number}
                className="flex flex-col items-center text-center gap-3"
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg border bg-white border-zinc-200 shadow-sm">
                    {step.icon}
                  </div>

                  <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[8px] font-extrabold">
                    {step.number}
                  </span>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-zinc-900">
                    {step.title}
                  </h3>

                  <p className="text-[10px] text-zinc-400 mt-1 leading-relaxed font-medium max-w-[9rem] mx-auto">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Detail */}
        <section className="space-y-6 border-t border-zinc-200/80 pt-12 mt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* IndoBERTweet */}
            <div className="p-6 rounded-2xl bg-teal-700 text-white shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-lg mb-4">
                🧠
              </div>

              <h3 className="text-sm font-bold">
                IndoBERTweet Sentiment Analysis
              </h3>

              <p className="text-xs text-teal-50/90 mt-2 leading-relaxed">
                Komentar diproses menggunakan model
                IndoBERTweet hasil fine-tuning untuk
                menghasilkan label sentimen Negatif,
                Netral, atau Positif.
              </p>

              <div className="mt-5 pt-4 border-t border-white/15 space-y-2">
                <p className="text-[10px] text-teal-50/90 font-medium">
                  Sistem juga menampilkan confidence dan
                  probabilitas ketiga kelas sebagai informasi
                  pendukung.
                </p>

                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-300" />

                  <span className="text-[9px] font-bold uppercase tracking-wider text-teal-50/90">
                    3-Class Classification
                  </span>
                </div>
              </div>
            </div>

            {/* Rule Based */}
            <div className="p-6 rounded-2xl border border-zinc-200/80 bg-white shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-lg mb-4">
                🧭
              </div>

              <h3 className="text-sm font-bold text-zinc-900">
                Rule-Based Content Strategy
              </h3>

              <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                Strategi konten ditentukan melalui aturan
                berdasarkan label sentimen. Sistem memberikan
                satu rekomendasi, tetapi pengguna tetap dapat
                memilih strategi lain sebelum proses generate.
              </p>

              <div className="space-y-2 mt-5">
                {STRATEGIES.map((item) => (
                  <div
                    key={item.sentiment}
                    className="flex items-center gap-2"
                  >
                    <span
                      className={`px-2 py-0.5 rounded-md border text-[9px] font-bold min-w-[55px] text-center ${item.style}`}
                    >
                      {item.sentiment}
                    </span>

                    <span className="text-[10px] font-bold text-zinc-700">
                      → {item.strategy}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Prompt & Gemini */}
            <div className="p-6 rounded-2xl border border-zinc-200/80 bg-white shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center text-lg mb-4">
                ✨
              </div>

              <h3 className="text-sm font-bold text-zinc-900">
                Structured Prompt & Gemini
              </h3>

              <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                PromptBuilder menyusun prompt berdasarkan
                empat konteks utama: topik, komentar, label
                sentimen, dan strategi final.
              </p>

              <div className="grid grid-cols-2 gap-2 mt-5">
                {[
                  "Topik",
                  "Komentar",
                  "Sentimen",
                  "Strategi Final",
                ].map((item) => (
                  <div
                    key={item}
                    className="px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-100 text-[10px] font-bold text-zinc-600"
                  >
                    {item}
                  </div>
                ))}
              </div>

              <p className="text-[10px] text-zinc-400 mt-4 leading-relaxed">
                Confidence dan distribusi probabilitas tidak
                dikirim sebagai masukan ke Gemini.
              </p>
            </div>

            {/* Output & History */}
            <div className="p-6 rounded-2xl border border-zinc-200/80 bg-white shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-lg mb-4">
                🗂️
              </div>

              <h3 className="text-sm font-bold text-zinc-900">
                Ide Konten & History
              </h3>

              <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                Gemini menghasilkan tepat tiga alternatif
                ide. Hasil kemudian diperiksa strukturnya,
                ditampilkan kepada pengguna, dan disimpan
                bersama hasil analisis ke PostgreSQL.
              </p>

              <div className="mt-5 grid grid-cols-3 gap-2">
                {[
                  "Opsi 1",
                  "Opsi 2",
                  "Opsi 3",
                ].map((item) => (
                  <div
                    key={item}
                    className="px-3 py-2 rounded-lg bg-teal-50 border border-teal-100 text-center text-[10px] font-bold text-teal-700"
                  >
                    {item}
                  </div>
                ))}
              </div>

              <p className="text-[10px] text-zinc-400 mt-4 leading-relaxed">
                Setiap ide terdiri dari judul, hook, isi
                konten, CTA, hashtag, dan justifikasi.
              </p>
            </div>
          </div>
        </section>

        {/* Scope */}
        <section className="border-t border-zinc-200/80 pt-12 mt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-200">
              <span className="text-[10px] font-bold uppercase tracking-widest text-teal-600">
                Cakupan Sistem
              </span>

              <h3 className="text-lg font-serif font-extrabold text-zinc-900 mt-2">
                Fokus pada layanan kesehatan
              </h3>

              <div className="space-y-3 mt-5">
                {[
                  "Setiap analisis memproses satu komentar.",
                  "Masukan dibatasi pada konteks layanan kesehatan.",
                  "Komentar dimasukkan langsung oleh pengguna.",
                  "Output berupa draf ide konten berbasis teks.",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-2.5"
                  >
                    <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">
                      ✓
                    </span>

                    <p className="text-xs text-zinc-600 leading-relaxed">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-200">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                Batasan
              </span>

              <h3 className="text-lg font-serif font-extrabold text-zinc-900 mt-2">
                Yang tidak dilakukan sistem
              </h3>

              <div className="space-y-3 mt-5">
                {[
                  "Tidak melakukan scraping media sosial secara real-time.",
                  "Tidak menghitung distribusi sentimen agregat dari komentar pengguna.",
                  "Tidak menyimpulkan opini publik secara umum.",
                  "Tidak melakukan forecasting tren atau penjadwalan konten.",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-2.5"
                  >
                    <span className="w-5 h-5 rounded-full bg-zinc-200 text-zinc-500 flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">
                      —
                    </span>

                    <p className="text-xs text-zinc-600 leading-relaxed">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* API */}
        <section className="border-t border-zinc-200/80 pt-12 mt-12">
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50/60 p-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-4">
              Alur API Utama
            </h3>

            <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
              <span className="px-3 py-1.5 rounded-lg bg-white border border-zinc-200 font-bold text-teal-700">
                POST /api/analyze
              </span>

              <span className="text-zinc-400">
                →
              </span>

              <span className="px-3 py-1.5 rounded-lg bg-white border border-zinc-200 font-bold text-teal-700">
                POST /api/generate
              </span>

              <span className="text-zinc-400">
                →
              </span>

              <span className="px-3 py-1.5 rounded-lg bg-white border border-zinc-200 font-bold text-teal-700">
                GET /api/history
              </span>
            </div>

            <p className="text-[10px] text-zinc-400 mt-4">
              Frontend Next.js berkomunikasi dengan backend
              Flask melalui REST API, sedangkan hasil
              analisis dan ide konten disimpan menggunakan
              PostgreSQL.
            </p>
          </div>
        </section>
      </main>

      <footer className="bg-zinc-50 py-12 border-t border-zinc-200 text-center text-xs text-zinc-400">
        <div className="max-w-5xl mx-auto space-y-2">
          <p className="font-bold text-zinc-700 text-sm">
            SehatFlow Content
          </p>

          <p className="font-medium">
            © 2026 SehatFlow Content. Hak Cipta
            Dilindungi Undang-Undang.
          </p>
        </div>
      </footer>
    </div>
  );
}