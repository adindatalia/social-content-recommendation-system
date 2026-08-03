"use client";

import type { GenerationResult } from "@/lib/types";

function formatBadgeStyle(format: string) {
  if (format === "TIKTOK - REELS" || format === "Reels") return "bg-rose-50 border border-rose-100 text-rose-700";
  if (format === "FEED - CAROUSEL" || format === "Carousel") return "bg-teal-50 border border-teal-100 text-teal-700";
  return "bg-indigo-50 border border-indigo-100 text-indigo-700";
}

interface IdeasSectionProps {
  result: GenerationResult;
  copiedId: string | null;
  onCopy: (id: string, text: string) => void;
  onSave: (title: string) => void;
  onReset: () => void;
}

export default function IdeasSection({ result, copiedId, onCopy, onSave, onReset }: IdeasSectionProps) {
  return (
    <section id="ideas-section" className="space-y-6 border-t border-zinc-200/80 pt-16 scroll-mt-20">
      <div className="space-y-2">
        <span className="text-[11px] font-bold tracking-widest text-teal-600 uppercase block">
          — Ide Konten Rekomendasi AI
        </span>
        <h2 className="font-serif text-2xl md:text-[2rem] tracking-tight text-zinc-900 font-extrabold">
          {result.ideas.length} ide konten untuk{" "}
          <span className="text-teal-600 font-serif italic font-bold leading-none">{result.keyword}</span>
        </h2>
        <p className="text-sm leading-relaxed text-zinc-500 max-w-lg font-medium">
          Disusun berdasarkan strategi{" "}
          <span className="font-bold text-zinc-700">{result.angle}</span> dan analisis tren sentimen publik tentang{" "}
          {result.keyword}.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {result.ideas.map((idea) => (
          <div
            key={idea.id}
            className="p-5 flex flex-col justify-between border border-zinc-200 rounded-2xl bg-white hover:shadow-lg transition-all"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`inline-block px-2.5 py-0.5 rounded-md text-[9px] font-bold ${formatBadgeStyle(idea.format)}`}>
                  {idea.format}
                </span>
                {idea.category && (
                  <span className="inline-block px-2.5 py-0.5 rounded-md text-[9px] font-bold bg-zinc-100 border border-zinc-200 text-zinc-600">
                    {idea.category}
                  </span>
                )}
              </div>

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
                {idea.hashtags.map((tag) => (
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
                      .map((t) => `#${t}`)
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
    </section>
  );
}
