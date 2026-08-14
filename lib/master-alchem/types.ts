export type MasterAlchemMode =
  | "explain"
  | "hint"
  | "step_by_step"
  | "quiz_me"
  | "check_my_answer"
  | "lab_guide"
  | "lab_guide_mode"
  | "exam_mode";

export type MasterAlchemIntent =
  | "faq_answer"
  | "simple_explain"
  | "lab_guide"
  | "quiz_feedback"
  | "check_my_answer"
  | "hard_reasoning"
  | "unsafe_chemistry";

export type RagCitation = {
  label: string;
  sourceType: string;
  classLevel?: string;
  subject?: string;
  chapterSlug?: string;
  chapterTitle?: string;
  pageStart?: number | null;
  pageEnd?: number | null;
};

export type RagChunk = {
  id: string;
  title: string;
  chunkText: string;
  cleanText: string;
  score: number;
  sourceCitation: string;
  classLevel?: string;
  subject?: string;
  chapterSlug?: string;
  pageStart?: number | null;
  pageEnd?: number | null;
  metadata?: Record<string, unknown>;
};

export type MasterAlchemRequest = {
  message: string;
  conversationId?: string;
  userId?: string;
  anonymousId?: string;
  classLevel?: "8" | "9" | "10" | "11" | "12";
  subject?: "chemistry";
  chapterSlug?: string;
  topicSlug?: string;
  simulationSlug?: string;
  mode?: MasterAlchemMode;
};

export type MasterAlchemResponse = {
  message: string;
  answer: string;
  conversationId?: string;
  provider: string;
  model: string;
  source: "faq" | "cache" | "rag" | "gemini" | "groq" | "openai" | "fallback" | "scripted" | "safety";
  providerUsed?: string;
  modelUsed?: string;
  mode: MasterAlchemMode;
  intent: MasterAlchemIntent;
  citations: RagCitation[];
  cacheHit: boolean;
  ragUsed: boolean;
  safetyStatus: string;
  remaining?: number;
  mock?: boolean;
  estimatedCostInr: number;
  budgetRemainingInr: number;
  spokenText?: string;
};
