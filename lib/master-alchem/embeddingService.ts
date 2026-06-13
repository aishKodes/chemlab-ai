import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { activeEmbeddingConfig, routeEmbedding } from "@/lib/ai/modelRouter";
import { hashText } from "./faqMatcher";

export async function getEmbedding(text: string) {
  const config = activeEmbeddingConfig();
  const textHash = hashText(text);
  const supabase = createSupabaseAdminClient();
  if (supabase && process.env.EMBEDDING_CACHE_ENABLED !== "false") {
    const cached = await supabase
      .from("embedding_cache")
      .select("*")
      .eq("text_hash", textHash)
      .eq("provider", config.provider)
      .eq("model", config.model)
      .maybeSingle();
    if (cached.data?.embedding_json) {
      return {
        embedding: cached.data.embedding_json as number[],
        provider: config.provider,
        model: config.model,
        dimension: Number(cached.data.dimension ?? 0),
        latencyMs: 0,
      };
    }
  }
  const result = await routeEmbedding(text);
  if (supabase && process.env.EMBEDDING_CACHE_ENABLED !== "false") {
    await supabase.from("embedding_cache").upsert(
      {
        text_hash: textHash,
        text_preview: text.slice(0, 300),
        provider: result.provider,
        model: result.model,
        dimension: result.dimension,
        embedding_json: result.embedding,
      },
      { onConflict: "text_hash,provider,model" },
    );
  }
  return result;
}
