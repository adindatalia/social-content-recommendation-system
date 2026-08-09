"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import type {
  AnalysisResult,
  GenerationResult,
  HistoryItem,
  Notification,
  Sentiment,
  SentimentProbabilities,
  RecommendedStrategy,
  GeneratedIdea,
} from "@/lib/types";

import { fetchHistoryDetail } from "@/services/api";

// ============================================================
// API RESPONSE TYPE
// ============================================================

interface HistoryApiResponse {
  id: number | string;

  topic?: string;
  keyword?: string;

  comment?: string;

  sentiment?: Sentiment;

  confidence?: number | null;

  probabilities?: SentimentProbabilities | null;

  method?: string;

  dominant_phrase?: string | null;

  angle?: string;

  periode?: string;

  timestamp?: string;

  created_at?: string;

  strategy?: RecommendedStrategy;

  recommended_strategy?: RecommendedStrategy;

  ideas?: GeneratedIdea[];
}

// ============================================================
// HOOK
// ============================================================

export function useContentGenerator() {
  const searchParams = useSearchParams();

  const historyId = searchParams.get("history");

  // ============================================================
  // STATE
  // ============================================================

  const [selectedAngle, setSelectedAngle] =
    useState("Address Pain Point");

  const [topic, setTopic] =
    useState("");

  const [comments, setComments] =
    useState("");

  const [isAnalyzing, setIsAnalyzing] =
    useState(false);

  const [isGenerating, setIsGenerating] =
    useState(false);

  const [loadingStep, setLoadingStep] =
    useState(0);

  const [analysisResult, setAnalysisResult] =
    useState<AnalysisResult | null>(null);

  const [generatedResult, setGeneratedResult] =
    useState<GenerationResult | null>(null);

  const [copiedId, setCopiedId] =
    useState<string | null>(null);

  const [notifications, setNotifications] =
    useState<Notification[]>([]);

  // ============================================================
  // NOTIFICATION
  // ============================================================

  const addNotification = (text: string) => {
    const id = Math.random()
      .toString(36)
      .slice(2, 11);

    setNotifications((prev) => [
      ...prev,
      {
        id,
        text,
      },
    ]);

    setTimeout(() => {
      setNotifications((prev) =>
        prev.filter((n) => n.id !== id)
      );
    }, 3000);
  };

  // ============================================================
  // COPY
  // ============================================================

  const copyToClipboard = (
    id: string,
    text: string
  ) => {
    navigator.clipboard?.writeText(text);

    setCopiedId(id);

    addNotification(
      "Teks berhasil disalin!"
    );

    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  // ============================================================
  // TOPIC SUGGESTION
  // ============================================================

  const selectTopicSuggestion = (
    topicText: string
  ) => {
    setTopic(topicText);

    addNotification(
      `Memilih topik: "${topicText}"`
    );
  };

  // ============================================================
  // ANALYZE
  // ============================================================

  const handleAnalyze = async (
    e?: {
      preventDefault?: () => void;
    }
  ) => {
    e?.preventDefault?.();

    const topicValue =
      topic.trim();

    const commentValue =
      comments.trim();

    if (!topicValue) {
      addNotification(
        "Silakan masukkan topik terlebih dahulu!"
      );

      return null;
    }

    if (!commentValue) {
      addNotification(
        "Silakan masukkan komentar terlebih dahulu!"
      );

      return null;
    }

    setGeneratedResult(null);
    setAnalysisResult(null);
    setIsAnalyzing(true);

    try {
      const res = await fetch(
        "http://127.0.0.1:5000/api/analyze",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            topic: topicValue,
            comment: commentValue,
          }),
        }
      );

      const data =
        await res.json();

      if (!res.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            "Analisis gagal"
        );
      }

      // ========================================================
      // BENTUK ANALYSIS RESULT
      // ========================================================

      const analysis: AnalysisResult = {
        keyword:
          data.topic ??
          topicValue,

        mode: "single",

        total_comments: 1,

        sentiment:
          data.sentiment,

        confidence:
          data.confidence ??
          null,

        probabilities:
          data.probabilities ??
          null,

        method:
          data.method ??
          "IndoBERTweet",

        dominant_phrase:
          data.dominant_phrase ??
          null,

        recommended_strategy:
          data.recommended_strategy ??
          undefined,
      };

      setAnalysisResult(
        analysis
      );

      // ========================================================
      // SET STRATEGI REKOMENDASI
      // ========================================================

      if (
        data.recommended_strategy
          ?.label
      ) {
        setSelectedAngle(
          data.recommended_strategy.label
        );
      }

      // ========================================================
      // SCROLL
      // ========================================================

      setTimeout(() => {
        document
          .getElementById(
            "strategy-section"
          )
          ?.scrollIntoView({
            behavior: "smooth",
          });
      }, 150);

      return data;
    } catch (err) {
      console.error(
        "Analyze error:",
        err
      );

      addNotification(
        err instanceof Error
          ? err.message
          : "Backend gagal dihubungi saat menganalisis."
      );

      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  // ============================================================
  // GENERATE IDE
  // ============================================================

  const handleGenerateIdeas = async (
    e?: {
      preventDefault?: () => void;
    }
  ) => {
    e?.preventDefault?.();

    if (!analysisResult) {
      addNotification(
        "Jalankan analisis terlebih dahulu."
      );

      return null;
    }

    const topicValue =
      topic.trim();

    const commentValue =
      comments.trim();

    if (
      !topicValue ||
      !commentValue
    ) {
      addNotification(
        "Topik dan komentar wajib tersedia."
      );

      return null;
    }

    try {
      setIsGenerating(true);
      setLoadingStep(0);

      const res = await fetch(
        "http://127.0.0.1:5000/api/generate",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            topic: topicValue,
            comment: commentValue,
            angle: selectedAngle,
          }),
        }
      );

      setLoadingStep(1);

      const generateData =
        await res.json();

      if (!res.ok) {
        throw new Error(
          generateData?.message ||
            generateData?.error ||
            "Generate gagal"
        );
      }

      // ========================================================
      // GENERATION RESULT
      // ========================================================

      const result: GenerationResult = {
        topic:
          generateData.topic ??
          topicValue,

        comment:
          generateData.comment ??
          commentValue,

        sentiment:
          generateData.sentiment,

        confidence:
          generateData.confidence ??
          null,

        angle:
          generateData.angle ??
          selectedAngle,

        timestamp:
          generateData.timestamp ??
          new Date().toISOString(),

        ideas:
          generateData.ideas ??
          [],

        strategy:
          generateData.strategy ??
          generateData.recommended_strategy ??
          {
            key: "",
            label:
              generateData.angle ??
              selectedAngle,
          },

        probabilities:
          generateData.probabilities ??
          null,

        method:
          generateData.method ??
          "IndoBERTweet",

        dominant_phrase:
          generateData.dominant_phrase ??
          null,

        analysis:
          analysisResult,
      };

      setGeneratedResult(
        result
      );

      addNotification(
        "Ide konten berhasil dibuat!"
      );

      // ========================================================
      // SCROLL KE IDE
      // ========================================================

      setTimeout(() => {
        document
          .getElementById(
            "ideas-section"
          )
          ?.scrollIntoView({
            behavior: "smooth",
          });
      }, 300);

      return result;
    } catch (err) {
      console.error(
        "Generate error:",
        err
      );

      addNotification(
        err instanceof Error
          ? err.message
          : "Backend gagal dihubungi saat generate ide."
      );

      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  // ============================================================
  // LOAD HISTORY ITEM MANUAL
  // ============================================================

  const loadHistoryItem = (
    item: HistoryItem
  ) => {
    const historyTopic =
      item.topic ??
      "";

    setTopic(
      historyTopic
    );

    setComments(
      item.comment ??
      ""
    );

    setSelectedAngle(
      item.angle ??
      "Address Pain Point"
    );

    setAnalysisResult(
      item.result.analysis ??
      null
    );

    setGeneratedResult(
      item.result
    );

    addNotification(
      `Memuat riwayat: "${historyTopic}"`
    );

    setTimeout(() => {
      document
        .getElementById(
          "ideas-section"
        )
        ?.scrollIntoView({
          behavior: "smooth",
        });
    }, 150);
  };

  // ============================================================
  // RESET
  // ============================================================

  const resetGenerator = () => {
    setGeneratedResult(null);

    setAnalysisResult(null);

    setTopic("");

    setComments("");

    setSelectedAngle(
      "Address Pain Point"
    );

    setTimeout(() => {
      document
        .getElementById(
          "generator-section"
        )
        ?.scrollIntoView({
          behavior: "smooth",
        });
    }, 50);
  };

  // ============================================================
  // LOAD HISTORY FROM DATABASE
  // ============================================================

  useEffect(() => {
    if (!historyId) {
      return;
    }

    const loadHistory =
      async () => {
        try {
          setIsGenerating(
            true
          );

          // ====================================================
          // FETCH DETAIL HISTORY
          // ====================================================

          const data =
            (await fetchHistoryDetail(
              historyId
            )) as HistoryApiResponse;

          // ====================================================
          // INPUT
          // ====================================================

          const historyTopic =
            data.topic ??
            data.keyword ??
            "";

          const historyComment =
            data.comment ??
            "";

          // ====================================================
          // STRATEGY
          // ====================================================

          const strategy =
            data.strategy ??
            data.recommended_strategy ??
            {
              key: "",
              label:
                data.angle ??
                "Address Pain Point",
            };

          // ====================================================
          // ANALYSIS RESULT
          // ====================================================

          const analysis: AnalysisResult = {
            keyword:
              historyTopic,

            mode: "single",

            total_comments: 1,

            sentiment:
              data.sentiment,

            confidence:
              data.confidence ??
              null,

            probabilities:
              data.probabilities ??
              null,

            method:
              data.method ??
              "IndoBERTweet",

            dominant_phrase:
              data.dominant_phrase ??
              null,

            recommended_strategy:
              data.recommended_strategy ??
              strategy,
          };

          // ====================================================
          // SET INPUT
          // ====================================================

          setTopic(
            historyTopic
          );

          setComments(
            historyComment
          );

          // ====================================================
          // SET ANGLE
          // ====================================================

          setSelectedAngle(
            data.angle ??
            strategy.label ??
            "Address Pain Point"
          );

          // ====================================================
          // SET ANALYSIS
          // ====================================================

          setAnalysisResult(
            analysis
          );

          // ====================================================
          // SET GENERATION RESULT
          // ====================================================

          const result: GenerationResult = {
            topic:
              historyTopic,

            comment:
              historyComment,

            sentiment:
              data.sentiment ??
              "Netral",

            confidence:
              data.confidence ??
              null,

            angle:
              data.angle ??
              strategy.label ??
              "Address Pain Point",

            timestamp:
              data.timestamp ??
              data.created_at ??
              new Date().toISOString(),

            ideas:
              data.ideas ??
              [],

            strategy:
              strategy,

            probabilities:
              data.probabilities ??
              null,

            method:
              data.method ??
              "IndoBERTweet",

            dominant_phrase:
              data.dominant_phrase ??
              null,

            analysis:
              analysis,
          };

          setGeneratedResult(
            result
          );

          // ====================================================
          // SCROLL KE HASIL
          // ====================================================

          setTimeout(() => {
            document
              .getElementById(
                "ideas-section"
              )
              ?.scrollIntoView({
                behavior: "smooth",
              });
          }, 300);

          addNotification(
            `Riwayat "${historyTopic}" berhasil dimuat.`
          );

          // ====================================================
          // HAPUS QUERY HISTORY DARI URL
          // ====================================================

          window.history.replaceState(
            {},
            "",
            window.location.pathname
          );
        } catch (err) {
          console.error(
            "History error:",
            err
          );

          addNotification(
            "Gagal memuat riwayat."
          );
        } finally {
          setIsGenerating(
            false
          );
        }
      };

    loadHistory();
  }, [historyId]);

  // ============================================================
  // RETURN
  // ============================================================

  return {
    selectedAngle,
    setSelectedAngle,

    topic,
    setTopic,

    comments,
    setComments,

    isAnalyzing,
    isGenerating,
    loadingStep,

    analysisResult,
    generatedResult,

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
