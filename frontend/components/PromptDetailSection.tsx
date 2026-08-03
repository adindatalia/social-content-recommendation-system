"use client";

import { useState } from "react";
import type { AnalysisResult, GenerationResult, PhraseItem } from "@/lib/types";

type SentimentLabel = "Negatif" | "Netral" | "Positif";

const SENTIMENT_TO_PHRASE_KEY: Record<SentimentLabel, keyof AnalysisResult["dominant_phrases"]> = {
  Negatif: "negative",
  Netral: "neutral",
  Positif: "positive",
};

interface PromptDetailSectionProps {
  result: GenerationResult;
  copiedId: string | null;
  onCopy: (id: string, text: string) => void;
}

/**
 * Detail teknis: prompt persis yang dikirim ke LLM + alur pemrosesan
 * sistem. Dipertahankan sebagai bukti proses prompt engineering untuk
 * laporan skripsi, tapi diletakkan di bawah hasil ide konten dan
 * default tertutup supaya tidak mengganggu alur utama user.
 */
export default function PromptDetailSection({ result, copiedId, onCopy }: PromptDetailSectionProps) {
  const [open, setOpen] = useState(false);
  const analysis = result.analysis;

  const dominant: SentimentLabel =
    analysis.recommended_strategy.target_sentiment ??
    (analysis.distribution.Negatif >= analysis.distribution.Netral &&
    analysis.distribution.Negatif >= analysis.distribution.Positif
      ? "Negatif"
      : analysis.distribution.Netral >= analysis.distribution.Positif
      ? "Netral"
      : "Positif");

  const dominantPhrases: PhraseItem[] = analysis.dominant_phrases?.[SENTIMENT_TO_PHRASE_KEY[dominant]] ?? [];

  const promptId = "prompt";
  const promptText = `Role :
  Anda adalah seorang Content Strategist bidang kesehatan.
  Input Analisis
  Keyword :
  ${analysis.keyword}
  Sentimen Dominan :
  ${dominant}
  Frasa Dominan :
  ${dominantPhrases.map((p) => `• ${p.keyword}`).join("\n")}
  Strategi Konten :
  ${result.angle}
  Output yang diminta :
  1. Berikan 3 ide konten.
  2. Setiap ide harus berisi:
  - Judul
  - Hook
  - Isi
  - CTA
  - Hashtag
  - Justifikasi.`;

  return (
    <section className="border-t border-zinc-200/80 pt-10">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-600 transition cursor-pointer"
      >
        <span>{open ? "−" : "+"}</span>
        <span>Lihat detail teknis (prompt & alur pemrosesan sistem)</span>
      </button>

      {open && (
        <div className="space-y-6 mt-6">
          <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 bg-zinc-50">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-zinc-500 font-mono">prompt.txt</span>
                <span className="px-2 py-1 rounded-md bg-teal-50 border border-teal-100 text-[10px] font-bold uppercase text-teal-700">
                  LLM Input
                </span>
              </div>
              <button
                onClick={() => onCopy(promptId, promptText)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition ${
                  copiedId === promptId ? "bg-teal-600 text-white" : "border border-zinc-200 hover:border-zinc-300 bg-white"
                }`}
              >
                {copiedId === promptId ? "Disalin!" : "Copy"}
              </button>
            </div>
            <div className="p-6">
              <pre className="whitespace-pre-wrap text-[13px] leading-7 font-mono text-zinc-700 bg-zinc-50 rounded-xl p-5 border border-zinc-200 overflow-auto">
                {promptText}
              </pre>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h3 className="font-bold text-sm mb-5">Alur Pemrosesan Sistem</h3>
            <div className="flex flex-wrap items-center justify-center gap-4 text-center">
              <div className="px-5 py-4 rounded-xl bg-zinc-50 border border-zinc-200">
                <p className="text-xs font-bold">Analisis Sentimen</p>
              </div>
              <span className="text-zinc-400 font-bold">→</span>
              <div className="px-5 py-4 rounded-xl bg-zinc-50 border border-zinc-200">
                <p className="text-xs font-bold">Prompt Engineering</p>
              </div>
              <span className="text-zinc-400 font-bold">→</span>
              <div className="px-5 py-4 rounded-xl bg-zinc-50 border border-zinc-200">
                <p className="text-xs font-bold">Large Language Model</p>
              </div>
              <span className="text-zinc-400 font-bold">→</span>
              <div className="px-5 py-4 rounded-xl bg-teal-50 border border-teal-200">
                <p className="text-xs font-bold text-teal-700">Rekomendasi Konten</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
