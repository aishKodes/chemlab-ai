import type { ChemShastriAdminSummary } from "./chemShastriTypes";
import { getBudgetSnapshot } from "@/lib/ai/budgetGuard";

function boolEnv(name: string, fallback = false) {
  const value = process.env[name];
  if (value === undefined) return fallback;
  return value === "true" || value === "1";
}

function numEnv(name: string, fallback: number) {
  const value = Number(process.env[name]);
  return Number.isFinite(value) ? value : fallback;
}

export const chemShastriConfig = {
  enabled: () => process.env.CHEM_SHASTRI_ENABLED !== "false" && process.env.MASTER_ALCHEM_ENABLED !== "false",
  mockMode: () => boolEnv("CHEM_SHASTRI_MOCK_MODE", boolEnv("MASTER_ALCHEM_MOCK_MODE", false)),
  defaultProvider: () => process.env.CHEM_SHASTRI_DEFAULT_PROVIDER || process.env.AI_DEFAULT_PROVIDER || "gemini",
  fastProvider: () => process.env.CHEM_SHASTRI_FAST_PROVIDER || process.env.AI_FAST_PROVIDER || "gemini",
  reasoningProvider: () => process.env.CHEM_SHASTRI_REASONING_PROVIDER || process.env.AI_REASONING_PROVIDER || "openai",
  geminiConfigured: () => Boolean(process.env.GEMINI_API_KEY),
  openaiConfigured: () => Boolean(process.env.OPENAI_API_KEY),
  openaiFallbackEnabled: () => boolEnv("CHEM_SHASTRI_OPENAI_FALLBACK_ENABLED", boolEnv("OPENAI_FALLBACK_ENABLED", false)),
  dailyBudgetInr: () => numEnv("CHEM_SHASTRI_DAILY_BUDGET_INR", numEnv("DAILY_AI_BUDGET_INR", 50)),
  retrievalEnabled: () => boolEnv("CHEM_SHASTRI_RETRIEVAL_ENABLED", boolEnv("RAG_ENABLED", true)),
  keywordSearchEnabled: () => boolEnv("CHEM_SHASTRI_KEYWORD_SEARCH", boolEnv("RAG_USE_KEYWORD_SEARCH", true)),
  vectorSearchEnabled: () => boolEnv("CHEM_SHASTRI_VECTOR_SEARCH", boolEnv("RAG_USE_VECTOR_SEARCH", false)),
  retrievalTopK: () => numEnv("CHEM_SHASTRI_RETRIEVAL_TOP_K", numEnv("RAG_TOP_K", 6)),
  strictSafety: () => process.env.CHEM_SHASTRI_SAFETY_MODE === "strict" || process.env.CHEMISTRY_SAFETY_MODE === "strict",
  unsafeChemistryAllowed: () =>
    boolEnv("CHEM_SHASTRI_ALLOW_UNSAFE_CHEMISTRY_INSTRUCTIONS", boolEnv("ALLOW_UNSAFE_CHEMISTRY_INSTRUCTIONS", false)),
  voiceAutoSpeakEnabled: () => boolEnv("CHEM_SHASTRI_VOICE_AUTO_SPEAK", boolEnv("VOICE_AUTO_SPEAK", false)),
  hostingerBaseUrl: () =>
    (process.env.BACKEND_INTERNAL_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "").replace(/\/+$/, ""),
};

export async function getChemShastriAdminSummary(): Promise<ChemShastriAdminSummary> {
  const budget = await getBudgetSnapshot();
  return {
    provider: {
      defaultProvider: chemShastriConfig.defaultProvider(),
      geminiConfigured: chemShastriConfig.geminiConfigured(),
      openaiConfigured: chemShastriConfig.openaiConfigured(),
      fallbackEnabled: chemShastriConfig.openaiFallbackEnabled(),
    },
    budget: {
      dailyBudgetInr: budget.budgetInr || chemShastriConfig.dailyBudgetInr(),
      usedInr: budget.usedInr,
      remainingInr: budget.remainingInr,
      blockedRequests: budget.blockedRequests,
      cacheHits: budget.cacheHits,
      ragOnlyAnswers: budget.ragOnlyAnswers,
    },
    safety: {
      mode: chemShastriConfig.strictSafety() ? "strict" : "standard",
      unsafeInstructionsAllowed: chemShastriConfig.unsafeChemistryAllowed(),
    },
    retrieval: {
      enabled: chemShastriConfig.retrievalEnabled(),
      keywordSearch: chemShastriConfig.keywordSearchEnabled(),
      vectorSearch: chemShastriConfig.vectorSearchEnabled(),
      topK: chemShastriConfig.retrievalTopK(),
    },
  };
}
