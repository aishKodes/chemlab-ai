import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getBudgetSnapshot } from "@/lib/ai/budgetGuard";

export async function getAiUsageOverview() {
  const supabase = createSupabaseAdminClient();
  const budget = await getBudgetSnapshot();
  if (!supabase) {
    return {
      totalRequests: 0,
      totalCost: 0,
      totalCostInr: budget.usedInr,
      budget,
      cacheHitRate: 0,
      modelSplit: [],
      blockedByBudget: budget.blockedRequests,
      ragOnlyAnswers: budget.ragOnlyAnswers,
      voiceRequests: budget.voiceRequests,
    };
  }
  const { data } = await supabase
    .from("ai_requests")
    .select("provider,model,estimated_cost_usd,cost_inr_est,cache_hit,status,blocked_by_budget,rag_used")
    .order("created_at", { ascending: false })
    .limit(1000);
  const rows = data ?? [];
  const totalCost = rows.reduce((sum, row) => sum + Number(row.estimated_cost_usd || 0), 0);
  const totalCostInr = rows.reduce((sum, row) => sum + Number(row.cost_inr_est || 0), 0);
  const cacheHits = rows.filter((row) => row.cache_hit).length;
  const blockedByBudget = rows.filter((row) => row.blocked_by_budget).length;
  const ragOnlyAnswers = rows.filter((row) => row.provider === "rag" || row.status === "rag_only").length;
  const modelMap = new Map<string, number>();
  rows.forEach((row) => {
    const key = `${row.provider || "unknown"}:${row.model || "unknown"}`;
    modelMap.set(key, (modelMap.get(key) ?? 0) + 1);
  });
  return {
    totalRequests: rows.length,
    totalCost,
    totalCostInr,
    budget,
    cacheHitRate: rows.length ? cacheHits / rows.length : 0,
    blockedByBudget,
    ragOnlyAnswers,
    voiceRequests: budget.voiceRequests,
    modelSplit: Array.from(modelMap.entries()).map(([model, count]) => ({ model, count })),
  };
}
