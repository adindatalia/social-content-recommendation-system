"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import {
  fetchHistory,
  deleteHistoryItem,
  type HistoryRecord,
} from "@/services/api";
import { angleBadgeStyle } from "@/lib/mockData";

export default function HistoryPage() {
  const router = useRouter();

  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [deletingId, setDeletingId] = useState<
    string | number | null
  >(null);

  // ============================================================
  // LOAD HISTORY
  // ============================================================

  const load = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchHistory();
      setRecords(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Tidak bisa terhubung ke server. Pastikan backend berjalan di port 5000."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // ============================================================
  // SEARCH
  // ============================================================

  const filtered = useMemo(() => {
    if (!query.trim()) return records;

    const q = query.toLowerCase();

    return records.filter(
      (r) =>
        r.keyword?.toLowerCase().includes(q) ||
        r.angle?.toLowerCase().includes(q) ||
        r.sentiment?.toLowerCase().includes(q)
    );
  }, [records, query]);

  // ============================================================
  // STATISTICS
  // ============================================================

  const totalReports = records.length;

  const topAngle = useMemo(() => {
    if (records.length === 0) return "-";

    const counts: Record<string, number> = {};

    for (const r of records) {
      const key = r.angle || "Lainnya";

      counts[key] = (counts[key] || 0) + 1;
    }

    return Object.entries(counts).sort(
      (a, b) => b[1] - a[1]
    )[0][0];
  }, [records]);

  const uniqueKeywords = useMemo(() => {
    return new Set(
      records
        .map((r) =>
          r.keyword?.toLowerCase().trim()
        )
        .filter(Boolean)
    ).size;
  }, [records]);

  // ============================================================
  // VIEW RESULT
  // ============================================================

  const handleViewResult = (
    item: HistoryRecord
  ) => {
    router.push(`/?history=${item.id}`);
  };

  // ============================================================
  // DELETE
  // ============================================================

  const handleDelete = async (
    id: number | string
  ) => {
    setDeletingId(id);

    try {
      await deleteHistoryItem(id);

      setRecords((prev) =>
        prev.filter((r) => r.id !== id)
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal menghapus riwayat"
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-10">
        {/* ======================================================
            HEADER
        ====================================================== */}

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <span className="text-[11px] font-bold tracking-widest text-teal-600 uppercase block">
              — History
            </span>

            <h1 className="font-serif text-3xl md:text-[2.1rem] tracking-tight text-zinc-900 font-extrabold">
              Riwayat Analisis
            </h1>

            <p className="text-sm leading-relaxed text-zinc-500 max-w-lg font-medium">
              Tinjau kembali seluruh riwayat analisis
              sentimen dan ide konten yang pernah dibuat
              sistem.
            </p>
          </div>

          {/* Search */}

          <div className="relative">
            <svg
              className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
              />
            </svg>

            <input
              type="text"
              value={query}
              onChange={(e) =>
                setQuery(e.target.value)
              }
              placeholder="Cari kata kunci..."
              className="pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600 bg-zinc-50/50 text-sm font-medium transition w-64"
            />
          </div>
        </div>

        {/* ======================================================
            STAT CARDS
        ====================================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl border border-zinc-200/80 bg-white shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              Total Riwayat
            </span>

            <p className="text-3xl font-extrabold text-zinc-900 mt-1">
              {totalReports}
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-zinc-200/80 bg-white shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              Kata Kunci Unik
            </span>

            <p className="text-3xl font-extrabold text-zinc-900 mt-1">
              {uniqueKeywords}
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-zinc-200/80 bg-white shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              Angle Terpopuler
            </span>

            <p className="text-lg font-extrabold text-teal-700 mt-2 leading-tight">
              {topAngle}
            </p>
          </div>
        </div>

        {/* ======================================================
            TABLE
        ====================================================== */}

        {isLoading ? (
          <div className="p-16 rounded-2xl border border-zinc-200 bg-white shadow-sm flex flex-col items-center justify-center gap-3">
            <span className="w-8 h-8 border-4 border-zinc-100 border-t-teal-600 rounded-full animate-spin" />

            <p className="text-xs font-bold text-zinc-400">
              Memuat riwayat dari server...
            </p>
          </div>
        ) : error ? (
          <div className="p-10 rounded-2xl border border-dashed border-red-200 bg-red-50/40 text-center space-y-3">
            <p className="text-sm font-bold text-red-600">
              {error}
            </p>

            <button
              onClick={load}
              className="text-xs font-bold px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white transition cursor-pointer"
            >
              Coba Lagi
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-dashed border-zinc-200 text-center">
            <p className="text-zinc-500 font-medium text-sm">
              {records.length === 0
                ? "Belum ada riwayat analisis."
                : "Tidak ada hasil yang cocok dengan pencarian."}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                {/* ==================================================
                    TABLE HEADER
                ================================================== */}

                <thead>
                  <tr className="bg-zinc-50 text-zinc-400 text-[10px] font-bold uppercase tracking-wider border-b border-zinc-200">
                    <th className="py-4 px-6">
                      Kata Kunci
                    </th>

                    <th className="py-4 px-6">
                      Sentimen
                    </th>

                    <th className="py-4 px-6">
                      Confidence
                    </th>

                    <th className="py-4 px-6">
                      Angle
                    </th>

                    <th className="py-4 px-6">
                      Periode
                    </th>

                    <th className="py-4 px-6">
                      Tanggal Dibuat
                    </th>

                    <th className="py-4 px-6 text-right">
                      Aksi
                    </th>
                  </tr>
                </thead>

                {/* ==================================================
                    TABLE BODY
                ================================================== */}

                <tbody className="divide-y divide-zinc-100 text-xs">
                  {filtered.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-zinc-50/50 transition"
                    >
                      {/* Keyword */}

                      <td className="py-4 px-6 font-bold text-zinc-800">
                        {item.keyword}
                      </td>

                      {/* Sentiment */}

                      <td className="py-4 px-6">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            item.sentiment ===
                            "Positif"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : item.sentiment ===
                                "Negatif"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : "bg-zinc-50 text-zinc-600 border-zinc-200"
                          }`}
                        >
                          {item.sentiment || "—"}
                        </span>
                      </td>

                      {/* Confidence */}

                      <td className="py-4 px-6">
                        {typeof item.confidence ===
                        "number" ? (
                          <div className="flex flex-col gap-1 min-w-[80px]">
                            <span className="text-xs font-bold text-zinc-700">
                              {(
                                item.confidence *
                                100
                              ).toFixed(2)}
                              %
                            </span>

                            <div className="w-full h-1.5 rounded-full bg-zinc-100 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-teal-600"
                                style={{
                                  width: `${Math.min(
                                    Math.max(
                                      item.confidence *
                                        100,
                                      0
                                    ),
                                    100
                                  )}%`,
                                }}
                              />
                            </div>
                          </div>
                        ) : (
                          <span className="text-zinc-400">
                            —
                          </span>
                        )}
                      </td>

                      {/* Angle */}

                      <td className="py-4 px-6">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${angleBadgeStyle(
                            item.angle
                          )}`}
                        >
                          {item.angle || "—"}
                        </span>
                      </td>

                      {/* Periode */}

                      <td className="py-4 px-6 text-zinc-500 font-semibold">
                        {item.periode || "-"} Hari
                      </td>

                      {/* Timestamp */}

                      <td className="py-4 px-6 text-zinc-400 font-medium">
                        {item.timestamp}
                      </td>

                      {/* Actions */}

                      <td className="py-4 px-6">
                        <div className="flex justify-end items-center gap-2">
                          <button
                            onClick={() =>
                              handleViewResult(item)
                            }
                            className="text-[10px] px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold transition shadow-sm cursor-pointer whitespace-nowrap"
                          >
                            Lihat Hasil
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(item.id)
                            }
                            disabled={
                              deletingId === item.id
                            }
                            aria-label="Hapus riwayat"
                            className="w-8 h-8 shrink-0 rounded-xl border border-zinc-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600 text-zinc-400 flex items-center justify-center transition disabled:opacity-40 cursor-pointer"
                          >
                            {deletingId ===
                            item.id ? (
                              <span className="w-3 h-3 border-2 border-zinc-300 border-t-red-500 rounded-full animate-spin" />
                            ) : (
                              <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3M4 7h16"
                                />
                              </svg>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================
          FOOTER
      ======================================================== */}

      <footer className="bg-zinc-50 py-12 border-t border-zinc-200 text-center text-xs text-zinc-400">
        <div className="max-w-5xl mx-auto space-y-2">
          <p className="font-bold text-zinc-700 text-sm">
            🚀 SehatFlow Content Platform
          </p>

          <p className="font-medium">
            © 2026 SehatFlow Content. Hak Cipta Dilindungi
            Undang-Undang.
          </p>
        </div>
      </footer>
    </div>
  );
}