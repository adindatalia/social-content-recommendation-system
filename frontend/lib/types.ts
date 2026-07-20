
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
export interface PainPoint {
  keyword: string;
  count: number;
}

export interface RecommendedStrategy {
  key: string;
  label: string;
}

export interface AnalysisResult {
  keyword: string;

  distribution: {
    Positif: number;
    Netral: number;
    Negatif: number;
  };

  pain_points: PainPoint[];

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

  analysis: AnalysisResult;
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