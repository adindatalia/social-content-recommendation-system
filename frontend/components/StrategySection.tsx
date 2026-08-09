"use client";

import { ANGLE_OPTIONS } from "@/lib/mockData";
import type { AnalysisResult } from "@/lib/types";

interface StrategySectionProps {
  analysis: AnalysisResult;
  selectedAngle: string;
  setSelectedAngle: (angle: string) => void;
  isGenerating: boolean;
  onGenerateIdeas: (e: React.FormEvent) => void;
}

function sentimentBadgeStyle(sentiment: string) {
  if (sentiment === "Negatif") {
    return "bg-red-50 border border-red-100 text-red-700";
  }

  if (sentiment === "Positif") {
    return "bg-emerald-50 border border-emerald-100 text-emerald-700";
  }

  return "bg-amber-50 border border-amber-100 text-amber-700";
}

function normalizeProbability(value: number | undefined) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return 0;
  }

  // Backend normalnya mengirim 0–1.
  // Jika suatu saat backend mengirim 0–100,
  // tetap aman ditampilkan.
  return value > 1 ? value / 100 : value;
}

export default function StrategySection({
  analysis,
  selectedAngle,
  setSelectedAngle,
  isGenerating,
  onGenerateIdeas,
}: StrategySectionProps) {
  const sentiment = analysis.sentiment ?? "Netral";

  const negative = normalizeProbability(
    analysis.probabilities?.Negatif
  );

  const neutral = normalizeProbability(
    analysis.probabilities?.Netral
  );

  const positive = normalizeProbability(
    analysis.probabilities?.Positif
  );

  const recommendedStrategy =
    analysis.recommended_strategy;

  const confidence =
    typeof analysis.confidence === "number"
      ? analysis.confidence
      : 0;

  const reasonText =
    recommendedStrategy?.reasoning?.join(" ") ??
    recommendedStrategy?.description ??
    "Strategi ditentukan berdasarkan hasil analisis sentimen.";

  const isOverridden =
    selectedAngle !== recommendedStrategy?.label;

  return (
    <section
      id="strategy-section"
      className="space-y-10 border-t border-zinc-200/80 pt-16 scroll-mt-20"
    >
      {/* ===================================================== */}
      {/* HASIL ANALISIS */}
      {/* ===================================================== */}

      <div className="space-y-2">
        <span className="text-[11px] font-bold tracking-widest text-teal-600 uppercase block">
          — Hasil Analisis
        </span>

        <h2 className="font-serif text-2xl md:text-[2rem] tracking-tight text-zinc-900 font-extrabold">
          Bagaimana sentimen terhadap{" "}
          <span className="text-teal-600 font-serif italic">
            {analysis.keyword ?? ""}
          </span>
          ?
        </h2>

        <p className="text-sm leading-relaxed text-zinc-500 max-w-lg font-medium">
          Analisis dilakukan menggunakan IndoBERTweet
          terhadap komentar yang diberikan.
        </p>
      </div>

      {/* ===================================================== */}
      {/* SENTIMENT + PROBABILITY */}
      {/* ===================================================== */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SENTIMEN UTAMA */}
        <div className="p-6 border border-zinc-200/80 rounded-2xl bg-white shadow-sm min-h-[230px] flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-zinc-900">
              Hasil Sentimen
            </h3>

            <p className="text-[11px] text-zinc-400 font-medium mt-1">
              Klasifikasi dari model IndoBERTweet
            </p>
          </div>

          <div className="flex flex-col items-center justify-center py-6">
            <span
              className={`px-5 py-2 rounded-full text-sm font-extrabold ${sentimentBadgeStyle(
                sentiment
              )}`}
            >
              {sentiment}
            </span>

            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mt-3">
              Confidence
            </p>

            <p className="text-2xl font-extrabold text-zinc-900 mt-1">
              {(confidence * 100).toFixed(2)}%
            </p>
          </div>
        </div>

        {/* PROBABILITAS */}
        <div className="p-6 border border-zinc-200/80 rounded-2xl bg-white shadow-sm min-h-[230px]">
          <div>
            <h3 className="text-sm font-bold text-zinc-900">
              Distribusi Probabilitas
            </h3>

            <p className="text-[11px] text-zinc-400 font-medium mt-1">
              Probabilitas prediksi dari IndoBERTweet
            </p>
          </div>

          <div className="space-y-5 mt-7">
            {[
              {
                label: "Negatif",
                value: negative,
                bar: "bg-red-500",
              },
              {
                label: "Netral",
                value: neutral,
                bar: "bg-amber-500",
              },
              {
                label: "Positif",
                value: positive,
                bar: "bg-emerald-500",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="space-y-1.5"
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-zinc-700">
                    {item.label}
                  </span>

                  <span className="text-xs font-extrabold text-zinc-900">
                    {(item.value * 100).toFixed(2)}%
                  </span>
                </div>

                <div className="w-full h-2 rounded-full bg-zinc-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${item.bar}`}
                    style={{
                      width: `${Math.min(
                        item.value * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===================================================== */}
      {/* STRATEGI */}
      {/* ===================================================== */}

      <form
        onSubmit={onGenerateIdeas}
        className="space-y-6"
      >
        <div className="space-y-2">
          <span className="text-[11px] font-bold tracking-widest text-teal-600 uppercase block">
            — Decision Support System
          </span>

          <h3 className="font-serif text-xl md:text-2xl tracking-tight text-zinc-900 font-extrabold">
            Pilih Strategi Konten
          </h3>

          <p className="text-xs text-zinc-400 font-medium">
            Sistem merekomendasikan strategi berdasarkan
            hasil sentimen. Anda tetap dapat memilih strategi
            lain.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ANGLE_OPTIONS.map((angle) => {
            const isSelected =
              selectedAngle === angle.id;

            const isRecommended =
              angle.id ===
              recommendedStrategy?.label;

            return (
              <button
                type="button"
                key={angle.id}
                onClick={() =>
                  setSelectedAngle(angle.id)
                }
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
                  <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px] font-bold shadow-sm">
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

        {/* =================================================== */}
        {/* REASON */}
        {/* =================================================== */}

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
                {recommendedStrategy?.label}
              </span>
              ).
            </p>
          )}
        </div>

        {/* =================================================== */}
        {/* GENERATE */}
        {/* =================================================== */}

        <div className="flex justify-center pt-2">
          <button
            type="submit"
            disabled={isGenerating}
            className="px-8 py-3.5 rounded-full text-xs font-bold transition shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed bg-zinc-900 hover:bg-zinc-800 text-white"
          >
            {isGenerating ? (
              <>
                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />

                <span>
                  Membuat Ide Konten...
                </span>
              </>
            ) : (
              <>
                <span>
                  Generate Ide Konten
                </span>

                <span>→</span>
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}