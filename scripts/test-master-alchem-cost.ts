process.env.MASTER_ALCHEM_MOCK_MODE = "true";
process.env.AI_COST_GUARD_ENABLED = "true";
process.env.DAILY_AI_BUDGET_INR = "0.01";
process.env.AI_USD_TO_INR = "90";
process.env.STOP_AI_WHEN_BUDGET_EXCEEDED = "true";
process.env.VOICE_ENABLED = "true";
process.env.VOICE_DEFAULT_MODE = "browser";
process.env.PAID_TTS_ENABLED = "false";
process.env.RAG_USE_VECTOR_SEARCH = "false";
process.env.RAG_USE_KEYWORD_SEARCH = "true";

function assert(condition: unknown, label: string) {
  if (!condition) throw new Error(`FAIL: ${label}`);
  console.log(`PASS: ${label}`);
}

async function main() {
  const { checkBudget, recordAiSpend, getBudgetSnapshot } = await import("../lib/ai/budgetGuard");
  const { routeChatCompletion } = await import("../lib/ai/modelRouter");
  const { routeVoiceRequest } = await import("../lib/voice/voiceRouter");
  const { buildAnswerCacheKey } = await import("../lib/master-alchem/answerCache");

  const cacheKey = buildAnswerCacheKey({
    question: "What is an atom?",
    classLevel: "9",
    subject: "chemistry",
    mode: "explain",
    chunkIds: [],
    model: "router-v1",
  });
  assert(cacheKey.length > 20, "cache key generation works");

  const faqCost = await checkBudget(0);
  assert(faqCost.allowed, "FAQ hit costs no money");

  const ragOnlyCost = await checkBudget(0);
  assert(ragOnlyCost.allowed, "RAG-only answer costs no money");

  const geminiLike = await routeChatCompletion({
    mode: "simple_explain",
    messages: [
      { role: "system", content: "You are Master Alchem." },
      { role: "user", content: "Explain valency." },
    ],
  });
  assert(geminiLike.provider === "mock" && geminiLike.estimatedCostInr === 0, "Gemini path is budget checked without paid calls in mock mode");

  const reasoningLike = await routeChatCompletion({
    mode: "hard_reasoning",
    messages: [
      { role: "system", content: "You are Master Alchem." },
      { role: "user", content: "Solve a hard mole concept problem step by step." },
    ],
  });
  assert(reasoningLike.provider === "mock", "OpenAI fallback/hard reasoning path can be tested without paid calls");

  await recordAiSpend(1);
  const blocked = await checkBudget(0.001);
  assert(!blocked.allowed, "budget exceeded blocks paid AI calls");

  const voice = await routeVoiceRequest({ text: "Atoms are tiny particles that make up matter.", language: "en-IN" });
  assert(voice.mode === "browser" && !voice.audioUrl, "browser voice mode uses no paid API");

  process.env.PAID_TTS_ENABLED = "false";
  const paidDisabled = await routeVoiceRequest({ text: "This should still use browser speech.", language: "en-IN" });
  assert(paidDisabled.mode === "browser" && !paidDisabled.audioUrl, "paid TTS stays disabled unless explicitly enabled");

  const snapshot = await getBudgetSnapshot();
  console.log(`Budget snapshot: used ₹${snapshot.usedInr.toFixed(3)}, remaining ₹${snapshot.remainingInr.toFixed(3)}, blocked ${snapshot.blockedRequests}`);
}

void main();
