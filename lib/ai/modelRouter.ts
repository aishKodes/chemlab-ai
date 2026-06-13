import { estimateAiCostUsd } from "./costEstimator";
import { checkBudget, recordAiSpend, recordBudgetBlocked } from "./budgetGuard";
import { AiBudgetExceededError } from "./errors";
import { estimateMessagesTokens } from "./tokenEstimator";
import { GeminiProvider } from "./providers/geminiProvider";
import { MockProvider } from "./providers/mockProvider";
import { OpenAIProvider } from "./providers/openaiProvider";
import type { AiChatMessage, AiChatResponse, AiProvider, AiProviderName, EmbeddingResponse } from "./providers/types";

export type AiRouteMode =
  | "faq_answer"
  | "simple_explain"
  | "lab_guide"
  | "quiz_feedback"
  | "check_my_answer"
  | "hard_reasoning"
  | "unsafe_chemistry";

export type RoutedAiResponse = AiChatResponse & {
  fallbackUsed: boolean;
  estimatedCostUsd: number;
  estimatedCostInr: number;
  budgetWarning: boolean;
  budgetRemainingInr: number;
};

const providers: Record<AiProviderName, AiProvider> = {
  openai: new OpenAIProvider(),
  gemini: new GeminiProvider(),
  mock: new MockProvider(),
};

function env(name: string, fallback = "") {
  return process.env[name] || fallback;
}

function providerOrder(mode: AiRouteMode): AiProviderName[] {
  if (env("MASTER_ALCHEM_MOCK_MODE") === "true") return ["mock"];
  const fast = env("AI_FAST_PROVIDER", "gemini") as AiProviderName;
  const reasoning = env("AI_REASONING_PROVIDER", "openai") as AiProviderName;
  const fallback = fast === "gemini" ? "openai" : "gemini";
  if (mode === "hard_reasoning") return [reasoning, fallback, "mock"];
  if (fallback === "openai" && process.env.OPENAI_FALLBACK_ENABLED !== "true") return [fast, "mock"];
  return [fast, fallback, "mock"];
}

function modelFor(provider: AiProviderName, mode: AiRouteMode) {
  if (provider === "mock") return "mock-master-alchem";
  if (provider === "openai") {
    return mode === "hard_reasoning"
      ? env("OPENAI_REASONING_MODEL", "gpt-4o")
      : env("OPENAI_FAST_MODEL", "gpt-4o-mini");
  }
  return mode === "hard_reasoning"
    ? env("GEMINI_REASONING_MODEL", env("GEMINI_FAST_MODEL", "gemini-1.5-flash"))
    : env("GEMINI_FAST_MODEL", "gemini-1.5-flash");
}

export function activeEmbeddingConfig() {
  const provider = env("AI_EMBEDDING_PROVIDER", "gemini") as AiProviderName;
  const model =
    provider === "openai"
      ? env("OPENAI_EMBEDDING_MODEL", "text-embedding-3-small")
      : env("GEMINI_EMBEDDING_MODEL", "text-embedding-004");
  return { provider, model };
}

export async function routeChatCompletion({
  mode,
  messages,
  responseFormat,
  maxOutputTokens,
}: {
  mode: AiRouteMode;
  messages: AiChatMessage[];
  responseFormat?: "text" | "json";
  maxOutputTokens?: number;
}): Promise<RoutedAiResponse> {
  const attempts = providerOrder(mode).slice(0, 3);
  const errors: string[] = [];
  for (const [index, providerName] of attempts.entries()) {
    const provider = providers[providerName] ?? providers.mock;
    if (!provider.isConfigured() && providerName !== "mock") {
      errors.push(`${providerName}: not configured`);
      continue;
    }
    try {
      const model = modelFor(providerName, mode);
      const estimatedInputTokens = estimateMessagesTokens(messages);
      const estimatedOutputTokens = maxOutputTokens ?? 900;
      const estimatedCostUsd = providerName === "mock" ? 0 : estimateAiCostUsd(model, estimatedInputTokens, estimatedOutputTokens);
      const budget = await checkBudget(estimatedCostUsd);
      if (!budget.allowed) {
        await recordBudgetBlocked();
        throw new AiBudgetExceededError("daily_ai_budget_exceeded", budget.remainingInr, budget.estimatedCostInr);
      }
      const response = await provider.generateChat({
        messages,
        model,
        maxOutputTokens,
        responseFormat,
        temperature: mode === "hard_reasoning" ? 0.18 : 0.28,
      });
      const inputTokens = response.inputTokens ?? estimateMessagesTokens(messages);
      const outputTokens = response.outputTokens ?? Math.ceil(response.content.length / 4);
      const actualCostUsd = response.provider === "mock" ? 0 : estimateAiCostUsd(response.model, inputTokens, outputTokens);
      if (actualCostUsd > 0) await recordAiSpend(actualCostUsd);
      return {
        ...response,
        fallbackUsed: index > 0 || errors.length > 0,
        estimatedCostUsd: actualCostUsd,
        estimatedCostInr: actualCostUsd * Number(process.env.AI_USD_TO_INR || 90),
        budgetWarning: budget.warning,
        budgetRemainingInr: budget.remainingInr,
        inputTokens,
        outputTokens,
      };
    } catch (error) {
      if (error instanceof AiBudgetExceededError) throw error;
      errors.push(`${providerName}: ${error instanceof Error ? error.message : "unknown error"}`);
    }
  }
  const mock = await providers.mock.generateChat({ messages, model: "mock-master-alchem" });
  return { ...mock, fallbackUsed: true, estimatedCostUsd: 0, estimatedCostInr: 0, budgetWarning: false, budgetRemainingInr: 0 };
}

export async function routeEmbedding(text: string): Promise<EmbeddingResponse> {
  const { provider: providerName, model } = activeEmbeddingConfig();
  const provider = providers[providerName] ?? providers.mock;
  if (!provider.isConfigured() && providerName !== "mock") {
    return providers.mock.embedText({ text, model: "mock-embedding" });
  }
  const budget = await checkBudget(providerName === "mock" ? 0 : estimateAiCostUsd(model, Math.ceil(text.length / 4), 0));
  if (!budget.allowed) {
    await recordBudgetBlocked();
    throw new AiBudgetExceededError("daily_ai_budget_exceeded", budget.remainingInr, budget.estimatedCostInr);
  }
  const result = await provider.embedText({ text, model });
  if (result.provider !== "mock") {
    await recordAiSpend(estimateAiCostUsd(result.model, Math.ceil(text.length / 4), 0));
  }
  return result;
}
