
import type { InsightsData } from "@/lib/types";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:5000";

export interface HistoryRecord {
  id: number | string;
  keyword: string;
  angle: string;
  periode: string;
  timestamp: string;
}


export async function fetchInsights(keyword?: string): Promise<InsightsData> {
  const url = keyword
    ? `${API_BASE_URL}/api/insights?keyword=${encodeURIComponent(keyword)}`
    : `${API_BASE_URL}/api/insights`;

  const res = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Gagal mengambil insight dari server");
  }

  return res.json();
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

export async function fetchHistoryDetail(
  id: number | string
) {
  const res = await fetch(`${API_BASE_URL}/api/history/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      err.error || "Gagal mengambil detail riwayat"
    );
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
