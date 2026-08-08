"use client";

import { ANGLE_OPTIONS } from "@/lib/mockData";
import type { AnalysisResult, PhraseItem } from "@/lib/types";

type SentimentLabel = "Negatif" | "Netral" | "Positif";

const SENTIMENT_TO_PHRASE_KEY: Record<
  SentimentLabel,
  keyof AnalysisResult["dominant_phrases"]
> = {
  Negatif: "negative",
  Netral: "neutral",
  Positif: "positive",
};

function dominantBadgeStyle(label: string) {
  if (label === "Negatif")
    return "bg-red-50 border border-red-100 text-red-700";
  if (label === "Positif")
    return "bg-emerald-50 border border-emerald-100 text-emerald-700";
  return "bg-amber-50 border border-amber-100 text-amber-700";
}

interface StrategySectionProps {
  analysis: AnalysisResult;
  selectedAngle: string;
  setSelectedAngle: (angle: string) => void;
  isGenerating: boolean;
  onGenerateIdeas: (e: React.FormEvent) => void;
}

export default function StrategySection({
  analysis,
  selectedAngle,
  setSelectedAngle,
  isGenerating,
  onGenerateIdeas,
}: StrategySectionProps) {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;

  const negative = analysis.distribution?.Negatif ?? 0;
  const neutral = analysis.distribution?.Netral ?? 0;
  const positive = analysis.distribution?.Positif ?? 0;

  const negativeLength = (negative / 100) * circumference;
  const neutralLength = (neutral / 100) * circumference;
  const positiveLength = (positive / 100) * circumference;

  const distribution = [
    { label: "Negatif", pct: negative, dot: "bg-red-500" },
    { label: "Netral", pct: neutral, dot: "bg-amber-500" },
    { label: "Positif", pct: positive, dot: "bg-emerald-500" },
  ];

  const dominant: SentimentLabel =
    analysis.recommended_strategy?.target_sentiment ??
    (negative >= neutral && negative >= positive
      ? "Negatif"
      : neutral >= positive
      ? "Netral"
      : "Positif");

  const dominantPhrases: PhraseItem[] =
    analysis.dominant_phrases?.[
      SENTIMENT_TO_PHRASE_KEY[dominant]
    ] ?? [];

  // Count terbesar digunakan sebagai acuan panjang progress bar.
  // Count tetap merupakan jumlah kemunculan asli, bukan persentase.
  const maxCount = Math.max(
    ...dominantPhrases.map((p) => p.count),
    1
  );

  const reasonText =
    analysis.recommended_strategy?.reasoning?.join(" ") ??
    analysis.recommended_strategy?.description ??
    "Strategi ditentukan sistem berdasarkan sentimen dominan dan frasa yang paling sering muncul pada topik ini.";

  const isOverridden =
    selectedAngle !== analysis.recommended_strategy?.label;

  return (
    <section
      id="strategy-section"
      className="space-y-10 border-t border-zinc-200/80 pt-16 scroll-mt-20"
    >
      {/* Ringkasan analisis keyword */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold tracking-widest text-teal-600 uppercase block">
          — Hasil Analisis
        </span>

        <h2 className="font-serif text-2xl md:text-[2rem] tracking-tight text-zinc-900 font-extrabold">
          Apa yang dibicarakan publik soal{" "}
          <span className="text-teal-600 font-serif italic">
            {analysis.keyword}
          </span>
          ?
        </h2>

        <p className="text-sm leading-relaxed text-zinc-500 max-w-lg font-medium">
          Analisis sentimen dari {analysis.total_comments} komentar publik
          yang relevan dengan topik ini.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Distribusi sentimen */}
        <div className="p-6 border border-zinc-200/80 rounded-2xl bg-white shadow-sm flex flex-col justify-between min-h-[260px]">
          <div className="flex justify-between items-start flex-wrap gap-3">
            <h3 className="text-sm font-bold text-zinc-900">
              Distribusi Sentimen
            </h3>

            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${dominantBadgeStyle(
                dominant
              )}`}
            >
              {dominant}
            </span>
          </div>

          <div className="flex items-center justify-around gap-6 flex-wrap my-6">
            <div className="relative w-32 h-32 shrink-0">
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
                  strokeDashoffset={`${
                    -(negativeLength + neutralLength)
                  }`}
                  strokeLinecap="round"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-extrabold text-zinc-900 leading-none">
                  {analysis.total_comments}
                </span>

                <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider mt-0.5">
                  Komentar
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {distribution.map((s) => (
                <div
                  key={s.label}
                  className="flex items-center gap-2.5"
                >
                  <span
                    className={`w-2.5 h-2.5 rounded-full shrink-0 ${s.dot}`}
                  />

                  <span className="text-xs font-bold text-zinc-700 min-w-[50px]">
                    {s.label}
                  </span>

                  <span className="text-xs font-extrabold text-zinc-900">
                    {s.pct}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Frasa dominan */}
        <div className="p-6 border border-zinc-200/80 rounded-2xl bg-white shadow-sm flex flex-col justify-between min-h-[260px]">
          <div>
            <h3 className="text-sm font-bold text-zinc-900">
              Frasa Dominan
            </h3>

            <p className="text-[11px] text-zinc-400 font-medium mt-0.5">
              Frasa yang paling sering muncul pada sentimen{" "}
              {dominant.toLowerCase()}
            </p>
          </div>

          <div className="space-y-4 my-4 flex-1 flex flex-col justify-center">
            {dominantPhrases.length === 0 ? (
              <p className="text-xs text-zinc-400 font-medium">
                Belum ada frasa dominan untuk kategori ini.
              </p>
            ) : (
              dominantPhrases.map((p, idx) => {
                const pct = Math.round(
                  (p.count / maxCount) * 100
                );

                return (
                  <div
                    key={`${p.keyword}-${idx}`}
                    className="space-y-1"
                  >
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-zinc-700">
                        {idx + 1}. {p.keyword}
                      </span>

                      <span className="text-zinc-400 font-bold">
                        {p.count}x sebutan
                      </span>
                    </div>

                    <div className="w-full h-1.5 rounded-full bg-zinc-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-teal-600 transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Pilih strategi konten */}
      <form onSubmit={onGenerateIdeas} className="space-y-6">
        <div className="space-y-2">
          <span className="text-[11px] font-bold tracking-widest text-teal-600 uppercase block">
            — Decision Support System
          </span>

          <h3 className="font-serif text-xl md:text-2xl tracking-tight text-zinc-900 font-extrabold">
            Pilih Strategi Konten
          </h3>

          <p className="text-xs text-zinc-400 font-medium">
            Sistem sudah menandai strategi yang paling sesuai dengan data di
            atas. Anda tetap bisa memilih strategi lain.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ANGLE_OPTIONS.map((angle) => {
            const isSelected = selectedAngle === angle.id;
            const isRecommended =
              angle.id === analysis.recommended_strategy?.label;

            return (
              <button
                type="button"
                key={angle.id}
                onClick={() => setSelectedAngle(angle.id)}
                className={`p-5 text-left cursor-pointer transition-all duration-200 flex flex-col gap-3 rounded-2xl relative border ${
                  isSelected
                    ? "border-teal-600 bg-teal-50/20 ring-1 ring-teal-600"
                    : "border-zinc-200 bg-white hover:border-zinc-300"
                }`}
              >
                {isRecommended && (
                  <span className="absolute -top-2.5 left-4 px-2 py-0.5 rounded-full text-[9px] font-bold bg-teal-600 text-white shadow-sm">
                    ★ Recommended
                  </span>
                )}

                {isSelected && (
                  <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px] font-bold shadow-sm shadow-teal-600/30">
                    ✓
                  </div>
                )}

                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center border text-sm font-bold ${angle.iconColor}`}
                >
                  {angle.icon}
                </div>

                <div>
                  <h4 className="text-xs font-bold text-zinc-900">
                    {angle.title}
                  </h4>

                  <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed font-medium">
                    {angle.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-zinc-100 flex flex-col gap-1">
                  <span
                    className={`inline-block px-2 py-0.5 border rounded-md text-[9px] font-bold self-start ${angle.badgeStyle}`}
                  >
                    {angle.badge}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Reason & recommendation */}
        <div className="rounded-2xl border border-teal-100 bg-teal-50/40 p-6">
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700">
            Reason
          </span>

          <p className="text-sm text-zinc-600 leading-relaxed mt-2 max-w-3xl">
            {reasonText}
          </p>

          {isOverridden && (
            <p className="text-xs text-zinc-500 leading-relaxed mt-3 max-w-3xl">
              Anda memilih strategi{" "}
              <span className="font-bold text-zinc-700">
                {selectedAngle}
              </span>
              , berbeda dari rekomendasi sistem (
              <span className="font-bold text-zinc-700">
                {analysis.recommended_strategy?.label}
              </span>
              ).
            </p>
          )}
        </div>

        <div className="flex justify-center pt-2">
          <button
            type="submit"
            disabled={isGenerating}
            className="px-8 py-3.5 rounded-full text-xs font-bold transition shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed bg-zinc-900 hover:bg-zinc-800 text-white"
          >
            {isGenerating ? (
              <>
                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>Membuat Ide Konten...</span>
              </>
            ) : (
              <>
                <span>Generate Ide Konten</span>
                <span>→</span>
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}