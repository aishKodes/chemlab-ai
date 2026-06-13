import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { activeEmbeddingConfig } from "@/lib/ai/modelRouter";

export async function enqueueMissingEmbeddings(limit = 500) {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return { queued: 0, reason: "Supabase not configured" };
  const config = activeEmbeddingConfig();
  const { data } = await supabase
    .from("knowledge_chunks")
    .select("id")
    .or(`embedding_provider.is.null,embedding_model.neq.${config.model}`)
    .limit(limit);
  return { queued: data?.length ?? 0, provider: config.provider, model: config.model };
}
