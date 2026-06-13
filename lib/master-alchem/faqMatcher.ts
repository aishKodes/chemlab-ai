import crypto from "node:crypto";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { routeEmbedding } from "@/lib/ai/modelRouter";
import { cosineSimilarity } from "@/lib/rag/retrieval";

export function normalizeQuestion(question: string) {
  return question
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s+-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function hashText(text: string) {
  return crypto.createHash("sha256").update(text).digest("hex");
}

export async function matchFaq({
  question,
  classLevel,
  chapterSlug,
}: {
  question: string;
  classLevel?: string;
  chapterSlug?: string;
}) {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return null;
  const normalized = normalizeQuestion(question);
  const exact = await supabase
    .from("master_alchem_faqs")
    .select("*")
    .eq("status", "verified")
    .eq("normalized_question", normalized)
    .maybeSingle();
  if (exact.data) return { faq: exact.data, confidence: 1, method: "faq_exact" as const };

  let query = supabase.from("master_alchem_faqs").select("*").eq("status", "verified").limit(25);
  if (classLevel) query = query.eq("class_level", classLevel);
  if (chapterSlug) query = query.eq("chapter_slug", chapterSlug);
  const keyword = await query;
  const rows = keyword.data ?? [];
  const tagMatch = rows.find((row) => {
    const haystack = `${row.question ?? ""} ${(row.tags ?? []).join(" ")} ${(row.alternate_questions ?? []).join(" ")}`.toLowerCase();
    return normalized.split(" ").filter((word) => word.length > 3).some((word) => haystack.includes(word));
  });
  if (tagMatch) return { faq: tagMatch, confidence: 0.82, method: "faq_keyword" as const };

  if (process.env.FAQ_SEMANTIC_SEARCH !== "true" && process.env.RAG_USE_VECTOR_SEARCH !== "true") {
    return null;
  }

  try {
    const embedding = await routeEmbedding(normalized);
    const { data } = await supabase
      .from("faq_embeddings")
      .select("faq_id, question_text, embedding_json, master_alchem_faqs(*)")
      .eq("embedding_provider", embedding.provider)
      .eq("embedding_model", embedding.model)
      .limit(40);
    const best = (data ?? [])
      .map((row) => {
        const stored = Array.isArray(row.embedding_json) ? row.embedding_json : [];
        return { row, score: stored.length ? cosineSimilarity(embedding.embedding, stored as number[]) : 0 };
      })
      .sort((a, b) => b.score - a.score)[0];
    if (best && best.score >= 0.86) {
      return { faq: best.row.master_alchem_faqs, confidence: best.score, method: "faq_semantic" as const };
    }
  } catch {
    return null;
  }
  return null;
}
