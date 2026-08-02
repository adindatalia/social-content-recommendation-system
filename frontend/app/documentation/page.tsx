import Link from "next/link";
import Navbar from "@/components/Navbar";

const PIPELINE_STEPS = [
  {
    icon: "⌨️",
    title: "Keyword Input",
    desc: "User memasukkan topik atau isu kesehatan yang ingin dianalisis.",
  },
  {
    icon: "🔍",
    title: "Semantic Search",
    desc: "Sistem mencari komentar publik yang relevan secara makna, bukan cocok kata literal.",
  },
  {
    icon: "🧠",
    title: "IndoBERT Sentiment",
    desc: "Setiap komentar relevan diklasifikasi ke Negatif, Netral, atau Positif.",
  },
  {
    icon: "📝",
    title: "Prompt Engineering",
    desc: "Distribusi sentimen & frasa dominan disusun menjadi prompt terstruktur.",
  },
  {
    icon: "✨",
    title: "LLM",
    desc: "Prompt dikirim ke Large Language Model untuk sintesis ide konten.",
  },
  {
    icon: "🧭",
    title: "Rekomendasi Strategi",
    desc: "Sistem menentukan angle konten paling relevan dari hasil analisis.",
  },
  {
    icon: "💡",
    title: "Ide Konten",
    desc: "Draf judul, hook, isi, CTA, hashtag, dan justifikasi siap dipakai.",
  },
];

export default function DocumentationPage() {
  return (
    <div className="min-h-screen antialiased bg-white text-zinc-900 font-sans">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 pb-20">
        {/* Hero */}
        <section className="py-20 text-center space-y-6 max-w-3xl mx-auto">
          <span className="px-4 py-1.5 border rounded-full text-xs font-bold tracking-wide inline-flex items-center gap-1.5 shadow-sm bg-teal-50 border-teal-100 text-teal-700">
            Introduction
          </span>

          <h1 className="font-serif text-[clamp(2.2rem,5.5vw,3.6rem)] leading-[1.12] tracking-tight text-zinc-900 font-extrabold">
            Precision Intelligence untuk{" "}
            <span className="text-teal-600">Strategi Konten Kesehatan</span>
          </h1>

          <p className="text-[15px] leading-relaxed max-w-lg mx-auto text-zinc-500 font-medium">
            SehatFlow Content adalah decision support system yang membaca sentimen publik seputar
            topik kesehatan, lalu menyusun rekomendasi strategi dan draf konten media sosial
            secara otomatis menggunakan AI.
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

        {/* How the System Works */}
        <section className="space-y-12 border-t border-zinc-200/80 pt-16">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-[11px] font-bold tracking-widest text-teal-600 uppercase block">
              — Cara Kerja Sistem
            </span>
            <h2 className="font-serif text-2xl md:text-[2rem] tracking-tight text-zinc-900 font-extrabold">
              How the System Works
            </h2>
            <p className="text-sm leading-relaxed text-zinc-500 font-medium">
              Pipeline berlapis yang mengubah kata kunci menjadi rekomendasi konten terverifikasi,
              melalui serangkaian tahap AI.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-x-4 gap-y-10 relative">
            {PIPELINE_STEPS.map((step, idx) => (
              <div key={step.title} className="flex flex-col items-center text-center gap-3 relative">
                {idx < PIPELINE_STEPS.length - 1 && (
                  <span className="hidden lg:block absolute top-6 left-[calc(50%+28px)] w-[calc(100%-28px)] h-px bg-zinc-200" />
                )}
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-lg border shrink-0 z-10 ${
                    idx === PIPELINE_STEPS.length - 1
                      ? "bg-teal-600 border-teal-600 text-white shadow-sm shadow-teal-600/30"
                      : "bg-white border-zinc-200"
                  }`}
                >
                  {step.icon}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-zinc-900">{step.title}</h3>
                  <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed font-medium max-w-[9rem] mx-auto">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Detail cards */}
        <section className="space-y-6 border-t border-zinc-200/80 pt-16 mt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Semantic Search */}
            <div className="p-6 rounded-2xl border border-zinc-200/80 bg-white shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-lg mb-4">
                🔍
              </div>
              <h3 className="text-sm font-bold text-zinc-900">Semantic Search</h3>
              <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                Alih-alih mencocokkan kata secara literal, sistem meng-encode kata kunci dan seluruh
                komentar publik menjadi vector embedding, lalu mengurutkan komentar berdasarkan
                cosine similarity. Threshold kemiripan diturunkan secara bertahap (adaptive threshold)
                apabila hasil awal terlalu sedikit, sehingga analisis tetap punya cukup data untuk diproses.
              </p>
            </div>

            {/* IndoBERT */}
            <div className="p-6 rounded-2xl bg-teal-700 text-white shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-lg mb-4">
                🧠
              </div>
              <h3 className="text-sm font-bold">IndoBERT Sentiment</h3>
              <p className="text-xs text-teal-50/90 mt-2 leading-relaxed">
                Model transformer berbasis IndoBERT yang di-fine-tune khusus untuk teks Bahasa
                Indonesia, mengklasifikasikan setiap komentar ke tiga kelas: Negatif, Netral, atau
                Positif. Prediksi dijalankan secara batch agar analisis ratusan komentar tetap cepat.
              </p>
              <div className="mt-5 pt-4 border-t border-white/15 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-300" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-50/90">
                  3-Class Sentiment Classification
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Prompt Engineering + LLM */}
            <div className="p-6 rounded-2xl border border-zinc-200/80 bg-white shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center text-lg mb-4">
                📝
              </div>
              <h3 className="text-sm font-bold text-zinc-900">Prompt Engineering &amp; LLM</h3>
              <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                Distribusi sentimen, frasa dominan, dan strategi yang dipilih disusun menjadi
                prompt terstruktur lengkap dengan arahan gaya dan larangan per strategi. Prompt inilah
                yang dikirim ke Large Language Model untuk menghasilkan 3 ide konten siap pakai —
                setiap ide wajib merujuk data analisis, bukan pengetahuan umum.
              </p>
            </div>

            {/* Decision Support */}
            <div className="p-6 rounded-2xl border border-zinc-200/80 bg-white shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-lg mb-4">
                🧭
              </div>
              <h3 className="text-sm font-bold text-zinc-900">Decision Support System</h3>
              <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                Berdasarkan distribusi sentimen dan frasa dominan, sistem merekomendasikan salah
                satu dari tiga strategi konten — Address Pain Point, Edukasi Informatif, atau
                Showcase Positif. User tetap bisa memilih strategi lain secara manual sebelum ide
                konten digenerate.
              </p>
            </div>
          </div>
        </section>

        {/* Endpoints note */}
        <section className="border-t border-zinc-200/80 pt-16 mt-16">
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50/60 p-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-4">
              Alur API Utama
            </h3>
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
              <span className="px-3 py-1.5 rounded-lg bg-white border border-zinc-200 font-bold text-teal-700">
                POST /api/analyze
              </span>
              <span className="text-zinc-400">→</span>
              <span className="px-3 py-1.5 rounded-lg bg-white border border-zinc-200 font-bold text-teal-700">
                POST /api/generate
              </span>
              <span className="text-zinc-400">→</span>
              <span className="px-3 py-1.5 rounded-lg bg-white border border-zinc-200 font-bold text-teal-700">
                GET /api/history
              </span>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-zinc-50 py-12 border-t border-zinc-200 text-center text-xs text-zinc-400">
        <div className="max-w-5xl mx-auto space-y-2">
          <p className="font-bold text-zinc-700 text-sm">🚀 SehatFlow Content Platform</p>
          <p className="font-medium">© 2026 SehatFlow Content. Hak Cipta Dilindungi Undang-Undang.</p>
        </div>
      </footer>
    </div>
  );
}
