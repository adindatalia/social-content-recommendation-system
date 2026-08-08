import { TOPIC_SUGGESTIONS } from "@/lib/mockData";

interface SearchFormProps {
  keyword: string;
  setKeyword: (value: string) => void;

  comments: string;
  setComments: (value: string) => void;

  isAnalyzing: boolean;
  onAnalyze: (e: React.FormEvent) => void;
  onSelectTopic: (topic: string) => void;
}

export default function SearchForm({
  keyword,
  setKeyword,
  comments,
  setComments,
  isAnalyzing,
  onAnalyze,
  onSelectTopic,
}: SearchFormProps) {
  return (
    <section id="generator-section">
      <form onSubmit={onAnalyze} className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-zinc-900">
            Analisis Tren Topik Kesehatan
          </h2>
        </div>

        {/* Keyword */}
        <div>
          <label
            htmlFor="keyword-input"
            className="block text-xs font-bold text-zinc-700 mb-2"
          >
            Keyword
          </label>

          <input
            id="keyword-input"
            type="text"
            required
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
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
            placeholder={`Masukkan komentar yang ingin dianalisis.
Satu komentar per baris.

Contoh:
Antrian di klinik ini lama sekali.
Pelayanannya sangat ramah dan cepat.
Saya bingung dengan prosedur BPJS.`}
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600 bg-zinc-50/50 text-sm font-medium transition resize-none"
          />

          <p className="mt-1.5 text-[11px] text-zinc-400">
            Satu baris dianggap sebagai satu komentar dan akan
            dianalisis oleh IndoBERTweet.
          </p>
        </div>

        {/* Tombol */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={
              isAnalyzing ||
              !keyword.trim() ||
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

        {/* Contoh keyword */}
        <div className="flex flex-wrap items-center gap-2 justify-center pt-1">
          <span className="text-[11px] text-zinc-400 font-semibold">
            Contoh:
          </span>

          {TOPIC_SUGGESTIONS.map((topic) => {
            const active =
              keyword.toLowerCase() ===
              topic.text.toLowerCase();

            return (
              <button
                type="button"
                key={topic.text}
                onClick={() =>
                  onSelectTopic(topic.text)
                }
                className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer ${
                  active
                    ? "bg-teal-600 text-white"
                    : "text-teal-700 hover:bg-teal-50"
                }`}
              >
                {topic.text}
              </button>
            );
          })}
        </div>
      </form>
    </section>
  );
}