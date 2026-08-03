
export type ContentFormat =
  | "TIKTOK - REELS"
  | "FEED - CAROUSEL"
  | "INFOGRAFIK"
  | "Shorts"
  | "Reels"
  | "Carousel"
  | "Feed";


// Generate

export interface GeneratedIdea {
  id: string;
  title: string;
  format: ContentFormat | string;
  category: string;
  hook: string;
  body: string;
  cta: string;
  hashtags: string[];
  justification: string;
}

// Analyze
export interface PhraseItem {
  keyword: string;
  count: number;
}

export interface DominantPhrases {
  negative: PhraseItem[];
  neutral: PhraseItem[];
  positive: PhraseItem[];
}

export interface RecommendedStrategy {
  key: string;
  label: string;
  // Field tambahan yang sebenarnya sudah dikirim backend (strategy_service.resolve_strategy)
  // tapi sebelumnya tidak dimanfaatkan frontend. Dibuat opsional supaya tetap
  // backward-compatible dengan data lama (mis. history mock) yang belum punya field ini.
  target_sentiment?: "Negatif" | "Netral" | "Positif";
  description?: string;
  reasoning?: string[];
  is_recommended?: boolean;
  recommended_key?: string;
  recommended_label?: string;
}


export interface PainPointItem {
  text: string;
  count: string;
  pct: number;
}

export interface InsightsData {
  total_comments: number;
  distribution: {
    Positif: number;
    Netral: number;
    Negatif: number;
  };
  pain_points: PainPointItem[];
}

export interface AnalysisResult {
  keyword: string;

  distribution: {
    Positif: number;
    Netral: number;
    Negatif: number;
  };

  dominant_phrases: DominantPhrases;

  recommended_strategy: RecommendedStrategy;

  total_comments: number;
}

// Final Result (Generate + Analyze)
export interface GenerationResult {
  keyword: string;
  angle: string;
  periode: string;
  timestamp: string;

  ideas: GeneratedIdea[];

// Snapshot analisis dari tahap /api/analyze (Step 1, sebelum strategi dipilih)
analysis: AnalysisResult;

// Field asli yang dikembalikan langsung oleh /api/generate
strategy?: RecommendedStrategy;
dominant_phrases?: DominantPhrases;
distribution?: {
  Positif: number;
  Netral: number;
  Negatif: number;
};

}

// History
export interface HistoryItem {
  id: string;
  keyword: string;
  angle: string;
  periode: string;
  timestamp: string;

  result: GenerationResult;
}

// Toast
export interface Notification {
  id: string;
  text: string;
}