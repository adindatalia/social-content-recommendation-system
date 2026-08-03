import { TOPIC_SUGGESTIONS } from "@/lib/mockData";

interface SearchFormProps {
  keyword: string;
  setKeyword: (value: string) => void;
  isAnalyzing: boolean;
  onAnalyze: (e: React.FormEvent) => void;
  onSelectTopic: (topic: string) => void;
}

export default function SearchForm({
  keyword,
  setKeyword,
  isAnalyzing,
  onAnalyze,
  onSelectTopic,
}: SearchFormProps) {
  return (
    <section id="generator-section" className="space-y-6 scroll-mt-20">
      <form
        onSubmit={onAnalyze}
        className="p-6 md:p-8 rounded-2xl border border-zinc-200/80 bg-white shadow-sm space-y-4"
      >
        <div className="space-y-1">
          <h2 className="text-sm font-bold text-teal-700 uppercase tracking-wide text-center">
            Analisis Tren Topik Kesehatan
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            id="keyword-input"
            type="text"
            required
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Masukkan kata kunci... contoh: antrian menumpuk, biaya scaling bpjs"
            className="flex-1 px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600 bg-zinc-50/50 text-sm font-medium transition"
          />
          <button
            type="submit"
            disabled={isAnalyzing || !keyword.trim()}
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

        <div className="flex flex-wrap items-center gap-2 justify-center pt-1">
          <span className="text-[11px] text-zinc-400 font-semibold">Contoh:</span>
          {TOPIC_SUGGESTIONS.map((topic) => {
            const active = keyword.toLowerCase() === topic.text.toLowerCase();
            return (
              <button
                type="button"
                key={topic.text}
                onClick={() => onSelectTopic(topic.text)}
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
