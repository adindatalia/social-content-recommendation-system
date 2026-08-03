"use client";

import { useEffect, useState } from "react";
import { fetchInsights } from "@/services/api";
import type { InsightsData } from "@/lib/types";

const SENTIMENT_COLORS: Record<string, string> = {
  Negatif: "#ef4444",
  Netral: "#f59e0b",
  Positif: "#10b981",
};

export default function InsightSection() {
  const [data, setData] = useState<InsightsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setIsLoading(true);
        const result = await fetchInsights();
        if (active) setData(result);
      } catch {
        if (active) setError("Gagal memuat insight publik dari server.");
      } finally {
        if (active) setIsLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  const radius = 38;
  const circumference = 2 * Math.PI * radius;

  const negative = data?.distribution?.Negatif ?? 0;
  const neutral = data?.distribution?.Netral ?? 0;
  const positive = data?.distribution?.Positif ?? 0;

  const negativeLength = (negative / 100) * circumference;
  const neutralLength = (neutral / 100) * circumference;
  const positiveLength = (positive / 100) * circumference;

  const legend = [
    { label: "Negatif", pct: negative, color: "bg-red-500" },
    { label: "Positif", pct: positive, color: "bg-emerald-500" },
    { label: "Netral", pct: neutral, color: "bg-amber-500" },
  ];

  return (
    <section id="insight-section" className="space-y-10 border-t border-zinc-200/80 pt-16 scroll-mt-20">
      <div className="space-y-2">
        <span className="text-[11px] font-bold tracking-widest text-teal-600 uppercase block">— Insight Publik</span>
        <h2 className="font-serif text-2xl md:text-[2rem] tracking-tight text-zinc-900 font-extrabold">
          Apa yang dibicarakan publik?
        </h2>
        <p className="text-sm leading-relaxed text-zinc-500 max-w-lg font-medium">
          {data
            ? `Analisis sentimen dari ${data.total_comments} komentar publik di seluruh dataset yang tersedia.`
            : "Memuat analisis sentimen publik dari dataset..."}
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-red-100 bg-red-50 text-xs font-semibold text-red-700">
          {error}
        </div>
      )}

      {/* Donut + Pain Points */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sentiment Donut */}
        <div className="p-6 border border-zinc-200/80 rounded-2xl bg-white shadow-sm flex flex-col justify-between min-h-[300px]">
          <div>
            <h3 className="text-sm font-bold text-zinc-900">Distribusi Sentimen</h3>
            <p className="text-[11px] text-zinc-400 font-medium mt-0.5">
              {data ? `Dari ${data.total_comments} komentar publik` : "Memuat data..."}
            </p>
          </div>

          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <span className="w-8 h-8 rounded-full border-4 border-zinc-100 border-t-teal-600 animate-spin" />
            </div>
          ) : (
            <div className="flex items-center justify-around gap-6 flex-wrap my-6">
              <div className="relative w-32 h-32 shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r={radius} stroke="#f4f4f5" strokeWidth="12" fill="transparent" />
                  <circle
                    cx="50" cy="50" r={radius} stroke={SENTIMENT_COLORS.Negatif} strokeWidth="12" fill="transparent"
                    strokeDasharray={`${negativeLength} ${circumference}`} strokeDashoffset="0" strokeLinecap="round"
                  />
                  <circle
                    cx="50" cy="50" r={radius} stroke={SENTIMENT_COLORS.Positif} strokeWidth="12" fill="transparent"
                    strokeDasharray={`${positiveLength} ${circumference}`}
                    strokeDashoffset={`${-negativeLength}`} strokeLinecap="round"
                  />
                  <circle
                    cx="50" cy="50" r={radius} stroke={SENTIMENT_COLORS.Netral} strokeWidth="12" fill="transparent"
                    strokeDasharray={`${neutralLength} ${circumference}`}
                    strokeDashoffset={`${-(negativeLength + positiveLength)}`} strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-extrabold text-zinc-900 leading-none">{data?.total_comments ?? 0}</span>
                  <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider mt-0.5">Komentar</span>
                </div>
              </div>

              <div className="space-y-3">
                {legend.map((s) => (
                  <div key={s.label} className="flex items-center gap-2.5">
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${s.color}`} />
                    <span className="text-xs font-bold text-zinc-700 min-w-[50px]">{s.label}</span>
                    <span className="text-xs font-extrabold text-zinc-900">{s.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-[11px] text-zinc-400 text-center font-medium">
            {negative >= positive && negative >= neutral
              ? "Sentimen negatif mendominasi obrolan publik seputar layanan kesehatan."
              : positive >= neutral
              ? "Sentimen positif mendominasi obrolan publik seputar layanan kesehatan."
              : "Sentimen netral mendominasi obrolan publik seputar layanan kesehatan."}
          </div>
        </div>

        {/* Top Pain Points */}
        <div className="p-6 border border-zinc-200/80 rounded-2xl bg-white shadow-sm flex flex-col justify-between min-h-[300px]">
          <div>
            <h3 className="text-sm font-bold text-zinc-900">Top Pain Points</h3>
            <p className="text-[11px] text-zinc-400 font-medium mt-0.5">Frasa keluhan paling sering muncul di dataset</p>
          </div>

          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <span className="w-8 h-8 rounded-full border-4 border-zinc-100 border-t-teal-600 animate-spin" />
            </div>
          ) : (data?.pain_points ?? []).length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-xs text-zinc-400 font-medium text-center">Belum ada frasa keluhan yang menonjol.</p>
            </div>
          ) : (
            <div className="space-y-4 my-4 flex-1 flex flex-col justify-center">
              {(data?.pain_points ?? []).map((p, idx) => (
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
          )}
        </div>
      </div>
    </section>
  );
}
