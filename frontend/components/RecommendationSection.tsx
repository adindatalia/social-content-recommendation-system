"use client";

import { useState } from "react";
import type { AnalysisResult, GenerationResult, PhraseItem } from "@/lib/types";

type SentimentLabel = "Negatif" | "Netral" | "Positif";

const SENTIMENT_TO_PHRASE_KEY: Record<
  SentimentLabel,
  keyof AnalysisResult["dominant_phrases"]
> = {
  Negatif: "negative",
  Netral: "neutral",
  Positif: "positive",
};

interface RecommendationSectionProps {
  result: GenerationResult;
  analysis: AnalysisResult;

  copiedId: string | null;

  onCopy: (id: string, text: string) => void;
  onSave: (title: string) => void;
  onReset: () => void;
}


function formatBadgeStyle(format: string) {
  if (format === "TIKTOK - REELS" || format === "Reels")
    return "bg-rose-50 border border-rose-100 text-rose-700";

  if (format === "FEED - CAROUSEL" || format === "Carousel")
    return "bg-teal-50 border border-teal-100 text-teal-700";

  return "bg-indigo-50 border border-indigo-100 text-indigo-700";
}

function dominantBadgeStyle(label: string) {
  if (label === "Negatif")
    return "bg-red-50 border border-red-100 text-red-700";

  if (label === "Positif")
    return "bg-emerald-50 border border-emerald-100 text-emerald-700";

  return "bg-amber-50 border border-amber-100 text-amber-700";
}

const STRATEGY_REASON: Record<string, string> = {
  "Address Pain Point":
    "Strategi dipilih karena mayoritas komentar mengandung keluhan sehingga konten difokuskan untuk memberikan solusi terhadap pain point utama audiens.",

  "Educational":
    "Strategi dipilih untuk memberikan edukasi berdasarkan kebutuhan informasi pengguna.",

  "Myth vs Fact":
    "Strategi dipilih karena ditemukan banyak miskonsepsi pada komentar pengguna.",

  "Promotion":
    "Strategi dipilih karena sentimen publik cenderung positif sehingga cocok diarahkan ke promosi.",
};
export default function RecommendationSection({
  result,
  analysis,
  copiedId,
  onCopy,
  onSave,
  onReset,
}: RecommendationSectionProps) {
  const [promptOpen, setPromptOpen] = useState(true);

  const distribution: {
  label: string;
  pct: number;
  dot: string;
  }[] = [
    {
      label: "Negatif",
      pct: analysis.distribution.Negatif,
      dot: "bg-red-500",
    },
    {
      label: "Netral",
      pct: analysis.distribution.Netral,
      dot: "bg-yellow-500",
    },
    {
      label: "Positif",
      pct: analysis.distribution.Positif,
      dot: "bg-emerald-500",
    },
  ];

  const dominant: SentimentLabel =
    analysis.distribution.Negatif >= analysis.distribution.Netral &&
    analysis.distribution.Negatif >= analysis.distribution.Positif
      ? "Negatif"
      : analysis.distribution.Netral >= analysis.distribution.Positif
      ? "Netral"
      : "Positif";

  const dominantPhrases: PhraseItem[] =
    analysis.dominant_phrases?.[SENTIMENT_TO_PHRASE_KEY[dominant]] ?? [];

  const promptId = "prompt";

  const promptText = `Role :
  Anda adalah seorang Content Strategist bidang kesehatan.
  Input Analisis
  Keyword :
  ${analysis.keyword}
  Sentimen Dominan :
  ${dominant}
  Frasa Dominan :
  ${dominantPhrases
    .map((p: PhraseItem) => `• ${p.keyword}`)
    .join("\n")}
  Strategi Konten :
  ${analysis.recommended_strategy?.label}
  Instruksi :
  ${
    STRATEGY_REASON[analysis.recommended_strategy.label] ??
    STRATEGY_REASON["Address Pain Point"]
  }
  Output yang diminta :
  1. Berikan 3 ide konten.
  2. Setiap ide harus berisi:
  - Judul
  - Hook
  - Isi
  - CTA
  - Hashtag
  - Justifikasi.`;

  const radius = 38;
  const circumference = 2 * Math.PI * radius;

  const negative = analysis.distribution?.Negatif ?? 0;
  const neutral = analysis.distribution?.Netral ?? 0;
  const positive = analysis.distribution?.Positif ?? 0;

  const negativeLength = (negative / 100) * circumference;
  const neutralLength = (neutral / 100) * circumference;
  const positiveLength = (positive / 100) * circumference;

  return (
    <section
      id="result-section"
      className="space-y-14 border-t border-zinc-200/80 pt-16 scroll-mt-20"
    >
      {/* ================================================= */}
      {/* HASIL ANALISIS */}
      {/* ================================================= */}

      <div className="space-y-8">

        <div>

          <span className="text-[11px] font-bold uppercase tracking-widest text-teal-600 block">
            — Hasil Analisis
          </span>

          <h2 className="font-serif text-3xl font-extrabold tracking-tight mt-2">
            Ringkasan Analisis Sentimen
          </h2>

          <p className="text-sm text-zinc-500 mt-2 max-w-2xl leading-relaxed">
            Sistem terlebih dahulu menganalisis percakapan publik mengenai
            <span className="font-bold text-zinc-700">
              {" "}
              <span className="font-bold text-zinc-700">
                {analysis.keyword}
              </span>
            </span>
            . Hasil analisis inilah yang menjadi dasar penyusunan prompt
            sebelum menghasilkan rekomendasi konten menggunakan AI.
          </p>

        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* LEFT */}

          <div className="lg:col-span-2 rounded-2xl border border-zinc-200 bg-white shadow-sm p-6">

            <div className="flex justify-between items-start flex-wrap gap-3">

              <div>

                <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-400">
                  Keyword
                </span>

                <h3 className="text-2xl font-bold mt-1">
                  {analysis.keyword}
                </h3>

                <p className="text-xs text-zinc-400 mt-1">
                  {analysis.total_comments} komentar dianalisis
                </p>

              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${dominantBadgeStyle(
                  dominant
                )}`}
              >
                {dominant}
              </span>

            </div>

            <div className="flex flex-wrap justify-center items-center gap-10 mt-10">

              {/* PIE */}

              <div className="relative w-40 h-40">

                <svg
                  className="w-full h-full -rotate-90"
                  viewBox="0 0 100 100"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    stroke="#f4f4f5"
                    strokeWidth="12"
                    fill="none"
                  />

                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    stroke="#ef4444"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${negativeLength} ${circumference}`}
                    strokeDashoffset="0"
                    strokeLinecap="round"
                  />

                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    stroke="#f59e0b"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${neutralLength} ${circumference}`}
                    strokeDashoffset={`${-negativeLength}`}
                    strokeLinecap="round"
                  />

                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    stroke="#10b981"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${positiveLength} ${circumference}`}
                    strokeDashoffset={`${-(negativeLength + neutralLength)}`}
                    strokeLinecap="round"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-extrabold">
                    {analysis.total_comments}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-zinc-400">
                    komentar
                  </span>

                </div>

              </div>

              {/* LEGEND */}

              <div className="space-y-4">

                {distribution.map((item) => (

                  <div
                    key={item.label}
                    className="flex items-center gap-3"
                  >

                    <span
                      className={`w-3 h-3 rounded-full ${item.dot}`}
                    />

                    <span className="font-semibold w-16 text-sm">
                      {item.label}
                    </span>

                    <span className="font-bold">
                      {item.pct}%
                    </span>

                  </div>

                ))}

              </div>

            </div>

          </div>

          {/* RIGHT */}

          <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm p-6">

            <h3 className="font-bold text-sm">
              Frasa Dominan
            </h3>

            <p className="text-xs text-zinc-400 mt-1">
              Frasa yang paling sering muncul pada sentimen {dominant.toLowerCase()}
            </p>

            <div className="space-y-5 mt-6">

              {dominantPhrases.map((item: PhraseItem, index: number) => (

                <div key={`${item.keyword}-${index}`}>

                  <div className="flex justify-between text-xs mb-2">

                    <span className="font-semibold">
                      {index + 1}. {item.keyword}
                    </span>

                    <span className="font-bold">
                      {item.count}%
                    </span>

                  </div>

                  <div className="w-full h-2 rounded-full bg-zinc-100">

                    <div
                      className="h-full bg-teal-600 rounded-full"
                      style={{
                        width: `${item.count}%`,
                      }}
                    />

                  </div>

                </div>

              ))}

            </div>

          </div>

        </div>

        {/* Decision */}

        <div className="rounded-2xl border border-teal-100 bg-teal-50/40 p-6">

          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700">
            Decision Support System
          </span>

          <h3 className="font-bold text-lg mt-2">
            Strategi yang Dipilih Sistem
          </h3>

          <div className="flex flex-wrap items-center gap-3 mt-4">

            <span className="px-3 py-1 rounded-lg bg-zinc-900 text-white text-sm font-bold">
              {analysis.recommended_strategy.label}
            </span>

          </div>

          <p className="text-sm text-zinc-600 leading-relaxed mt-4 max-w-3xl">
            {
              STRATEGY_REASON[analysis.recommended_strategy.label] ??
              STRATEGY_REASON["Address Pain Point"]
            }
          </p>

        </div>

      </div>

      {/* PROMPT ENGINEERING */}
      <div className="space-y-8">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-teal-600 block">
            — Prompt Engineering
          </span>

          <h2 className="font-serif text-3xl font-extrabold tracking-tight mt-2">
            Prompt yang Dikirim ke AI
          </h2>

          <p className="text-sm text-zinc-500 mt-2 max-w-2xl leading-relaxed">
            Berdasarkan hasil analisis sebelumnya, sistem menyusun prompt
            terstruktur yang akan dikirim ke Large Language Model (LLM)
            untuk menghasilkan rekomendasi ide konten.
          </p>

        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden">

          {/* Header */}

          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 bg-zinc-50">

            <div className="flex items-center gap-3">

              <div className="flex gap-1">

                <span className="w-2.5 h-2.5 rounded-full bg-red-300" />

                <span className="w-2.5 h-2.5 rounded-full bg-yellow-300" />

                <span className="w-2.5 h-2.5 rounded-full bg-green-300" />

              </div>

              <span className="text-xs font-bold text-zinc-500 font-mono">
                prompt.txt
              </span>

              <span className="px-2 py-1 rounded-md bg-teal-50 border border-teal-100 text-[10px] font-bold uppercase text-teal-700">
                LLM Input
              </span>

            </div>

            <div className="flex gap-2">

              <button
                onClick={() =>
                  onCopy(
                    promptId,
                    promptText
                  )
                }
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition ${
                  copiedId === promptId
                    ? "bg-teal-600 text-white"
                    : "border border-zinc-200 hover:border-zinc-300 bg-white"
                }`}
              >
                {copiedId === promptId ? "Disalin!" : "Copy"}
              </button>

              <button
                onClick={() => setPromptOpen(!promptOpen)}
                className="w-8 h-8 rounded-lg border border-zinc-200 hover:bg-zinc-50 flex items-center justify-center"
              >
                {promptOpen ? "−" : "+"}
              </button>

            </div>

          </div>

          {/* Prompt */}

          {promptOpen && (

            <div className="p-6">
              <pre className="whitespace-pre-wrap text-[13px] 
              leading-7 font-mono text-zinc-700 bg-zinc-50 rounded-xl 
              p-5 border border-zinc-200 overflow-auto">
                {promptText}
              </pre>
            </div>
          )}

        </div>

        {/* Pipeline */}

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">

          <h3 className="font-bold text-sm mb-5">
            Alur Pemrosesan Sistem
          </h3>

          <div className="flex flex-wrap items-center justify-center gap-4 text-center">

            <div className="px-5 py-4 rounded-xl bg-zinc-50 border border-zinc-200">

              <p className="text-xs font-bold">
                Analisis Sentimen
              </p>

            </div>

            <span className="text-zinc-400 font-bold">
              →
            </span>

            <div className="px-5 py-4 rounded-xl bg-zinc-50 border border-zinc-200">

              <p className="text-xs font-bold">
                Prompt Engineering
              </p>

            </div>

            <span className="text-zinc-400 font-bold">
              →
            </span>

            <div className="px-5 py-4 rounded-xl bg-zinc-50 border border-zinc-200">

              <p className="text-xs font-bold">
                Large Language Model
              </p>

            </div>

            <span className="text-zinc-400 font-bold">
              →
            </span>

            <div className="px-5 py-4 rounded-xl bg-teal-50 border border-teal-200">

              <p className="text-xs font-bold text-teal-700">
                Rekomendasi Konten
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* HASIL GENERATE AI */}
      
      <div className="space-y-6">
        <div className="space-y-2">
          <span className="text-[11px] font-bold tracking-widest text-teal-600 uppercase block">— Hasil Generate AI</span>
          <h2 className="font-serif text-2xl md:text-[2rem] tracking-tight text-zinc-900 font-extrabold">
            {result.ideas.length} ide konten untuk address keluhan{" "}
            <span className="text-teal-600 font-serif italic font-bold leading-none">{result.keyword}</span>
          </h2>
          <p className="text-sm leading-relaxed text-zinc-500 max-w-lg font-medium">
            Ide konten ini disesuaikan berdasarkan analisis tren sentimen publik tentang {result.keyword}.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {result.ideas.map((idea:GenerationResult["ideas"][number]) => (
            <div
              key={idea.id}
              className="p-5 flex flex-col justify-between border border-zinc-200 rounded-2xl bg-white hover:shadow-lg transition-all"
            >
              <div className="space-y-4">
                <span className={`inline-block px-2.5 py-0.5 rounded-md text-[9px] font-bold ${formatBadgeStyle(idea.format)}`}>
                  {idea.format}
                </span>

                <h4 className="text-xs font-bold text-zinc-900 leading-snug">{idea.title}</h4>

                <div className="space-y-3 bg-zinc-50/50 p-4 rounded-xl border border-zinc-100 text-xs">
                  <div>
                    <span className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wide">1. Hook</span>
                    <p className="text-zinc-700 italic mt-0.5 font-medium">&ldquo;{idea.hook}&rdquo;</p>
                  </div>
                  <div>
                    <span className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wide">2. Isi Postingan</span>
                    <p className="text-zinc-600 mt-0.5 leading-relaxed font-medium">{idea.body}</p>
                  </div>
                  <div>
                    <span className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wide">3. Call to Action (CTA)</span>
                    <p className="text-zinc-800 font-bold mt-0.5">{idea.cta}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {idea.hashtags.map((tag:string) => (
                    <span key={tag} className="text-[10px] text-teal-600 font-bold">#{tag}</span>
                  ))}
                </div>

                <div className="p-3 bg-zinc-50 border border-zinc-200/50 rounded-xl text-[10px] text-zinc-500 leading-relaxed font-medium flex gap-1.5 items-start">
                  <span>💡</span>
                  <div>
                    <span className="font-bold text-zinc-800">Justifikasi:</span> {idea.justification}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-zinc-100 pt-4 mt-6">
                <button
                  onClick={() =>
                    onCopy(
                      idea.id,
                      `Judul: ${idea.title}\n\nHook: ${idea.hook}\nIsi: ${idea.body}\nCTA: ${idea.cta}\n\nHashtags: ${idea.hashtags
                        .map((t:string) => `#${t}`)
                        .join(" ")}\nJustifikasi: ${idea.justification}`
                    )
                  }
                  className={`text-[10px] px-3.5 py-1.5 border rounded-xl font-bold transition flex items-center gap-1.5 ${
                    copiedId === idea.id
                      ? "bg-teal-600 border-teal-600 text-white"
                      : "bg-white border-zinc-200 hover:border-zinc-300 text-zinc-700 hover:bg-zinc-50/50 cursor-pointer"
                  }`}
                >
                  <span>{copiedId === idea.id ? "Disalin!" : "Copy"}</span>
                </button>
                <button
                  onClick={() => onSave(idea.title)}
                  className="text-[10px] px-3.5 py-1.5 border rounded-xl font-bold bg-zinc-900 border-zinc-900 text-white hover:bg-zinc-800 transition cursor-pointer"
                >
                  Save
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center pt-4">
          <button
            onClick={onReset}
            className="text-xs font-bold text-zinc-400 hover:text-zinc-500 transition cursor-pointer"
          >
            ↻ Generate ulang dengan parameter berbeda
          </button>
        </div>
      </div>
    </section>
  );
}