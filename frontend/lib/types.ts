
export type ContentFormat =
  | "OPSI 1"
  | "OPSI 2"
  | "OPSI 3";

// ============================================================
// GENERATED IDEA
// ============================================================

export interface GeneratedIdea {
  id: string | number;
  title: string;
  format: ContentFormat | string;
  category: string;
  hook: string;
  body: string;
  cta: string;
  hashtags: string[];
  justification: string;
  is_saved?: boolean;
}

// ============================================================
// SENTIMENT
// ============================================================

export type Sentiment =
  | "Negatif"
  | "Netral"
  | "Positif";

// ============================================================
// PROBABILITIES
// ============================================================

export interface SentimentProbabilities {
  Negatif: number;
  Netral: number;
  Positif: number;
}

// ============================================================
// STRATEGY
// ============================================================

export interface RecommendedStrategy {
  key: string;
  label: string;

  target_sentiment?: Sentiment;

  description?: string;

  reasoning?: string[];

  is_recommended?: boolean;

  recommended_key?: string;

  recommended_label?: string;
}

// ============================================================
// DOMINANT PHRASE
// ============================================================
//
// Backend sekarang mengirim:
//
// "dominant_phrase": ...
//
// Jadi gunakan singular, bukan dominant_phrases.
//

export type DominantPhrase =
  | string
  | null;

// ============================================================
// ANALYSIS RESULT
// ============================================================

export interface AnalysisResult {
  keyword: string;

  mode?: "single" | "batch";

  total_comments: number;

  sentiment?: Sentiment;

  confidence?: number | null;

  probabilities?: SentimentProbabilities | null;

  method?: string;

  dominant_phrase?: DominantPhrase;

  recommended_strategy?: RecommendedStrategy;
}

// ============================================================
// GENERATION RESULT
// ============================================================

export interface GenerationResult {
  topic: string;

  comment: string;

  sentiment: Sentiment;

  confidence?: number | null;

  angle: string;

  timestamp: string;

  ideas: GeneratedIdea[];

  strategy: RecommendedStrategy;

  probabilities?: SentimentProbabilities | null;

  method?: string;

  dominant_phrase?: DominantPhrase;

  analysis?: AnalysisResult;
}

// ============================================================
// HISTORY
// ============================================================

export interface HistoryItem {
  id: string | number;

  topic: string;

  comment: string;

  angle: string;

  sentiment: Sentiment;

  confidence?: number | null;

  timestamp: string;

  probabilities?: SentimentProbabilities | null;

  dominant_phrase?: DominantPhrase;

  result: GenerationResult;
}

// ============================================================
// TOAST / NOTIFICATION
// ============================================================

export interface Notification {
  id: string;

  text: string;
}