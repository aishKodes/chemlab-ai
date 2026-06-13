import fs from "node:fs/promises";
import { createSupabaseAdminClient } from "../lib/supabase/admin";
import { normalizeQuestion } from "../lib/master-alchem/faqMatcher";

async function main() {
  const supabase = createSupabaseAdminClient();
  if (!supabase) throw new Error("Supabase admin env is not configured.");
  const raw = await fs.readFile("data/master-alchem/faqs.json", "utf8");
  const faqs = JSON.parse(raw) as Array<Record<string, unknown>>;
  const rows = faqs.map((faq) => ({
    ...faq,
    normalized_question: String(faq.normalized_question || normalizeQuestion(String(faq.question || ""))),
    last_reviewed_at: new Date().toISOString(),
  }));
  const { error } = await supabase.from("master_alchem_faqs").upsert(rows, {
    onConflict: "normalized_question",
  });
  if (error) throw error;
  console.log(JSON.stringify({ seeded: rows.length }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
