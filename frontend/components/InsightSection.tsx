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

  // Bangun path polyline sederhana dari data trend backend supaya
  // grafik benar-benar merepresentasikan angka yang dikirim server,
  // bukan lagi path statis.
  function buildPath(values: number[]): string {
    if (!values || values.length === 0) return "";
    const max = Math.max(...values, 1);
    const stepX = 580 / (values.length - 1 || 1);
    return values
      .map((v, i) => {
        const x = 10 + i * stepX;
        const y = 150 - (v / max) * 130;
        return `${i === 0 ? "M" : "L"} ${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");
  }

  return (
    <section id="insight-section" className="space-y-10 border-t border-zinc-200/80 pt-16 scroll-mt-20">
      <div className="space-y-2">
        <span className="text-[11px] font-bold tracking-widest text-teal-600 uppercase block">— Insight Publik</span>
        <h2 className="font-serif text-2xl md:text-[2rem] tracking-tight text-zinc-900 font-extrabold">
          Apa yang dibicarakan publik?
        </h2>
        <p className="text-sm leading-relaxed text-zinc-500 max-w-lg font-medium">
          {data
            ? `Analisis sentimen dari ${data.total_comments} komentar publik di berbagai topik kesehatan dalam 14 hari terakhir.`
            : "Memuat analisis sentimen publik dari berbagai topik kesehatan..."}
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
              {data ? `Dari ${data.total_comments} komentar publik terbaru` : "Memuat data..."}
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
            <p className="text-[11px] text-zinc-400 font-medium mt-0.5">Keluhan paling sering muncul di komentar</p>
          </div>

          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <span className="w-8 h-8 rounded-full border-4 border-zinc-100 border-t-teal-600 animate-spin" />
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

      {/* Sentiment Trend */}
      <div className="p-6 border border-zinc-200/80 rounded-2xl bg-white shadow-sm">
        <div className="flex justify-between items-start mb-6 flex-wrap gap-3">
          <div>
            <h3 className="text-sm font-bold text-zinc-900">Tren Sentimen 14 Hari Terakhir</h3>
            <p className="text-[11px] text-zinc-400 font-medium mt-0.5">
              Perubahan volume sentimen harian dari data komentar publik
            </p>
          </div>
        </div>

        <div className="relative" style={{ height: 180 }}>
          <svg viewBox="0 0 600 160" className="w-full h-full" preserveAspectRatio="none">
            {[0, 40, 80, 120, 160].map((y) => (
              <line key={y} x1="0" y1={y} x2="600" y2={y} stroke="#f3f4f6" strokeWidth="1" />
            ))}
            {data && (
              <>
                <path d={buildPath(data.trend.positive)} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d={buildPath(data.trend.negative)} fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d={buildPath(data.trend.neutral)} fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 4" />
              </>
            )}
          </svg>

          <div className="flex justify-between px-2 mt-2">
            {(data?.trend.labels ?? []).map((day) => (
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
