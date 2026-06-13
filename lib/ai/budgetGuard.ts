import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type BudgetRow = {
  date: string;
  budget_inr: number;
  used_inr: number;
  used_usd: number;
  ai_requests_count: number;
  voice_requests_count: number;
  cache_hits: number;
  rag_only_answers: number;
  blocked_requests: number;
};

export type BudgetCheck = {
  allowed: boolean;
  warning: boolean;
  reason?: string;
  date: string;
  budgetInr: number;
  usedInr: number;
  estimatedCostInr: number;
  remainingInr: number;
};

const memoryBudget = new Map<string, BudgetRow>();

function today() {
  return new Date().toISOString().slice(0, 10);
}

export function usdToInr(usd: number) {
  return usd * Number(process.env.AI_USD_TO_INR || 90);
}

function defaults(date = today()): BudgetRow {
  return {
    date,
    budget_inr: Number(process.env.DAILY_AI_BUDGET_INR || 50),
    used_inr: 0,
    used_usd: 0,
    ai_requests_count: 0,
    voice_requests_count: 0,
    cache_hits: 0,
    rag_only_answers: 0,
    blocked_requests: 0,
  };
}

async function readBudget(): Promise<BudgetRow> {
  const date = today();
  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    if (!memoryBudget.has(date)) memoryBudget.set(date, defaults(date));
    return memoryBudget.get(date) ?? defaults(date);
  }
  try {
    const existing = await supabase.from("ai_daily_budget").select("*").eq("date", date).maybeSingle();
    if (existing.data) return existing.data as BudgetRow;
    const created = defaults(date);
    await supabase.from("ai_daily_budget").upsert(created, { onConflict: "date" });
    return created;
  } catch {
    if (!memoryBudget.has(date)) memoryBudget.set(date, defaults(date));
    return memoryBudget.get(date) ?? defaults(date);
  }
}

async function writeBudget(row: BudgetRow) {
  const supabase = createSupabaseAdminClient();
  memoryBudget.set(row.date, row);
  if (!supabase) return;
  try {
    await supabase.from("ai_daily_budget").upsert({ ...row, updated_at: new Date().toISOString() }, { onConflict: "date" });
  } catch {
    // Keep the in-memory guard active if the migration has not been applied yet.
  }
}

export async function checkBudget(estimatedCostUsd: number): Promise<BudgetCheck> {
  if (process.env.AI_COST_GUARD_ENABLED === "false") {
    const row = await readBudget();
    const cost = usdToInr(estimatedCostUsd);
    return {
      allowed: true,
      warning: false,
      date: row.date,
      budgetInr: row.budget_inr,
      usedInr: row.used_inr,
      estimatedCostInr: cost,
      remainingInr: Math.max(0, row.budget_inr - row.used_inr),
    };
  }
  const row = await readBudget();
  const estimatedCostInr = usdToInr(estimatedCostUsd);
  const nextUsed = row.used_inr + estimatedCostInr;
  const allowed = process.env.STOP_AI_WHEN_BUDGET_EXCEEDED === "false" || nextUsed <= row.budget_inr;
  const warnAt = row.budget_inr * (Number(process.env.WARN_AI_BUDGET_PERCENT || 80) / 100);
  return {
    allowed,
    warning: nextUsed >= warnAt,
    reason: allowed ? undefined : "daily_ai_budget_exceeded",
    date: row.date,
    budgetInr: row.budget_inr,
    usedInr: row.used_inr,
    estimatedCostInr,
    remainingInr: Math.max(0, row.budget_inr - row.used_inr),
  };
}

export async function recordAiSpend(costUsd: number) {
  const row = await readBudget();
  const costInr = usdToInr(costUsd);
  await writeBudget({
    ...row,
    used_usd: Number(row.used_usd || 0) + costUsd,
    used_inr: Number(row.used_inr || 0) + costInr,
    ai_requests_count: Number(row.ai_requests_count || 0) + 1,
  });
}

export async function recordVoiceSpend(costInr: number) {
  const row = await readBudget();
  await writeBudget({
    ...row,
    used_inr: Number(row.used_inr || 0) + costInr,
    voice_requests_count: Number(row.voice_requests_count || 0) + 1,
  });
}

export async function recordBudgetBlocked() {
  const row = await readBudget();
  await writeBudget({ ...row, blocked_requests: Number(row.blocked_requests || 0) + 1 });
}

export async function recordCacheHit() {
  const row = await readBudget();
  await writeBudget({ ...row, cache_hits: Number(row.cache_hits || 0) + 1 });
}

export async function recordRagOnlyAnswer() {
  const row = await readBudget();
  await writeBudget({ ...row, rag_only_answers: Number(row.rag_only_answers || 0) + 1 });
}

export async function getBudgetSnapshot() {
  const row = await readBudget();
  return {
    date: row.date,
    budgetInr: Number(row.budget_inr || 0),
    usedInr: Number(row.used_inr || 0),
    usedUsd: Number(row.used_usd || 0),
    remainingInr: Math.max(0, Number(row.budget_inr || 0) - Number(row.used_inr || 0)),
    aiRequests: Number(row.ai_requests_count || 0),
    voiceRequests: Number(row.voice_requests_count || 0),
    cacheHits: Number(row.cache_hits || 0),
    ragOnlyAnswers: Number(row.rag_only_answers || 0),
    blockedRequests: Number(row.blocked_requests || 0),
  };
}
