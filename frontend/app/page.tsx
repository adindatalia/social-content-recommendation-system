"use client";

import { useContentGenerator } from "@/hooks/useContentGenerator";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import SearchForm from "@/components/SearchForm";
import Loading from "@/components/Loading";
import RecommendationSection from "@/components/RecommendationSection";
import HistorySection from "@/components/HistorySection";
import Toast from "@/components/Toast";

export default function Home() {
  const gen = useContentGenerator();

  return (
    <div className="min-h-screen antialiased bg-white text-zinc-900 font-sans">
      {/* 1. Navbar */}
      <Navbar />

      {/* 2. Hero */}
      <HeroSection />

      <main className="max-w-5xl mx-auto px-6 space-y-20 pb-20">

        {/* 4. Generator — pilih strategi, keyword, tombol Generate */}
        <SearchForm
          selectedAngle={gen.selectedAngle}
          setSelectedAngle={gen.setSelectedAngle}
          keyword={gen.keyword}
          setKeyword={gen.setKeyword}
          isLoading={gen.isLoading}
          onGenerate={gen.handleGenerate}
          onSelectTopic={gen.selectTopicSuggestion}
        />

        {/* 5. Loading — hanya saat proses generate berjalan */}
        {gen.isLoading && <Loading loadingStep={gen.loadingStep} />}

        {/* 6. Hasil generate — hanya setelah data tersedia */}
        {gen.generatedResult && !gen.isLoading && (
          <RecommendationSection
            result={gen.generatedResult}
            analysis={gen.analysisResult}
            copiedId={gen.copiedId}
            onCopy={gen.copyToClipboard}
            onSave={(title) => gen.addNotification(`Draf "${title}" berhasil disimpan ke sistem!`)}
            onReset={gen.resetGenerator}
          />
        )}

        {/* 7. Riwayat — selalu di bawah hasil generate */}
        <HistorySection history={gen.history} onLoad={gen.loadHistoryItem} />
      </main>

      <footer className="bg-zinc-50 py-12 border-t border-zinc-200 text-center text-xs text-zinc-400">
        <div className="max-w-5xl mx-auto space-y-2">
          <p className="font-bold text-zinc-700 text-sm">🚀 SehatFlow Content Platform</p>
          <p className="font-medium">© 2026 SehatFlow Content. Hak Cipta Dilindungi Undang-Undang.</p>
        </div>
      </footer>

      {/* 8. Toast — tetap di paling bawah (fixed overlay) */}
      <Toast notifications={gen.notifications} />
    </div>
  );
}
