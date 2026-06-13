import { createSupabaseAdminClient } from "../lib/supabase/admin";
import { activeEmbeddingConfig } from "../lib/ai/modelRouter";

async function main() {
  const supabase = createSupabaseAdminClient();
  if (!supabase) throw new Error("Supabase admin env is not configured.");
  const config = activeEmbeddingConfig();
  const clear = process.argv.includes("--clear");
  if (clear) {
    await supabase
      .from("knowledge_chunks")
      .update({
        embedding_provider: null,
        embedding_model: null,
        embedding_dimension: null,
        embedding_json: null,
      })
      .eq("embedding_provider", config.provider)
      .eq("embedding_model", config.model);
  }
  console.log(
    JSON.stringify(
      {
        provider: config.provider,
        model: config.model,
        cleared: clear,
        next: "Run: npx tsx scripts/embed-knowledge.ts",
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
