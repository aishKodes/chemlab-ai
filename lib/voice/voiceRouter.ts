import { checkBudget, getBudgetSnapshot, recordBudgetBlocked, recordVoiceSpend } from "@/lib/ai/budgetGuard";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { browserVoiceInstruction } from "./browserVoiceHelper";
import { generatePaidTts } from "./paidTtsProvider";
import { buildSpokenScript } from "./spokenScriptBuilder";
import { getVoiceCache, saveVoiceCache, textHash, voiceCacheKey } from "./voiceCache";

async function logVoiceGeneration(payload: {
  provider: string;
  voiceName: string;
  language: string;
  text: string;
  estimatedCostInr: number;
  cacheHit: boolean;
  blockedByBudget: boolean;
  audioUrl?: string | null;
  status: string;
  errorMessage?: string;
}) {
  const supabase = createSupabaseAdminClient();
  if (!supabase || process.env.ANALYTICS_ENABLED === "false") return;
  await supabase.from("voice_generations").insert({
    provider: payload.provider,
    voice_name: payload.voiceName,
    language: payload.language,
    text_hash: textHash(payload.text),
    estimated_cost_inr: payload.estimatedCostInr,
    cache_hit: payload.cacheHit,
    blocked_by_budget: payload.blockedByBudget,
    audio_url: payload.audioUrl || null,
    status: payload.status,
    error_message: payload.errorMessage || null,
  });
}

export async function routeVoiceRequest({
  text,
  language = "en-IN",
  voiceName = "master-alchem",
}: {
  text: string;
  language?: string;
  voiceName?: string;
}) {
  const spokenText = buildSpokenScript(text);
  if (process.env.VOICE_ENABLED === "false") {
    await logVoiceGeneration({ provider: "none", voiceName, language, text: spokenText, estimatedCostInr: 0, cacheHit: false, blockedByBudget: false, audioUrl: null, status: "disabled" });
    return { mode: "off" as const, text: spokenText, audioUrl: null, estimatedCostInr: 0, budgetRemainingInr: (await getBudgetSnapshot()).remainingInr };
  }

  if (process.env.VOICE_DEFAULT_MODE !== "paid" || process.env.PAID_TTS_ENABLED !== "true") {
    const budget = await getBudgetSnapshot();
    await logVoiceGeneration({ provider: "browser", voiceName, language, text: spokenText, estimatedCostInr: 0, cacheHit: false, blockedByBudget: false, audioUrl: null, status: "browser_instruction" });
    return { ...browserVoiceInstruction(spokenText, language), audioUrl: null, estimatedCostInr: 0, budgetRemainingInr: budget.remainingInr };
  }

  const provider = "paid-tts";
  const cacheKey = voiceCacheKey({ text: spokenText, provider, voiceName, language });
  const cached = await getVoiceCache(cacheKey);
  if (cached?.audio_url) {
    const budget = await getBudgetSnapshot();
    await logVoiceGeneration({ provider, voiceName, language, text: spokenText, estimatedCostInr: 0, cacheHit: true, blockedByBudget: false, audioUrl: cached.audio_url, status: "cache_hit" });
    return { mode: "paid" as const, provider, text: spokenText, audioUrl: cached.audio_url, cacheHit: true, estimatedCostInr: 0, budgetRemainingInr: budget.remainingInr };
  }

  const estimatedCostInr = Math.min(Number(process.env.VOICE_DAILY_BUDGET_INR || 10), Math.max(0.5, spokenText.length / 1200));
  const budget = await checkBudget(estimatedCostInr / Number(process.env.AI_USD_TO_INR || 90));
  if (!budget.allowed || Number(process.env.VOICE_DAILY_BUDGET_INR || 10) <= 0) {
    await recordBudgetBlocked();
    await logVoiceGeneration({ provider, voiceName, language, text: spokenText, estimatedCostInr, cacheHit: false, blockedByBudget: true, audioUrl: null, status: "blocked_by_budget" });
    return { ...browserVoiceInstruction(spokenText, language), audioUrl: null, blockedByBudget: true, estimatedCostInr: 0, budgetRemainingInr: budget.remainingInr };
  }

  const result = await generatePaidTts();
  await recordVoiceSpend(result.estimatedCostInr);
  await saveVoiceCache({ cacheKey, text: spokenText, provider, voiceName, language, audioUrl: result.audioUrl });
  await logVoiceGeneration({ provider, voiceName, language, text: spokenText, estimatedCostInr: result.estimatedCostInr, cacheHit: false, blockedByBudget: false, audioUrl: result.audioUrl, status: "generated" });
  const snapshot = await getBudgetSnapshot();
  return { mode: "paid" as const, provider, text: spokenText, audioUrl: result.audioUrl, cacheHit: false, estimatedCostInr: result.estimatedCostInr, budgetRemainingInr: snapshot.remainingInr };
}
