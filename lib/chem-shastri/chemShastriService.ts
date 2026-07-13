import { chemShastriConfig } from "./chemShastriConfig";
import { getChemShastriCachedAnswer, buildChemShastriCacheKey, saveChemShastriCachedAnswer } from "./chemShastriAnswerCache";
import { buildChemShastriContext } from "./chemShastriContextBuilder";
import { logChemShastriQuestionToBackend } from "./chemShastriConversationSync";
import { detectChemShastriIntent, shouldAskClarifyingQuestion } from "./chemShastriIntentDetector";
import { resolveChemShastriMode, toMasterAlchemMode } from "./chemShastriModeResolver";
import { buildChemShastriPromptPrefix, followUpsForMode, mergePromptWithContext } from "./chemShastriPromptBuilder";
import { buildRetrievalContext, retrieveChemShastriResources } from "./chemShastriResourceRetriever";
import { directChemistryAnswer, languageNotice } from "./chemShastriResponseFormatter";
import { checkChemShastriSafety } from "./chemShastriSafety";
import { findCuratedFallbackAnswer, genericCuratedFallback } from "./curatedFallbackAnswers";
import type { ChemShastriRequest, ChemShastriResponse } from "./chemShastriTypes";
import { getBudgetSnapshot } from "@/lib/ai/budgetGuard";
import { answerMasterAlchem } from "@/lib/master-alchem/masterAlchemService";
import type { MasterAlchemRequest } from "@/lib/master-alchem/types";

function makeConversationId() {
  return globalThis.crypto?.randomUUID?.() ?? `local-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function localResponse({
  answer,
  request,
  intent,
  source = "fallback",
  suggestedResources = [],
  shouldClarify = false,
  clarificationQuestion,
  spokenText,
  followUpQuestions,
}: {
  answer: string;
  request: ChemShastriRequest;
  intent: ChemShastriResponse["intent"];
  source?: ChemShastriResponse["source"];
  suggestedResources?: ChemShastriResponse["suggestedResources"];
  shouldClarify?: boolean;
  clarificationQuestion?: string;
  spokenText?: string;
  followUpQuestions?: string[];
}): Promise<ChemShastriResponse> {
  return getBudgetSnapshot().then((budget) => {
    const mode = resolveChemShastriMode(request.mode);
    const context = buildChemShastriContext(request);
    return {
      message: answer,
      answer,
      conversationId: request.conversationId ?? makeConversationId(),
      provider: intent === "unsafe_chemistry" ? "safety" : "local",
      model: intent === "unsafe_chemistry" ? "rule-based" : "chemlab-direct-answer",
      source,
      providerUsed: intent === "unsafe_chemistry" ? "safety" : "local",
      modelUsed: intent === "unsafe_chemistry" ? "rule-based" : "chemlab-direct-answer",
      mode: toMasterAlchemMode(mode),
      intent,
      citations: [],
      cacheHit: source === "cache",
      ragUsed: false,
      safetyStatus: intent === "unsafe_chemistry" ? "unsafe_chemistry" : "safe",
      mock: false,
      estimatedCostInr: 0,
      budgetRemainingInr: budget.remainingInr,
      spokenText: spokenText ?? answer.slice(0, 900),
      shouldClarify,
      clarificationQuestion,
      contextChips: context.chips,
      suggestedResources,
      followUpQuestions: followUpQuestions ?? followUpsForMode(mode),
      adminSignals: {
        providerConfigured: chemShastriConfig.geminiConfigured() || chemShastriConfig.openaiConfigured(),
        budgetBlocked: false,
        cacheHit: source === "cache",
        retrievalCount: suggestedResources.length,
      },
    };
  });
}

function normalizeRequest(raw: ChemShastriRequest): ChemShastriRequest {
  return {
    ...raw,
    subject: "chemistry",
    mode: resolveChemShastriMode(raw.mode),
    preferredLanguage: raw.preferredLanguage || "en",
    role: raw.role || "anonymous",
  };
}

export async function answerChemShastri(rawRequest: ChemShastriRequest, httpRequest?: Request): Promise<ChemShastriResponse> {
  const request = normalizeRequest(rawRequest);
  const mode = resolveChemShastriMode(request.mode);
  const context = buildChemShastriContext(request);
  const intent = detectChemShastriIntent(request.message, mode);

  if (!chemShastriConfig.enabled()) {
    const fallback = findCuratedFallbackAnswer(request.message, context) ?? genericCuratedFallback(request.message, context);
    return localResponse({
      answer: fallback.answer,
      spokenText: fallback.spokenText,
      request,
      intent,
      source: "fallback",
      suggestedResources: fallback.resource ? [{ ...fallback.resource, source: "fallback" }] : [],
      followUpQuestions: [fallback.followUp],
    });
  }

  const safety = checkChemShastriSafety(request.message);
  const suggestions = await retrieveChemShastriResources({ query: request.message, context, limit: 4 }).catch(() => []);

  if (safety.safeResponse) {
    const response = await localResponse({
      answer: safety.safeResponse,
      request,
      intent: "unsafe_chemistry",
      source: "safety",
      suggestedResources: suggestions,
    });
    void logChemShastriQuestionToBackend(request, response);
    return response;
  }

  const clarification = shouldAskClarifyingQuestion(request.message);
  if (clarification.shouldClarify) {
    const response = await localResponse({
      answer: clarification.question ?? "Send the exact chemistry question, and I will help.",
      request,
      intent: "clarification_needed",
      source: "fallback",
      suggestedResources: suggestions,
      shouldClarify: true,
      clarificationQuestion: clarification.question,
    });
    void logChemShastriQuestionToBackend(request, response);
    return response;
  }

  const cacheKey = buildChemShastriCacheKey({
    question: request.message,
    classLevel: request.classLevel,
    mode,
    resourceSlug: request.resourceSlug,
    simulationSlug: request.simulationSlug,
  });
  const cached = getChemShastriCachedAnswer(cacheKey);
  if (cached?.answer) {
    const response = await localResponse({
      answer: cached.answer,
      request,
      intent,
      source: "cache",
      suggestedResources: suggestions,
    });
    void logChemShastriQuestionToBackend(request, response);
    return response;
  }

  const curated = findCuratedFallbackAnswer(request.message, context);
  const direct = curated?.answer ?? directChemistryAnswer(request.message);
  if (direct && mode !== "step_by_step" && mode !== "check_my_answer" && mode !== "exam_mode") {
    const languageLine = languageNotice(context.preferredLanguage);
    const answer = [direct, languageLine, curated?.followUp ? `Next: ${curated.followUp}` : "Try the next step: tell me the example from your textbook, and I will map each part."]
      .filter(Boolean)
      .join("\n\n");
    saveChemShastriCachedAnswer(cacheKey, answer, { source: "direct" });
    const response = await localResponse({
      answer,
      spokenText: curated?.spokenText,
      request,
      intent: "direct_answer",
      source: "fallback",
      suggestedResources: curated?.resource ? [{ ...curated.resource, source: "fallback" }, ...suggestions] : suggestions,
      followUpQuestions: curated?.followUp ? [curated.followUp, ...followUpsForMode(mode).slice(0, 2)] : undefined,
    });
    void logChemShastriQuestionToBackend(request, response);
    return response;
  }

  const retrieval = await buildRetrievalContext(request.message, context).catch(() => ({ suggestions, notes: "" }));
  const prefix = buildChemShastriPromptPrefix({
    context,
    mode,
    retrievalNotes: retrieval.notes,
  });
  const masterRequest: MasterAlchemRequest = {
    message: mergePromptWithContext(request.message, prefix),
    conversationId: request.conversationId,
    userId: request.userId,
    anonymousId: request.anonymousId,
    classLevel: request.classLevel,
    subject: "chemistry",
    chapterSlug: request.chapterSlug,
    topicSlug: request.topicSlug,
    simulationSlug: request.simulationSlug,
    mode: toMasterAlchemMode(mode),
  };

  let masterResponse: Awaited<ReturnType<typeof answerMasterAlchem>>;
  try {
    masterResponse = await answerMasterAlchem(masterRequest, httpRequest);
  } catch {
    const fallback = findCuratedFallbackAnswer(request.message, context) ?? genericCuratedFallback(request.message, context);
    const response = await localResponse({
      answer: fallback.answer,
      spokenText: fallback.spokenText,
      request,
      intent,
      source: "fallback",
      suggestedResources: fallback.resource ? [{ ...fallback.resource, source: "fallback" }, ...retrieval.suggestions] : retrieval.suggestions,
      followUpQuestions: [fallback.followUp, ...followUpsForMode(mode).slice(0, 2)],
    });
    void logChemShastriQuestionToBackend(request, response);
    return response;
  }
  const response: ChemShastriResponse = {
    ...masterResponse,
    answer: masterResponse.answer,
    message: masterResponse.message,
    contextChips: context.chips,
    suggestedResources: retrieval.suggestions,
    followUpQuestions: followUpsForMode(mode),
    adminSignals: {
      providerConfigured: chemShastriConfig.geminiConfigured() || chemShastriConfig.openaiConfigured(),
      budgetBlocked: masterResponse.provider === "budget_guard",
      cacheHit: masterResponse.cacheHit,
      retrievalCount: retrieval.suggestions.length,
    },
  };
  if (!response.cacheHit && response.estimatedCostInr === 0 && response.provider !== "mock") {
    saveChemShastriCachedAnswer(cacheKey, response.answer, { source: response.source });
  }
  void logChemShastriQuestionToBackend(request, response);
  return response;
}
