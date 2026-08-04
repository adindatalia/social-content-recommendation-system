"use client";

import { useEffect, useState } from "react";
import type { AnalysisResult, GenerationResult, HistoryItem, Notification } from "@/lib/types";
import { INITIAL_HISTORY } from "@/lib/mockData";
import { fetchHistoryDetail } from "@/services/api";

const STORAGE_KEY = "latest_generation";

export function useContentGenerator() {
  const [selectedAngle, setSelectedAngle] = useState<string>("Address Pain Point");
  const [keyword, setKeyword] = useState<string>("");
  const [periode, setPeriode] = useState<string>("7");

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<number>(0);

  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [generatedResult, setGeneratedResult] = useState<GenerationResult | null>(null);

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

  // ── Aksi 1: Analisis tren topik ──
  const handleAnalyze = async (e?: { preventDefault?: () => void }) => {
    e?.preventDefault?.();

    if (!keyword.trim()) {
      addNotification("Silakan masukkan keyword terlebih dahulu!");
      return null;
    }

    // Analisis baru dimulai -> hasil generate lama (kalau ada) sudah tidak relevan
    setGeneratedResult(null);
    setIsAnalyzing(true);

    try {
      const res = await fetch("http://127.0.0.1:5000/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword }),
      });

      const data: AnalysisResult = await res.json();
      if (!res.ok) {
        throw new Error((data as unknown as { error?: string }).error || "Analisis gagal");
      }

      setAnalysisResult(data);
      // Pre-select strategi sesuai rekomendasi sistem, user tetap bisa ganti di StrategySection
      setSelectedAngle(data.recommended_strategy.label);

      setTimeout(() => {
        document.getElementById("strategy-section")?.scrollIntoView({ behavior: "smooth" });
      }, 150);

      return data;
    } catch (err) {
      console.error(err);
      addNotification("Backend gagal dihubungi saat menganalisis.");
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  // ── Aksi 2: Generate ide konten dari strategi yang dipilih ──
  const handleGenerateIdeas = async (e?: { preventDefault?: () => void }) => {
    e?.preventDefault?.();

    if (!analysisResult) {
      addNotification("Jalankan analisis topik terlebih dahulu.");
      return;
    }

    try {
      setIsGenerating(true);
      setLoadingStep(0);

      const res = await fetch("http://127.0.0.1:5000/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keyword,
          angle: selectedAngle || analysisResult.recommended_strategy.label,
          periode,
        }),
      });

      setLoadingStep(1);
      const generateData = await res.json();
      if (!res.ok) {
        throw new Error(generateData.error || "Generate gagal");
      }

      const result: GenerationResult = {
        ...generateData,
        analysis: analysisResult,
      };

      setGeneratedResult(result);

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(result)
      );

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

      addNotification("Ide konten berhasil dibuat!");

      setTimeout(() => {
        document.getElementById("ideas-section")?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } catch (err) {
      console.error(err);
      addNotification("Backend gagal dihubungi saat generate ide.");
    } finally {
      setIsGenerating(false);
    }
  };

  // ── Muat ulang dari riwayat (data sudah lengkap, tidak perlu panggil API lagi) ──
  const loadHistoryItem = (item: HistoryItem) => {
    setKeyword(item.keyword);
    setSelectedAngle(item.angle);
    setPeriode(item.periode);
    setAnalysisResult(item.result.analysis);
    setGeneratedResult(item.result);
    addNotification(`Memuat riwayat: "${item.keyword}"`);
    setTimeout(() => {
      document.getElementById("ideas-section")?.scrollIntoView({ behavior: "smooth" });
    }, 150);
  };

  // ── Reset ──
  const resetGenerator = () => {
    setGeneratedResult(null);
    setAnalysisResult(null);
    setKeyword("");
    setSelectedAngle("Address Pain Point");
    
    localStorage.removeItem(STORAGE_KEY);

    setTimeout(() => {
      document.getElementById("generator-section")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  
 useEffect(() => {
  const params = new URLSearchParams(window.location.search);

  const historyId = params.get("history");

  if (!historyId) return;

  // Bersihkan query setelah dibaca
  window.history.replaceState({}, "", window.location.pathname);

  (async () => {
    try {
      setIsGenerating(true);

      const data = await fetchHistoryDetail(historyId);

      setKeyword(data.keyword);
      setSelectedAngle(data.angle);
      setPeriode(data.periode);

      const analysis: AnalysisResult = {
        keyword: data.keyword,
        distribution: data.distribution ?? {},
        dominant_phrases: data.dominant_phrase ?? {},
        recommended_strategy: data.recommended_strategy ?? {},
        total_comments: 0,
      };

      setAnalysisResult(analysis);

      const result: GenerationResult = {
        keyword: data.keyword,
        angle: data.angle,
        periode: data.periode,
        timestamp: data.timestamp,

        ideas: data.ideas,

        analysis,

        distribution: data.distribution,
        dominant_phrases: data.dominant_phrase,
        strategy: data.recommended_strategy,
      };

      setGeneratedResult(result);

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(result)
      );

      setTimeout(() => {
        document
          .getElementById("ideas-section")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 300);

      addNotification(`Riwayat "${data.keyword}" berhasil dimuat.`);
    } catch (err) {
      console.error(err);
      addNotification("Gagal memuat riwayat.");
    } finally {
      setIsGenerating(false);
    }
    })();
    }, []);

    // ── Restore hasil terakhir saat kembali ke Dashboard ──
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    // Kalau sedang membuka history, jangan restore localStorage
    if (params.get("history")) return;

    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return;

    try {
      const result: GenerationResult = JSON.parse(saved);

      setGeneratedResult(result);

      if (result.analysis) {
        setAnalysisResult(result.analysis);
      }

      setKeyword(result.keyword);
      setSelectedAngle(result.angle);
      setPeriode(result.periode);

    } catch (error) {
      console.error("Gagal restore hasil terakhir:", error);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);


  return {
    selectedAngle,
    setSelectedAngle,
    keyword,
    setKeyword,
    periode,
    setPeriode,
    isAnalyzing,
    isGenerating,
    loadingStep,
    analysisResult,
    generatedResult,
    history,
    copiedId,
    notifications,
    handleAnalyze,
    handleGenerateIdeas,
    copyToClipboard,
    selectTopicSuggestion,
    loadHistoryItem,
    resetGenerator,
    addNotification,
  };
}
