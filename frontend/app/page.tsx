"use client";

import { useGenerator } from "@/context/ContentGeneratorContext";

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import SearchForm from "@/components/SearchForm";
import InsightSection from "@/components/InsightSection";
import Loading from "@/components/Loading";
import StrategySection from "@/components/StrategySection";
import IdeasSection from "@/components/IdeasSection";
import PromptDetailSection from "@/components/PromptDetailSection";
import Toast from "@/components/Toast";

export default function Home() {
  const gen = useGenerator();

  return (
    <div className="min-h-screen antialiased bg-white text-zinc-900 font-sans">
      {/* 1. Navbar */}
      <Navbar />

      {/* 2. Hero */}
      <HeroSection />

      <main className="max-w-5xl mx-auto px-6 space-y-20 pb-20">
        {/* 3. Search form */}
        <SearchForm
          topic={gen.topic}
          setTopic={gen.setTopic}
          comments={gen.comments}
          setComments={gen.setComments}
          isAnalyzing={gen.isAnalyzing}
          onAnalyze={gen.handleAnalyze}
          onSelectTopic={gen.selectTopicSuggestion}
        />

        {/* 4. Loading saat proses analisis */}
        {gen.isAnalyzing && (
          <Loading loadingStep={0} />
        )}

        {/* 5. Insight default */}
        {!gen.analysisResult &&
          !gen.isAnalyzing && (
            <InsightSection />
          )}

        {/* 6. Hasil analisis + strategi */}
        {gen.analysisResult &&
          !gen.isAnalyzing && (
            <StrategySection
              analysis={gen.analysisResult}
              selectedAngle={gen.selectedAngle}
              setSelectedAngle={gen.setSelectedAngle}
              isGenerating={gen.isGenerating}
              onGenerateIdeas={
                gen.handleGenerateIdeas
              }
            />
          )}

        {/* 7. Loading generate */}
        {gen.isGenerating && (
          <Loading
            loadingStep={gen.loadingStep}
          />
        )}

        {/* 8. Hasil ide konten */}
        {gen.generatedResult &&
          !gen.isGenerating && (
            <>
              <IdeasSection
                result={gen.generatedResult}
                copiedId={gen.copiedId}
                onCopy={gen.copyToClipboard}
                onSave={(title) =>
                  gen.addNotification(
                    `Draf "${title}" berhasil disimpan ke sistem!`
                  )
                }
                onReset={gen.resetGenerator}
              />

              <PromptDetailSection
                result={gen.generatedResult}
                copiedId={gen.copiedId}
                onCopy={gen.copyToClipboard}
              />
            </>
          )}
      </main>

      {/* Footer */}
      <footer className="bg-zinc-50 py-12 border-t border-zinc-200 text-center text-xs text-zinc-400">
        <div className="max-w-5xl mx-auto space-y-2">
          <p className="font-bold text-zinc-700 text-sm">
            🚀 SehatFlow Content Platform
          </p>

          <p className="font-medium">
            © 2026 SehatFlow Content. Hak Cipta
            Dilindungi Undang-Undang.
          </p>
        </div>
      </footer>

      {/* Toast */}
      <Toast notifications={gen.notifications} />
    </div>
  );
}