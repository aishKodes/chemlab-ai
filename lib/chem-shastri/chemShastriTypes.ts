import type { MasterAlchemResponse, RagCitation } from "@/lib/master-alchem/types";

export type ChemShastriLanguage = "en" | "hi" | "bn" | "or";

export type ChemShastriRole = "anonymous" | "student" | "teacher" | "admin";

export type ChemShastriMode =
  | "explain"
  | "hint"
  | "step_by_step"
  | "quiz_me"
  | "check_my_answer"
  | "exam_mode"
  | "lab_guide"
  | "lab_guide_mode"
  | "teacher_mode";

export type ChemShastriIntent =
  | "direct_answer"
  | "simple_explain"
  | "lab_guide"
  | "quiz_feedback"
  | "check_my_answer"
  | "hard_reasoning"
  | "resource_recommendation"
  | "clarification_needed"
  | "unsafe_chemistry";

export type ChemShastriRequest = {
  message: string;
  conversationId?: string;
  userId?: string;
  anonymousId?: string;
  classLevel?: "8" | "9" | "10" | "11" | "12";
  preferredLanguage?: ChemShastriLanguage | string;
  role?: ChemShastriRole | string;
  subject?: "chemistry";
  chapterSlug?: string;
  topicSlug?: string;
  resourceSlug?: string;
  simulationSlug?: string;
  currentPage?: string;
  mode?: ChemShastriMode;
  usePageContext?: boolean;
  metadata?: Record<string, unknown>;
};

export type ChemShastriContext = {
  role: ChemShastriRole;
  classLevel?: string;
  preferredLanguage: ChemShastriLanguage;
  currentPage?: string;
  pageType?: "home" | "learn" | "lab" | "simulation" | "dashboard" | "resource" | "admin" | "other";
  resourceSlug?: string;
  simulationSlug?: string;
  chapterSlug?: string;
  topicSlug?: string;
  usePageContext: boolean;
  chips: string[];
  learningSignals: string[];
  historySummary?: string;
};

export type ChemShastriResourceSuggestion = {
  title: string;
  slug: string;
  type: string;
  routeUrl?: string | null;
  description?: string | null;
  reason: string;
  source: "backend" | "fallback" | "memory_deck" | "quick_drill" | "concept_map";
};

export type ChemShastriResponse = Omit<MasterAlchemResponse, "intent"> & {
  intent: ChemShastriIntent | MasterAlchemResponse["intent"];
  shouldClarify?: boolean;
  clarificationQuestion?: string;
  contextChips?: string[];
  suggestedResources?: ChemShastriResourceSuggestion[];
  followUpQuestions?: string[];
  adminSignals?: {
    providerConfigured: boolean;
    budgetBlocked?: boolean;
    cacheHit?: boolean;
    retrievalCount?: number;
  };
};

export type ChemShastriConversationSummary = {
  id: string;
  title: string;
  updatedAt?: string;
  mode?: ChemShastriMode;
};

export type ChemShastriFeedbackPayload = {
  conversationId?: string;
  messageId?: string;
  questionLogId?: number;
  rating: "helpful" | "not_helpful" | "wrong_answer" | "too_hard" | "too_long";
  comment?: string;
  anonymousId?: string;
};

export type ChemShastriAdminSummary = {
  provider: {
    defaultProvider: string;
    geminiConfigured: boolean;
    groqConfigured: boolean;
    openaiConfigured: boolean;
    fallbackEnabled: boolean;
  };
  budget: {
    dailyBudgetInr: number;
    usedInr: number;
    remainingInr: number;
    blockedRequests: number;
    cacheHits: number;
    ragOnlyAnswers: number;
  };
  safety: {
    mode: string;
    unsafeInstructionsAllowed: boolean;
  };
  retrieval: {
    enabled: boolean;
    keywordSearch: boolean;
    vectorSearch: boolean;
    topK: number;
  };
};

export type ChemShastriServiceError = {
  code: string;
  message: string;
  status?: number;
};

export type ChemShastriSource = ChemShastriResponse["source"] | "direct";

export type { RagCitation };
