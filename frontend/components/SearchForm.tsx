import { ANGLE_OPTIONS, TOPIC_SUGGESTIONS } from "@/lib/mockData";

interface SearchFormProps {
  selectedAngle: string;
  setSelectedAngle: (angle: string) => void;
  keyword: string;
  setKeyword: (value: string) => void;
  isLoading: boolean;
  onGenerate: (e: React.FormEvent) => void;
  onSelectTopic: (topic: string) => void;
}

export default function SearchForm({
  selectedAngle,
  setSelectedAngle,
  keyword,
  setKeyword,
  isLoading,
  onGenerate,
  onSelectTopic,
}: SearchFormProps) {
  return (
    <section id="generator-section" className="space-y-10 border-t border-zinc-200/80 pt-16 scroll-mt-20">
      <div className="space-y-2">
        <span className="text-[11px] font-bold tracking-widest text-teal-600 uppercase block">— Generator</span>
        <h2 className="font-serif text-2xl md:text-[2rem] tracking-tight text-zinc-900 font-extrabold">
          Buat ide konten dalam 2 langkah
        </h2>
        <p className="text-sm leading-relaxed text-zinc-500 max-w-lg font-medium">
          Pilih angle konten berdasarkan strategi yang diinginkan, lalu masukkan topik target untuk mendapatkan draf
          tulisan dan ide visual instan.
        </p>
      </div>

      <form onSubmit={onGenerate} className="space-y-8">
        {/* Step 1: Angle */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center shadow-sm shadow-teal-600/30">
              1
            </span>
            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wide">Pilih Angle Konten</h3>
          </div>
          <p className="text-xs text-zinc-400 font-medium">
            Pilih salah satu metode strategi konten yang paling relevan untuk rencana Anda.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ANGLE_OPTIONS.map((angle) => {
              const isSelected = selectedAngle === angle.id;
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
                  {isSelected && (
                    <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px] font-bold shadow-sm shadow-teal-600/30">
                      ✓
                    </div>
                  )}

                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center border text-sm font-bold ${angle.iconColor}`}>
                    {angle.icon}
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-zinc-900">{angle.title}</h4>
                    <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed font-medium">{angle.desc}</p>
                  </div>

                  <div className="pt-2 border-t border-zinc-100 flex flex-col gap-1">
                    <span className={`inline-block px-2 py-0.5 border rounded-md text-[9px] font-bold self-start ${angle.badgeStyle}`}>
                      {angle.badge}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-bold mt-1 block">{angle.comments}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Topic */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center shadow-sm shadow-teal-600/30">
              2
            </span>
            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wide">Pilih / Masukkan Topik</h3>
          </div>
          <p className="text-xs text-zinc-400 font-medium">
            Klik topik tren terpopuler di bawah ini, atau ketik topik kustom Anda secara manual.
          </p>

          {/* Suggestion pills */}
          <div className="flex flex-wrap gap-2 pt-2">
            {TOPIC_SUGGESTIONS.map((topic) => {
              const active = keyword.toLowerCase() === topic.text.toLowerCase();
              return (
                <button
                  type="button"
                  key={topic.text}
                  onClick={() => onSelectTopic(topic.text)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 border rounded-xl text-xs font-semibold transition cursor-pointer hover:-translate-y-0.5 ${
                    active
                      ? "bg-teal-600 text-white border-teal-600 shadow-sm"
                      : "bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300"
                  }`}
                >
                  <span>{topic.text}</span>
                  <span className={`px-1.5 py-0.5 border rounded text-[9px] font-bold ${active ? "bg-white/20 text-white border-transparent" : topic.badgeBg}`}>
                    {topic.badge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Custom input */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-4">
            <div className="md:col-span-8">
              <label htmlFor="keyword-input" className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                Ketik Topik Kustom / Kata Kunci
              </label>
              <input
                id="keyword-input"
                type="text"
                required
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Contoh: antrian menumpuk, biaya scaling bpjs"
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600 bg-zinc-50/50 text-sm font-medium transition"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-center pt-6">
          <button
            type="submit"
            disabled={isLoading || !keyword.trim()}
            className="px-8 py-3.5 rounded-full text-xs font-bold transition shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed bg-zinc-900 hover:bg-zinc-800 text-white"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>Menganalisis Tren...</span>
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
