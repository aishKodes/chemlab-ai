import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getAiUsageOverview } from "./aiUsage";
import { getLearningOverview } from "./learningAnalytics";

async function countTable(table: string) {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return 0;
  const { count } = await supabase.from(table).select("id", { count: "exact", head: true });
  return count ?? 0;
}

export async function getAdminAnalyticsOverview() {
  const [ai, learning, chunks, unanswered, conversations] = await Promise.all([
    getAiUsageOverview(),
    getLearningOverview(),
    countTable("knowledge_chunks"),
    countTable("unanswered_questions"),
    countTable("master_alchem_conversations"),
  ]);
  return { ai, learning, chunks, unanswered, conversations };
}
