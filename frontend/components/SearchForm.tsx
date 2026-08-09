import { TOPIC_SUGGESTIONS } from "@/lib/mockData";

interface SearchFormProps {
  topic: string;
  setTopic: (value: string) => void;

  comments: string;
  setComments: (value: string) => void;

  isAnalyzing: boolean;
  onAnalyze: (e: React.FormEvent) => void;
  onSelectTopic: (topic: string) => void;
}

export default function SearchForm({
  topic,
  setTopic,
  comments,
  setComments,
  isAnalyzing,
  onAnalyze,
  onSelectTopic,
}: SearchFormProps) {
  return (
    <section
      id="generator-section"
      className="space-y-8"
    >
      <div className="space-y-2">
        <span className="text-[11px] font-bold tracking-widest text-teal-600 uppercase block">
          — Analisis
        </span>

        <h2 className="font-serif text-2xl md:text-[2rem] tracking-tight text-zinc-900 font-extrabold">
          Analisis Tren Topik Kesehatan
        </h2>

        <p className="mt-1 text-xs text-zinc-400">
          Analisis satu komentar menggunakan IndoBERTweet
          untuk menentukan sentimen dan strategi konten.
        </p>
      </div>

      <form onSubmit={onAnalyze} className="space-y-5">
        {/* Topic */}
        <div>
          <label
            htmlFor="topic-input"
            className="block text-xs font-bold text-zinc-700 mb-2"
          >
            Topic
          </label>

          <input
            id="topic-input"
            type="text"
            required
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Contoh: antrian BPJS, biaya scaling"
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600 bg-zinc-50/50 text-sm font-medium transition"
          />
        </div>

        {/* Komentar */}
        <div>
          <label
            htmlFor="comments-input"
            className="block text-xs font-bold text-zinc-700 mb-2"
          >
            Komentar / Opini
          </label>

          <textarea
            id="comments-input"
            required
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            rows={6}
            placeholder={`Masukkan satu komentar yang ingin dianalisis.

Contoh:
Pelayanan di klinik ini lama sekali, saya sudah menunggu hampir 2 jam.`}
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600 bg-zinc-50/50 text-sm font-medium transition resize-none"
          />

          <p className="mt-1.5 text-[11px] text-zinc-400">
            Satu komentar akan dianalisis menggunakan
            IndoBERTweet.
          </p>
        </div>

        {/* Tombol */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={
              isAnalyzing ||
              !topic.trim() ||
              !comments.trim()
            }
            className="px-6 py-3 rounded-xl text-xs font-bold transition shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed bg-teal-600 hover:bg-teal-700 text-white shrink-0"
          >
            {isAnalyzing ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Menganalisis...</span>
              </>
            ) : (
              <span>Analyze</span>
            )}
          </button>
        </div>

        {/* Contoh topic */}
        <div className="flex flex-wrap items-center gap-2 justify-center pt-1">
          <span className="text-[11px] text-zinc-400 font-semibold">
            Contoh:
          </span>

          {TOPIC_SUGGESTIONS.map((suggestion) => {
            const active =
              topic.toLowerCase() ===
              suggestion.text.toLowerCase();

            return (
              <button
                type="button"
                key={suggestion.text}
                onClick={() =>
                  onSelectTopic(suggestion.text)
                }
                className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer ${
                  active
                    ? "bg-teal-600 text-white"
                    : "text-teal-700 hover:bg-teal-50"
                }`}
              >
                {suggestion.text}
              </button>
            );
          })}
        </div>
      </form>
    </section>
  );
}