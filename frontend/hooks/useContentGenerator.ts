"use client";

import {useEffect, useState} from "react";
import type {AnalysisResult, GenerationResult, HistoryItem, Notification } from "@/lib/types";
import { INITIAL_HISTORY } from "@/lib/mockData";

/**
 * useContentGenerator
 * ---------------------------------------------------------------
 * Seluruh state & logika generator ada di sini, jadi komponen
 * section (Hero, Insight, SearchForm, dst.) tinggal menerima
 * props dan menampilkan UI (presentational).
 */
export function useContentGenerator() {
  const [selectedAngle, setSelectedAngle] = useState<string>("Address Pain Point");
  const [keyword, setKeyword] = useState<string>("");
  const [periode, setPeriode] = useState<string>("7");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<number>(0);
  const [generatedResult, setGeneratedResult] = useState<GenerationResult | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const [history, setHistory] = useState<HistoryItem[]>(INITIAL_HISTORY);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // ── Toast helper ──
  const addNotification = (text: string) => {
    const id = Math.random().toString(36).slice(2, 11);
    setNotifications((prev) => [...prev, { id, text }]);
    setTimeout(() => setNotifications((prev) => prev.filter((n) => n.id !== id)), 3000);
  };

  // ── Copy helper ──
  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    addNotification("Teks berhasil disalin!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  // ── Pilih topik dari chip ──
  const selectTopicSuggestion = (topicText: string) => {
    setKeyword(topicText);
    addNotification(`Memilih topik: "${topicText}"`);
  };

  // ── Submit generate ──
  const handleGenerate = async (
    e?: { preventDefault?: () => void }
  ) => {
    e?.preventDefault?.();

  if (!keyword.trim()) {
    addNotification("Silakan masukkan keyword!");
    return;
  }

  try {
    setIsLoading(true);
    setLoadingStep(1);

    // ANALYZE
    const analyzeResponse = await fetch(
      "http://127.0.0.1:5000/api/analyze",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          keyword,
        }),
      }
    );

    const analyzeData: AnalysisResult = await analyzeResponse.json();
    if (!analyzeResponse.ok) {
      throw new Error((analyzeData as { error?: string }).error || "Analyze gagal");
    }

    setAnalysisResult(analyzeData);
    setLoadingStep(2);


    // GENERATE
    // PERBAIKAN: kirim PILIHAN USER (selectedAngle), bukan rekomendasi
    // otomatis dari analyze. Rekomendasi otomatis hanya dipakai sebagai
    // FALLBACK kalau user belum sempat memilih apa pun.
    const generateResponse = await fetch(
      "http://127.0.0.1:5000/api/generate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          keyword,
          angle: selectedAngle || analyzeData.recommended_strategy.label,  // <-- FIX
        }),
      }
    );

    const generateData = await generateResponse.json();
    if (!generateResponse.ok) {
      throw new Error(generateData.error || "Generate gagal");
    }
    setLoadingStep(3);

    // SIMPAN KE STATE
    const result = {
      ...generateData,
      analysis: analyzeData,
    };

    setGeneratedResult(result);
    setHistory((prev) => [
      {
        id: Date.now().toString(),
        keyword,
        angle: generateData.angle,
        periode,
        timestamp: generateData.timestamp,
        result,
      },
      ...prev,
    ]);

    addNotification("Ide berhasil dibuat!");

    setTimeout(() => {
      document
        .getElementById("result-section")
        ?.scrollIntoView({
          behavior: "smooth",
        });
    }, 300);

  } catch (err) {

    console.error(err);

    addNotification("Backend gagal dihubungi");

  } finally {

    setIsLoading(false);

  }
};

  // ── Muat ulang dari riwayat ──
  const loadHistoryItem = (item: HistoryItem) => {
    setKeyword(item.keyword);
    setSelectedAngle(item.angle);
    setPeriode(item.periode);
    setGeneratedResult(item.result);
    addNotification(`Memuat riwayat: "${item.keyword}"`);
    setTimeout(() => {
      document.getElementById("generator-section")?.scrollIntoView({ behavior: "smooth" });
    }, 150);
  };

  // ── Reset ──
  const resetGenerator = () => {
    setGeneratedResult(null);
    setAnalysisResult(null);
    setKeyword("");
  };

  // ── Muat keyword/angle dari query param (?keyword=&angle=) ──
  // Dipakai oleh tombol "Analisis Ulang" di halaman History untuk
  // membawa user kembali ke Dashboard dan langsung menjalankan generate.
  // Client-side only (window.location) supaya tidak butuh Suspense
  // boundary dan tidak mengubah struktur app/page.tsx.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const qKeyword = params.get("keyword");
    const qAngle = params.get("angle");

    if (!qKeyword) return;

    setKeyword(qKeyword);
    if (qAngle) setSelectedAngle(qAngle);

    // Bersihkan query string dari address bar setelah dibaca
    window.history.replaceState({}, "", window.location.pathname);

    // Jalankan generate otomatis dengan keyword dari history
    setTimeout(() => {
      handleGenerate();
    }, 50);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    selectedAngle,
    setSelectedAngle,
    keyword,
    setKeyword,
    periode,
    setPeriode,
    isLoading,
    loadingStep,
    generatedResult,
    analysisResult,
    history,
    copiedId,
    notifications,
    handleGenerate,
    copyToClipboard,
    selectTopicSuggestion,
    loadHistoryItem,
    resetGenerator,
    addNotification,
  };
}