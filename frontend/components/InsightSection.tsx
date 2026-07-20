import { PAIN_POINTS, SENTIMENT_LEGEND } from "@/lib/mockData";

export default function InsightSection() {
  return (
    <section id="insight-section" className="space-y-10 border-t border-zinc-200/80 pt-16">
      <div className="space-y-2">
        <span className="text-[11px] font-bold tracking-widest text-teal-600 uppercase block">— Insight Publik</span>
        <h2 className="font-serif text-2xl md:text-[2rem] tracking-tight text-zinc-900 font-extrabold">
          Apa yang dibicarakan publik?
        </h2>
        <p className="text-sm leading-relaxed text-zinc-500 max-w-lg font-medium">
          Analisis sentimen dari 424 komentar publik di berbagai topik kesehatan dalam 14 hari terakhir.
        </p>
      </div>

      {/* Donut + Pain Points */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sentiment Donut */}
        <div className="p-6 border border-zinc-200/80 rounded-2xl bg-white shadow-sm flex flex-col justify-between min-h-[300px]">
          <div>
            <h3 className="text-sm font-bold text-zinc-900">Distribusi Sentimen</h3>
            <p className="text-[11px] text-zinc-400 font-medium mt-0.5">Dari 424 komentar publik terbaru</p>
          </div>

          <div className="flex items-center justify-around gap-6 flex-wrap my-6">
            <div className="relative w-32 h-32 shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" stroke="#f4f4f5" strokeWidth="12" fill="transparent" />
                {/* Negatif 48% */}
                <circle
                  cx="50" cy="50" r="38" stroke="#ef4444" strokeWidth="12" fill="transparent"
                  strokeDasharray="238.76" strokeDashoffset="124.15" strokeLinecap="round"
                />
                {/* Positif 32% */}
                <circle
                  cx="50" cy="50" r="38" stroke="#10b981" strokeWidth="12" fill="transparent"
                  strokeDasharray="238.76" strokeDashoffset="162.35" strokeLinecap="round"
                  transform="rotate(172.8 50 50)"
                />
                {/* Netral 20% */}
                <circle
                  cx="50" cy="50" r="38" stroke="#f59e0b" strokeWidth="12" fill="transparent"
                  strokeDasharray="238.76" strokeDashoffset="191.0" strokeLinecap="round"
                  transform="rotate(288 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-extrabold text-zinc-900 leading-none">424</span>
                <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider mt-0.5">Komentar</span>
              </div>
            </div>

            <div className="space-y-3">
              {SENTIMENT_LEGEND.map((s) => (
                <div key={s.label} className="flex items-center gap-2.5">
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${s.color}`} />
                  <span className="text-xs font-bold text-zinc-700 min-w-[50px]">{s.label}</span>
                  <span className="text-xs font-extrabold text-zinc-900">{s.pct}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[11px] text-zinc-400 text-center font-medium">
            Sentimen negatif mendominasi obrolan publik seputar antrean faskes.
          </div>
        </div>

        {/* Top Pain Points */}
        <div className="p-6 border border-zinc-200/80 rounded-2xl bg-white shadow-sm flex flex-col justify-between min-h-[300px]">
          <div>
            <h3 className="text-sm font-bold text-zinc-900">Top Pain Points</h3>
            <p className="text-[11px] text-zinc-400 font-medium mt-0.5">Keluhan paling sering muncul di komentar</p>
          </div>

          <div className="space-y-4 my-4 flex-1 flex flex-col justify-center">
            {PAIN_POINTS.map((p, idx) => (
              <div key={p.text} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-zinc-700">
                    {idx + 1}. {p.text}
                  </span>
                  <span className="text-zinc-400 font-bold">{p.count}</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-zinc-100 overflow-hidden">
                  <div className="h-full rounded-full bg-teal-600" style={{ width: `${p.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sentiment Trend */}
      <div className="p-6 border border-zinc-200/80 rounded-2xl bg-white shadow-sm">
        <div className="flex justify-between items-start mb-6 flex-wrap gap-3">
          <div>
            <h3 className="text-sm font-bold text-zinc-900">Tren Sentimen 14 Hari Terakhir</h3>
            <p className="text-[11px] text-zinc-400 font-medium mt-0.5">
              Perubahan volume sentimen harian dari data komentar publik
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-50 border border-emerald-100 text-emerald-700">
            + Sangat Positif 12%
          </span>
        </div>

        <div className="relative" style={{ height: 180 }}>
          <svg viewBox="0 0 600 160" className="w-full h-full" preserveAspectRatio="none">
            {[0, 40, 80, 120, 160].map((y) => (
              <line key={y} x1="0" y1={y} x2="600" y2={y} stroke="#f3f4f6" strokeWidth="1" />
            ))}
            <path d="M 10,120 L 100,100 L 190,110 L 280,80 L 370,75 L 460,55 L 590,50" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M 10,70 L 100,90 L 190,85 L 280,95 L 370,110 L 460,115 L 590,125" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M 10,140 L 100,135 L 190,142 L 280,130 L 370,125 L 460,138 L 590,132" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 4" />
          </svg>

          <div className="flex justify-between px-2 mt-2">
            {["10 Mei", "14 Mei", "18 Mei", "22 Mei"].map((day) => (
              <span key={day} className="text-[10px] text-zinc-400 font-bold">{day}</span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-6 mt-4">
          {[
            { label: "Positif", color: "bg-emerald-500" },
            { label: "Negatif", color: "bg-red-500" },
            { label: "Netral", color: "bg-amber-500" },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-2">
              <span className={`w-3.5 h-0.5 ${l.color} block`} />
              <span className="text-xs font-bold text-zinc-500">{l.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
