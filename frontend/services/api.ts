/**
 * services/api.ts
 * ---------------------------------------------------------------
 * Helper terpusat untuk komunikasi ke backend Flask.
 * Base URL sengaja disamakan dengan yang sudah dipakai di
 * hooks/useContentGenerator.ts (http://127.0.0.1:5000) supaya
 * konsisten satu sumber saat backend di-deploy ke domain lain.
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:5000";

export interface HistoryRecord {
  id: number | string;
  keyword: string;
  angle: string;
  periode: string;
  timestamp: string;
}

/**
 * Ambil seluruh riwayat analisis dari backend (GET /api/history).
 * Dipakai oleh halaman /history.
 */
export async function fetchHistory(): Promise<HistoryRecord[]> {
  const res = await fetch(`${API_BASE_URL}/api/history`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Gagal mengambil riwayat dari server");
  }

  return res.json();
}

/**
 * Hapus satu item riwayat (DELETE /api/history/:id).
 */
export async function deleteHistoryItem(id: number | string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/history/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Gagal menghapus riwayat");
  }
}
