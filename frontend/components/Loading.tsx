interface LoadingProps {
  loadingStep: number;
}

const STEPS = [
  { step: 0, text: "Menganalisis sentimen topik" },
  { step: 1, text: "Menyusun angle dan strategi" },
  { step: 2, text: "Membuat draft copy & hook postingan" },
];

export default function Loading({ loadingStep }: LoadingProps) {
  return (
    <div className="p-8 rounded-2xl border border-zinc-200 bg-white shadow-lg flex flex-col items-center justify-center text-center space-y-6 min-h-[300px]">
      <div className="relative w-12 h-12 flex items-center justify-center">
        <span className="absolute inset-0 rounded-full border-4 border-zinc-100" />
        <span className="absolute inset-0 rounded-full border-4 border-teal-600 border-t-transparent animate-spin" />
        <span className="text-xl">🧠</span>
      </div>

      <div className="space-y-1">
        <h3 className="text-sm font-bold text-zinc-900">Menyusun Rekomendasi Konten</h3>
        <p className="text-[11px] text-zinc-400 font-medium">Harap tunggu, model AI sedang menganalisis data tren...</p>
      </div>

      <div className="w-full max-w-xs pt-4 border-t border-zinc-100 flex flex-col gap-3 text-left">
        {STEPS.map((s) => (
          <div key={s.step} className="flex items-center gap-3">
            <span
              className={`w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center ${
                loadingStep > s.step
                  ? "bg-teal-600 text-white"
                  : loadingStep === s.step
                  ? "bg-teal-500 text-white animate-pulse"
                  : "bg-zinc-100 text-zinc-400"
              }`}
            >
              {loadingStep > s.step ? "✓" : s.step + 1}
            </span>
            <span
              className={`text-[11px] ${
                loadingStep === s.step ? "text-teal-600 font-bold" : loadingStep > s.step ? "text-zinc-600" : "text-zinc-400"
              }`}
            >
              {s.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
