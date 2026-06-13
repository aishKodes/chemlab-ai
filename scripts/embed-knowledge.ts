import { createSupabaseAdminClient } from "../lib/supabase/admin";
import { activeEmbeddingConfig, routeEmbedding } from "../lib/ai/modelRouter";

async function main() {
  const supabase = createSupabaseAdminClient();
  if (!supabase) throw new Error("Supabase admin env is not configured.");
  const config = activeEmbeddingConfig();
  const limit = Number(process.argv[2] || 100);
  const { data, error } = await supabase
    .from("knowledge_chunks")
    .select("id, clean_text, chunk_text")
    .or(`embedding_provider.is.null,embedding_model.neq.${config.model}`)
    .limit(limit);
  if (error) throw error;
  let embedded = 0;
  for (const chunk of data ?? []) {
    const text = chunk.clean_text || chunk.chunk_text;
    const result = await routeEmbedding(text);
    await supabase
      .from("knowledge_chunks")
      .update({
        embedding_provider: result.provider,
        embedding_model: result.model,
        embedding_dimension: result.dimension,
        embedding_json: result.embedding,
        updated_at: new Date().toISOString(),
      })
      .eq("id", chunk.id);
    embedded += 1;
    console.log(`embedded ${embedded}/${data?.length ?? 0}: ${chunk.id}`);
  }
  console.log(JSON.stringify({ embedded, provider: config.provider, model: config.model }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
