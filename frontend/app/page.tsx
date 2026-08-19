"use client";

import { useGenerator } from "@/context/ContentGeneratorContext";

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import InsightSection from "@/components/InsightSection";
import SearchForm from "@/components/SearchForm";
import Loading from "@/components/Loading";
import StrategySection from "@/components/StrategySection";
import IdeasSection from "@/components/IdeasSection";
import Toast from "@/components/Toast";

export default function Home() {
  const gen = useGenerator();

  return (
    <div className="min-h-screen antialiased bg-white text-zinc-900 font-sans">
      <Navbar />

      <HeroSection />

      <main className="max-w-5xl mx-auto px-6 pt-12 pb-4 space-y-10">
        {/* Input topik dan komentar */}
        <SearchForm
          topic={gen.topic}
          setTopic={gen.setTopic}
          comments={gen.comments}
          setComments={gen.setComments}
          isAnalyzing={gen.isAnalyzing}
          onAnalyze={gen.handleAnalyze}
          onSelectTopic={gen.selectTopicSuggestion}
        />

        {/* Proses analisis */}
        {gen.isAnalyzing && (
          <Loading loadingStep={0} />
        )}

        {/* Informasi default sebelum analisis */}
        {!gen.analysisResult &&
          !gen.isAnalyzing && (
            <InsightSection />
          )}

        {/* Hasil analisis dan strategi */}
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

        {/* Proses generate */}
        {gen.isGenerating && (
          <Loading
            loadingStep={gen.loadingStep}
          />
        )}

        {/* Hasil ide konten */}
        {gen.generatedResult &&
          !gen.isGenerating && (
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
          )}
      </main>

      <footer className="bg-zinc-50 py-8 border-t border-zinc-200 text-center text-xs text-zinc-400">
        <div className="max-w-5xl mx-auto space-y-2">
          <p className="font-bold text-zinc-700 text-sm">
            SehatFlow Content
          </p>

          <p className="font-medium">
            © 2026 SehatFlow Content. Hak Cipta
            Dilindungi Undang-Undang.
          </p>
        </div>
      </footer>

      <Toast notifications={gen.notifications} />
    </div>
  );
}