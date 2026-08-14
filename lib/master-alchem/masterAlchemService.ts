import { checkRateLimit, isDevelopmentAiUnlimited } from "@/lib/rate-limit/basic";
import { checkChemistrySafety } from "@/lib/ai/safety";
import { buildMasterAlchemPrompt } from "@/lib/ai/promptBuilder";
import { estimateMessagesTokens } from "@/lib/ai/tokenEstimator";
import { routeChatCompletion } from "@/lib/ai/modelRouter";
import { AiBudgetExceededError } from "@/lib/ai/errors";
import { getBudgetSnapshot, recordCacheHit, recordRagOnlyAnswer } from "@/lib/ai/budgetGuard";
import { citationsFromChunks } from "@/lib/rag/citations";
import { rerankChunks } from "@/lib/rag/reranker";
import { buildAnswerCacheKey, getCachedAnswer, saveCachedAnswer } from "./answerCache";
import { createOrLoadConversation, saveConversationMessages } from "./conversationLogger";
import { detectIntent } from "./intentDetector";
import { detectAndLogMisconceptions } from "./misconceptionDetector";
import { normalizeQuestion, hashText, matchFaq } from "./faqMatcher";
import { resolveMode } from "./modeResolver";
import { retrieveRagContext } from "./ragRetriever";
import { formatAnswerWithCitations } from "./responseFormatter";
import { logAiRequest, logRetrieval } from "./analyticsLogger";
import type { MasterAlchemRequest, MasterAlchemResponse, RagChunk, RagCitation } from "./types";

function limitForRequest(request: MasterAlchemRequest) {
  if (request.userId === "admin") return Number(process.env.ADMIN_DAILY_AI_LIMIT || 100);
  return request.userId
    ? Number(process.env.FREE_USER_DAILY_AI_LIMIT || 10)
    : Number(process.env.ANONYMOUS_DAILY_AI_LIMIT || 3);
}

function sourceForProvider(provider: string): MasterAlchemResponse["source"] {
  if (provider === "gemini") return "gemini";
  if (provider === "groq") return "groq";
  if (provider === "openai") return "openai";
  if (provider === "faq") return "faq";
  if (provider === "cache") return "cache";
  if (provider === "scripted") return "scripted";
  if (provider === "safety") return "safety";
  return "fallback";
}

function scriptedSimulationGuidance(simulationSlug?: string, message?: string) {
  if (!simulationSlug) return null;
  const text = (message || "").toLowerCase();
  if (simulationSlug.includes("daniell")) {
    return text.includes("hint")
      ? "Hint: in a Daniell cell, oxidation happens at the zinc electrode and reduction happens at the copper electrode. Track where electrons are released first."
      : null;
  }
  if (simulationSlug.includes("hydrocarbon")) {
    return "For hydrocarbon naming, first choose the longest continuous carbon chain, then number it from the end that gives the substituent or double bond the lowest position.";
  }
  return null;
}

function buildRagOnlyAnswer({
  chunks,
  budgetBlocked = false,
}: {
  chunks: RagChunk[];
  budgetBlocked?: boolean;
}) {
  if (!chunks.length) {
    return budgetBlocked
      ? "Chem-Shastri is in low-cost mode today. I need a little more NCERT context to answer that properly."
      : "I need a little more context to answer that properly.";
  }
  const topChunks = chunks.slice(0, 2);
  const notes = topChunks
    .map((chunk) => {
      const text = (chunk.cleanText || chunk.chunkText || "").replace(/\s+/g, " ").trim();
      return text.length > 520 ? `${text.slice(0, 520).trim()}...` : text;
    })
    .filter(Boolean);
  const prefix = budgetBlocked
    ? "Chem-Shastri is in low-cost mode today. Here is the best answer from chemlearning's verified notes."
    : "From chemlearning's verified NCERT notes:";
  return `${prefix}\n\n${notes.map((note) => `- ${note}`).join("\n")}`;
}

async function buildBaseResponse({
  answer,
  conversationId,
  provider,
  model,
  source,
  mode,
  intent,
  citations,
  cacheHit,
  ragUsed,
  safetyStatus,
  remaining,
  mock,
  estimatedCostInr = 0,
  limit,
}: {
  answer: string;
  conversationId?: string;
  provider: string;
  model: string;
  source?: MasterAlchemResponse["source"];
  mode: MasterAlchemResponse["mode"];
  intent: MasterAlchemResponse["intent"];
  citations: RagCitation[];
  cacheHit: boolean;
  ragUsed: boolean;
  safetyStatus: string;
  remaining?: number;
  mock?: boolean;
  estimatedCostInr?: number;
  limit?: ReturnType<typeof checkRateLimit>;
}): Promise<MasterAlchemResponse & { limit?: ReturnType<typeof checkRateLimit> }> {
  const budget = await getBudgetSnapshot();
  return {
    message: answer,
    answer,
    conversationId,
    provider,
    model,
    source: source || sourceForProvider(provider),
    providerUsed: provider,
    modelUsed: model,
    mode,
    intent,
    citations,
    cacheHit,
    ragUsed,
    safetyStatus,
    remaining,
    mock,
    estimatedCostInr,
    budgetRemainingInr: budget.remainingInr,
    spokenText: answer.replace(/\nSources:\n[\s\S]*$/u, "").slice(0, 900),
    limit,
  };
}

export async function answerMasterAlchem(
  rawRequest: MasterAlchemRequest,
  httpRequest?: Request,
): Promise<MasterAlchemResponse & { limit?: ReturnType<typeof checkRateLimit> }> {
  const started = Date.now();
  const mode = resolveMode(rawRequest.mode);
  const request: MasterAlchemRequest = {
    ...rawRequest,
    mode,
    subject: rawRequest.subject || "chemistry",
  };

  if (process.env.MASTER_ALCHEM_ENABLED === "false") {
    throw Object.assign(new Error("Chem-Shastri is currently disabled."), { status: 503 });
  }

  const rateKey = `master-alchem:${request.userId || request.anonymousId || "anonymous"}`;
  const devUnlimited = isDevelopmentAiUnlimited(httpRequest);
  const legacyLimit = checkRateLimit(rateKey, Boolean(request.userId), { unlimited: devUnlimited });
  const configuredLimit = limitForRequest(request);
  const limit = devUnlimited ? legacyLimit : { ...legacyLimit, limit: configuredLimit };
  if (!limit.allowed) {
    throw Object.assign(new Error("Daily Chem-Shastri limit reached."), { status: 429, limit });
  }

  const conversationId = await createOrLoadConversation(request);
  const safety = checkChemistrySafety(request.message);
  let intent = detectIntent(request.message, mode);
  if (safety.status === "unsafe_chemistry") intent = "unsafe_chemistry";

  if (safety.safeResponse) {
    const aiRequestId = await logAiRequest({
      conversationId,
      userId: request.userId,
      anonymousId: request.anonymousId,
      endpoint: "/api/master-alchem/chat",
      intent,
      mode,
      provider: "safety",
      model: "rule-based",
      promptHash: hashText(request.message),
      inputChars: request.message.length,
      outputChars: safety.safeResponse.length,
      estimatedInputTokens: Math.ceil(request.message.length / 4),
      estimatedOutputTokens: Math.ceil(safety.safeResponse.length / 4),
      estimatedCostUsd: 0,
      estimatedCostInr: 0,
      latencyMs: Date.now() - started,
      cacheHit: false,
      ragUsed: false,
      safetyStatus: safety.status,
      status: "safe_refusal",
    });
    await saveConversationMessages({
      conversationId,
      userMessage: request.message,
      assistantMessage: safety.safeResponse,
      metadata: { aiRequestId, safetyStatus: safety.status },
    });
    return buildBaseResponse({
      answer: safety.safeResponse,
      conversationId,
      provider: "safety",
      model: "rule-based",
      source: "safety",
      mode,
      intent,
      citations: [],
      cacheHit: false,
      ragUsed: false,
      safetyStatus: safety.status,
      remaining: limit.remaining ?? undefined,
      limit,
    });
  }

  const scripted = scriptedSimulationGuidance(request.simulationSlug, request.message);
  if (scripted && mode === "lab_guide") {
    await saveConversationMessages({
      conversationId,
      userMessage: request.message,
      assistantMessage: scripted,
      metadata: { source: "scripted" },
    });
    return buildBaseResponse({
      answer: scripted,
      conversationId,
      provider: "scripted",
      model: "simulation-guide",
      source: "scripted",
      mode,
      intent: "lab_guide",
      citations: [],
      cacheHit: false,
      ragUsed: false,
      safetyStatus: safety.status,
      remaining: limit.remaining ?? undefined,
      limit,
    });
  }

  const normalized = normalizeQuestion(request.message);
  const faq = await matchFaq({
    question: request.message,
    classLevel: request.classLevel,
    chapterSlug: request.chapterSlug,
  }).catch(() => null);
  if (faq && faq.confidence >= 0.9 && mode !== "step_by_step" && mode !== "check_my_answer") {
    const answer =
      faq.faq.master_alchem_style_answer ||
      faq.faq.full_answer ||
      faq.faq.short_answer ||
      "I need a little more context to answer that properly.";
    await recordCacheHit();
    const aiRequestId = await logAiRequest({
      conversationId,
      userId: request.userId,
      anonymousId: request.anonymousId,
      endpoint: "/api/master-alchem/chat",
      intent: "faq_answer",
      mode,
      provider: "faq",
      model: "human-verified",
      promptHash: hashText(normalized),
      inputChars: request.message.length,
      outputChars: answer.length,
      estimatedInputTokens: Math.ceil(request.message.length / 4),
      estimatedOutputTokens: Math.ceil(answer.length / 4),
      estimatedCostUsd: 0,
      estimatedCostInr: 0,
      latencyMs: Date.now() - started,
      cacheHit: true,
      ragUsed: false,
      safetyStatus: safety.status,
      status: "faq_hit",
    });
    await saveConversationMessages({
      conversationId,
      userMessage: request.message,
      assistantMessage: answer,
      metadata: { aiRequestId, source: faq.method, confidence: faq.confidence },
    });
    return buildBaseResponse({
      answer,
      conversationId,
      provider: "faq",
      model: "human-verified",
      source: "faq",
      mode,
      intent,
      citations: [{ label: "chemlearning verified FAQ", sourceType: "faq", classLevel: request.classLevel }],
      cacheHit: true,
      ragUsed: false,
      safetyStatus: safety.status,
      remaining: limit.remaining ?? undefined,
      limit,
    });
  }

  const simpleCacheKey = buildAnswerCacheKey({
    question: request.message,
    classLevel: request.classLevel,
    subject: request.subject,
    chapterSlug: request.chapterSlug,
    topicSlug: request.topicSlug,
    mode,
    chunkIds: [],
    model: "router-v1",
  });
  const simpleCached = safety.status === "safe" ? await getCachedAnswer(simpleCacheKey).catch(() => null) : null;
  if (simpleCached?.answer) {
    await recordCacheHit();
    const answer = String(simpleCached.answer);
    await logAiRequest({
      conversationId,
      userId: request.userId,
      anonymousId: request.anonymousId,
      endpoint: "/api/master-alchem/chat",
      intent,
      mode,
      provider: simpleCached.provider || "cache",
      model: simpleCached.model || "cache",
      promptHash: hashText(normalized),
      inputChars: request.message.length,
      outputChars: answer.length,
      estimatedInputTokens: Math.ceil(request.message.length / 4),
      estimatedOutputTokens: Math.ceil(answer.length / 4),
      estimatedCostUsd: 0,
      estimatedCostInr: 0,
      latencyMs: Date.now() - started,
      cacheHit: true,
      ragUsed: false,
      safetyStatus: safety.status,
      status: "cache_hit",
    });
    return buildBaseResponse({
      answer,
      conversationId,
      provider: simpleCached.provider || "cache",
      model: simpleCached.model || "cache",
      source: "cache",
      mode,
      intent,
      citations: (simpleCached.citations || []) as RagCitation[],
      cacheHit: true,
      ragUsed: false,
      safetyStatus: safety.status,
      remaining: limit.remaining ?? undefined,
      limit,
    });
  }

  const retrieval = await retrieveRagContext({
    query: request.message,
    classLevel: request.classLevel,
    subject: request.subject,
    chapterSlug: request.chapterSlug,
    topicSlug: request.topicSlug,
  }).catch(() => ({ chunks: [], method: "fallback_error" }));
  const selectedChunks = rerankChunks(request.message, retrieval.chunks);
  const citations = citationsFromChunks(selectedChunks);
  const maxContextChars = Number(process.env.RAG_MAX_CONTEXT_CHARS || 8000);
  const context = selectedChunks
    .map((chunk, index) => `[${index + 1}] ${chunk.sourceCitation}\n${chunk.cleanText || chunk.chunkText}`)
    .join("\n\n")
    .slice(0, maxContextChars);

  const cacheKey = buildAnswerCacheKey({
    question: request.message,
    classLevel: request.classLevel,
    subject: request.subject,
    chapterSlug: request.chapterSlug,
    topicSlug: request.topicSlug,
    mode,
    chunkIds: selectedChunks.map((chunk) => chunk.id),
    model: "router-v1",
  });
  const cached = safety.status === "safe" && cacheKey !== simpleCacheKey ? await getCachedAnswer(cacheKey).catch(() => null) : null;
  if (cached?.answer) {
    await recordCacheHit();
    const answer = String(cached.answer);
    const aiRequestId = await logAiRequest({
      conversationId,
      userId: request.userId,
      anonymousId: request.anonymousId,
      endpoint: "/api/master-alchem/chat",
      intent,
      mode,
      provider: cached.provider || "cache",
      model: cached.model || "cache",
      promptHash: hashText(normalized),
      inputChars: request.message.length,
      outputChars: answer.length,
      estimatedInputTokens: Math.ceil(request.message.length / 4),
      estimatedOutputTokens: Math.ceil(answer.length / 4),
      estimatedCostUsd: 0,
      estimatedCostInr: 0,
      latencyMs: Date.now() - started,
      cacheHit: true,
      ragUsed: selectedChunks.length > 0,
      safetyStatus: safety.status,
      status: "cache_hit",
    });
    await logRetrieval({
      aiRequestId,
      query: request.message,
      normalizedQuery: normalized,
      classLevel: request.classLevel,
      subject: request.subject,
      chapterSlug: request.chapterSlug,
      topicSlug: request.topicSlug,
      retrievalMethod: retrieval.method,
      topK: Number(process.env.RAG_TOP_K || 6),
      returnedChunkIds: retrieval.chunks.map((chunk) => chunk.id),
      selectedChunkIds: selectedChunks.map((chunk) => chunk.id),
      scores: selectedChunks.map((chunk) => chunk.score),
    });
    return buildBaseResponse({
      answer,
      conversationId,
      provider: cached.provider || "cache",
      model: cached.model || "cache",
      source: "cache",
      mode,
      intent,
      citations: (cached.citations || citations) as RagCitation[],
      cacheHit: true,
      ragUsed: selectedChunks.length > 0,
      safetyStatus: safety.status,
      remaining: limit.remaining ?? undefined,
      limit,
    });
  }

  const canUseRagOnly =
    selectedChunks.length > 0 &&
    selectedChunks[0].score >= 0.9 &&
    mode !== "step_by_step" &&
    mode !== "check_my_answer" &&
    intent !== "hard_reasoning";
  if (canUseRagOnly) {
    const answer = formatAnswerWithCitations(buildRagOnlyAnswer({ chunks: selectedChunks }), citations);
    await recordRagOnlyAnswer();
    const aiRequestId = await logAiRequest({
      conversationId,
      userId: request.userId,
      anonymousId: request.anonymousId,
      endpoint: "/api/master-alchem/chat",
      intent,
      mode,
      provider: "rag",
      model: "keyword-local",
      promptHash: hashText(normalized),
      inputChars: request.message.length,
      outputChars: answer.length,
      estimatedInputTokens: Math.ceil(request.message.length / 4),
      estimatedOutputTokens: Math.ceil(answer.length / 4),
      estimatedCostUsd: 0,
      estimatedCostInr: 0,
      latencyMs: Date.now() - started,
      cacheHit: false,
      ragUsed: true,
      safetyStatus: safety.status,
      status: "rag_only",
    });
    await logRetrieval({
      aiRequestId,
      query: request.message,
      normalizedQuery: normalized,
      classLevel: request.classLevel,
      subject: request.subject,
      chapterSlug: request.chapterSlug,
      topicSlug: request.topicSlug,
      retrievalMethod: retrieval.method,
      topK: Number(process.env.RAG_TOP_K || 6),
      returnedChunkIds: retrieval.chunks.map((chunk) => chunk.id),
      selectedChunkIds: selectedChunks.map((chunk) => chunk.id),
      scores: selectedChunks.map((chunk) => chunk.score),
    });
    await saveConversationMessages({
      conversationId,
      userMessage: request.message,
      assistantMessage: answer,
      metadata: { aiRequestId, source: "rag_only" },
    });
    return buildBaseResponse({
      answer,
      conversationId,
      provider: "rag",
      model: "keyword-local",
      source: "rag",
      mode,
      intent,
      citations,
      cacheHit: false,
      ragUsed: true,
      safetyStatus: safety.status,
      remaining: limit.remaining ?? undefined,
      limit,
    });
  }

  await detectAndLogMisconceptions(request).catch(() => []);
  const systemPrompt = buildMasterAlchemPrompt({
    classLevel: request.classLevel,
    mode,
    context,
    citations,
  });
  const userPrompt = `Student question:\n${request.message}`;
  const messages = [
    { role: "system" as const, content: systemPrompt },
    { role: "user" as const, content: userPrompt },
  ];

  try {
    const routeMode = mode === "step_by_step" && intent !== "unsafe_chemistry" ? "hard_reasoning" : intent;
    const response = await routeChatCompletion({
      mode: routeMode,
      messages,
      responseFormat: intent === "check_my_answer" ? "json" : "text",
      maxOutputTokens: mode === "exam_mode" || mode === "step_by_step" ? 1200 : 850,
    });
    const answer = formatAnswerWithCitations(response.content, citations);
    const aiRequestId = await logAiRequest({
      conversationId,
      userId: request.userId,
      anonymousId: request.anonymousId,
      endpoint: "/api/master-alchem/chat",
      intent,
      mode,
      provider: response.provider,
      model: response.model,
      promptHash: hashText(`${systemPrompt}\n${userPrompt}`),
      inputChars: systemPrompt.length + userPrompt.length,
      outputChars: answer.length,
      estimatedInputTokens: response.inputTokens ?? estimateMessagesTokens(messages),
      estimatedOutputTokens: response.outputTokens ?? Math.ceil(answer.length / 4),
      estimatedCostUsd: response.estimatedCostUsd,
      estimatedCostInr: response.estimatedCostInr,
      latencyMs: response.latencyMs,
      cacheHit: false,
      ragUsed: selectedChunks.length > 0,
      fallbackUsed: response.fallbackUsed,
      safetyStatus: safety.status,
      status: "ok",
    });
    await logRetrieval({
      aiRequestId,
      query: request.message,
      normalizedQuery: normalized,
      classLevel: request.classLevel,
      subject: request.subject,
      chapterSlug: request.chapterSlug,
      topicSlug: request.topicSlug,
      retrievalMethod: retrieval.method,
      topK: Number(process.env.RAG_TOP_K || 6),
      returnedChunkIds: retrieval.chunks.map((chunk) => chunk.id),
      selectedChunkIds: selectedChunks.map((chunk) => chunk.id),
      scores: selectedChunks.map((chunk) => chunk.score),
    });
    await saveConversationMessages({
      conversationId,
      userMessage: request.message,
      assistantMessage: answer,
      metadata: { aiRequestId, provider: response.provider, model: response.model, ragUsed: selectedChunks.length > 0 },
    });
    if (mode !== "check_my_answer" && safety.status === "safe") {
      await saveCachedAnswer({
        cacheKey,
        question: request.message,
        classLevel: request.classLevel,
        subject: request.subject,
        chapterSlug: request.chapterSlug,
        topicSlug: request.topicSlug,
        mode,
        answer,
        citations,
        provider: response.provider,
        model: response.model,
        ragChunkIds: selectedChunks.map((chunk) => chunk.id),
      }).catch(() => undefined);
      if (!selectedChunks.length) {
        await saveCachedAnswer({
          cacheKey: simpleCacheKey,
          question: request.message,
          classLevel: request.classLevel,
          subject: request.subject,
          chapterSlug: request.chapterSlug,
          topicSlug: request.topicSlug,
          mode,
          answer,
          citations,
          provider: response.provider,
          model: response.model,
          ragChunkIds: [],
        }).catch(() => undefined);
      }
    }
    return buildBaseResponse({
      answer,
      conversationId,
      provider: response.provider,
      model: response.model,
      source: sourceForProvider(response.provider),
      mode,
      intent,
      citations,
      cacheHit: false,
      ragUsed: selectedChunks.length > 0,
      safetyStatus: safety.status,
      remaining: limit.remaining ?? undefined,
      mock: response.provider === "mock",
      estimatedCostInr: response.estimatedCostInr,
      limit,
    });
  } catch (error) {
    if (!(error instanceof AiBudgetExceededError)) throw error;
    const fallbackAnswer = formatAnswerWithCitations(buildRagOnlyAnswer({ chunks: selectedChunks, budgetBlocked: true }), citations);
    const aiRequestId = await logAiRequest({
      conversationId,
      userId: request.userId,
      anonymousId: request.anonymousId,
      endpoint: "/api/master-alchem/chat",
      intent,
      mode,
      provider: "budget_guard",
      model: "local-rag-fallback",
      promptHash: hashText(`${systemPrompt}\n${userPrompt}`),
      inputChars: systemPrompt.length + userPrompt.length,
      outputChars: fallbackAnswer.length,
      estimatedInputTokens: estimateMessagesTokens(messages),
      estimatedOutputTokens: Math.ceil(fallbackAnswer.length / 4),
      estimatedCostUsd: 0,
      estimatedCostInr: 0,
      latencyMs: Date.now() - started,
      cacheHit: false,
      ragUsed: selectedChunks.length > 0,
      fallbackUsed: true,
      blockedByBudget: true,
      safetyStatus: safety.status,
      status: "budget_blocked",
      errorMessage: error.message,
    });
    await logRetrieval({
      aiRequestId,
      query: request.message,
      normalizedQuery: normalized,
      classLevel: request.classLevel,
      subject: request.subject,
      chapterSlug: request.chapterSlug,
      topicSlug: request.topicSlug,
      retrievalMethod: retrieval.method,
      topK: Number(process.env.RAG_TOP_K || 6),
      returnedChunkIds: retrieval.chunks.map((chunk) => chunk.id),
      selectedChunkIds: selectedChunks.map((chunk) => chunk.id),
      scores: selectedChunks.map((chunk) => chunk.score),
    });
    await saveConversationMessages({
      conversationId,
      userMessage: request.message,
      assistantMessage: fallbackAnswer,
      metadata: { aiRequestId, source: "budget_guard", blockedByBudget: true },
    });
    await recordRagOnlyAnswer();
    return buildBaseResponse({
      answer: fallbackAnswer,
      conversationId,
      provider: "budget_guard",
      model: "local-rag-fallback",
      source: selectedChunks.length ? "rag" : "fallback",
      mode,
      intent,
      citations,
      cacheHit: false,
      ragUsed: selectedChunks.length > 0,
      safetyStatus: safety.status,
      remaining: limit.remaining ?? undefined,
      estimatedCostInr: 0,
      limit,
    });
  }
}
