export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://127.0.0.1:5000";

// ============================================================
// TYPES
// ============================================================

export interface HistoryIdea {
  id: number | string;
  title: string;
  format: string;
  category: string;
  hook: string;
  body: string;
  cta: string;
  hashtags: string[];
  justification: string;
  is_saved?: boolean;
}

export interface HistoryRecord {
  id: number | string;

  // ==========================================================
  // INPUT
  // ==========================================================

  keyword: string;
  topic?: string;
  comment?: string;

  // ==========================================================
  // HASIL INDOBERTWEET
  // ==========================================================

  sentiment?: string;

  confidence?: number | null;

  probabilities?: {
    Negatif?: number;
    Netral?: number;
    Positif?: number;
  } | null;

  // ==========================================================
  // STRATEGY
  // ==========================================================

  angle: string;
  periode: string;

  recommended_strategy?: {
    key?: string;
    label?: string;
    reasoning?: string[];
    description?: string;
    is_recommended?: boolean;
    recommended_key?: string;
    target_sentiment?: string;
    recommended_label?: string;
  } | null;

  // ==========================================================
  // METADATA
  // ==========================================================

  timestamp: string;
  created_at?: string;

  // ==========================================================
  // GENERATED IDEAS
  // ==========================================================

  ideas?: HistoryIdea[];
}

// ============================================================
// INSIGHTS
// ============================================================

export async function fetchInsights(
  keyword?: string
): Promise<any> {
  const url = keyword
    ? `${API_BASE_URL}/api/insights?keyword=${encodeURIComponent(
        keyword
      )}`
    : `${API_BASE_URL}/api/insights`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));

    throw new Error(
      err.error || "Gagal mengambil insight dari server"
    );
  }

  return res.json();
}

// ============================================================
// GET ALL HISTORY
// ============================================================

export async function fetchHistory(): Promise<HistoryRecord[]> {
  const res = await fetch(
    `${API_BASE_URL}/api/history`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));

    throw new Error(
      err.error || "Gagal mengambil riwayat dari server"
    );
  }

  return res.json();
}

// ============================================================
// GET HISTORY DETAIL
// ============================================================

export async function fetchHistoryDetail(
  id: number | string
): Promise<HistoryRecord> {
  const res = await fetch(
    `${API_BASE_URL}/api/history/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));

    throw new Error(
      err.error || "Gagal mengambil detail riwayat"
    );
  }

  return res.json();
}

// ============================================================
// DELETE HISTORY
// ============================================================

export async function deleteHistoryItem(
  id: number | string
): Promise<void> {
  const res = await fetch(
    `${API_BASE_URL}/api/history/${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));

    throw new Error(
      err.error || "Gagal menghapus riwayat"
    );
  }
}