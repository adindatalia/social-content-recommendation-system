import type { HistoryItem } from "@/lib/types";

interface HistorySectionProps {
  history: HistoryItem[];
  onLoad: (item: HistoryItem) => void;
}

export default function HistorySection({ history, onLoad }: HistorySectionProps) {
  return (
    <section id="history-section" className="space-y-8 border-t border-zinc-200/80 pt-16">
      <div className="space-y-2">
        <span className="text-[11px] font-bold tracking-widest text-teal-600 uppercase block">— Riwayat Pembuatan</span>
        <h2 className="font-serif text-2xl md:text-[2rem] tracking-tight text-zinc-900 font-extrabold">
          Riwayat Pembuatan Ide
        </h2>
        <p className="text-sm leading-relaxed text-zinc-500 max-w-lg font-medium">
          Daftar pencarian kata kunci yang pernah dibuat sebelumnya.
        </p>
      </div>

      {history.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-dashed border-zinc-200 text-center">
          <p className="text-zinc-500 font-medium text-sm">Belum ada riwayat pencarian.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 text-zinc-400 text-[10px] font-bold uppercase tracking-wider border-b border-zinc-200">
                  <th className="py-4 px-6">Topik Utama</th>
                  <th className="py-4 px-6">Kategori / Angle</th>
                  <th className="py-4 px-6">Rentang Tren</th>
                  <th className="py-4 px-6">Tanggal Dibuat</th>
                  <th className="py-4 px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-xs">
                {history.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-50/50 transition">
                    <td className="py-4 px-6 font-bold text-zinc-800">{item.keyword}</td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 border border-teal-100 text-teal-700">
                        {item.angle}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-zinc-500 font-semibold">{item.periode} Hari</td>
                    <td className="py-4 px-6 text-zinc-400 font-medium">{item.timestamp}</td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => onLoad(item)}
                        className="text-[10px] px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold transition shadow-sm cursor-pointer"
                      >
                        Muat Ulang
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
