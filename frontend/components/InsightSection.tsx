const TOPIC_HIGHLIGHTS = [
  "Antrian & Waktu Tunggu",
  "Pelayanan Tenaga Medis",
  "Biaya Layanan",
  "BPJS & Administrasi",
  "Kenyamanan Fasilitas",
];

export default function InsightSection() {
  const totalDataset = 4289;

  const sentimentDistribution = {
    Negatif: 6.79,
    Netral: 82.37,
    Positif: 10.84,
  };

  const radius = 38;
  const circumference = 2 * Math.PI * radius;

  const negativeLength =
    (sentimentDistribution.Negatif / 100) *
    circumference;

  const neutralLength =
    (sentimentDistribution.Netral / 100) *
    circumference;

  const positiveLength =
    (sentimentDistribution.Positif / 100) *
    circumference;

  return (
    <section
      id="insight-section"
      className="space-y-6 border-t border-zinc-200/80 pt-8"
    >
      {/* Header */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-bold tracking-widest text-teal-600 uppercase block">
          — Insight Percakapan
        </span>

        <h2 className="font-serif text-xl md:text-2xl tracking-tight text-zinc-900 font-extrabold">
          Apa yang dibicarakan pengguna?
        </h2>

        <p className="text-xs leading-relaxed text-zinc-500 max-w-xl font-medium">
          Gambaran data dan beberapa topik percakapan
          layanan kesehatan yang dapat menjadi inspirasi
          dalam menentukan ide konten.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        {/* Distribusi Dataset */}
        <div className="p-5 border border-zinc-200/80 rounded-2xl bg-white shadow-sm">
          <div>
            <h3 className="text-sm font-bold text-zinc-900">
              Distribusi Dataset
            </h3>

            <p className="text-[10px] text-zinc-400 font-medium mt-1">
              Data layanan kesehatan yang digunakan dalam
              penelitian
            </p>
          </div>

          <div className="flex items-center justify-center gap-8 py-6">
            {/* Donut */}
            <div className="relative w-28 h-28 shrink-0">
              <svg
                className="w-full h-full -rotate-90"
                viewBox="0 0 100 100"
              >
                {/* Background */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  stroke="#f4f4f5"
                  strokeWidth="12"
                  fill="transparent"
                />

                {/* Negatif */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  stroke="#ef4444"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={`${negativeLength} ${circumference}`}
                  strokeDashoffset="0"
                />

                {/* Positif */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  stroke="#10b981"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={`${positiveLength} ${circumference}`}
                  strokeDashoffset={`${-negativeLength}`}
                />

                {/* Netral */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  stroke="#f59e0b"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={`${neutralLength} ${circumference}`}
                  strokeDashoffset={`${
                    -(negativeLength + positiveLength)
                  }`}
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-extrabold text-zinc-900 leading-none">
                  {totalDataset.toLocaleString("id-ID")}
                </span>

                <span className="text-[8px] font-bold uppercase tracking-wider text-zinc-400 mt-1">
                  Dataset
                </span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500" />

                <span className="text-[11px] font-bold text-zinc-700">
                  Negatif
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />

                <span className="text-[11px] font-bold text-zinc-700">
                  Netral
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />

                <span className="text-[11px] font-bold text-zinc-700">
                  Positif
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sorotan Topik */}
        <div className="p-5 border border-zinc-200/80 rounded-2xl bg-white shadow-sm">
          <div>
            <h3 className="text-sm font-bold text-zinc-900">
              Sorotan Topik Percakapan
            </h3>

            <p className="text-[10px] text-zinc-400 font-medium mt-1">
              Beberapa isu layanan kesehatan yang dapat
              dikembangkan menjadi arah konten
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-5">
            {TOPIC_HIGHLIGHTS.map(
              (topic, index) => (
                <div
                  key={topic}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-zinc-50 border border-zinc-100"
                >
                  <span className="w-6 h-6 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center text-[9px] font-extrabold shrink-0">
                    {String(index + 1).padStart(
                      2,
                      "0"
                    )}
                  </span>

                  <span className="text-[10px] font-bold text-zinc-700 leading-snug">
                    {topic}
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      <p className="text-[9px] text-zinc-400 leading-relaxed">
        * Ringkasan ini digunakan sebagai gambaran eksplorasi
        topik. Analisis sistem tetap dilakukan terhadap satu
        komentar yang dimasukkan pengguna.
      </p>
    </section>
  );
}