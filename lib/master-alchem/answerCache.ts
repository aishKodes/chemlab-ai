import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { hashText, normalizeQuestion } from "./faqMatcher";
import type { MasterAlchemMode, RagCitation } from "./types";

export function buildAnswerCacheKey({
  question,
  classLevel,
  subject,
  chapterSlug,
  topicSlug,
  mode,
  chunkIds,
  model,
}: {
  question: string;
  classLevel?: string;
  subject?: string;
  chapterSlug?: string;
  topicSlug?: string;
  mode: MasterAlchemMode;
  chunkIds: string[];
  model: string;
}) {
  return hashText(
    JSON.stringify({
      q: normalizeQuestion(question),
      classLevel: classLevel ?? "",
      subject: subject ?? "chemistry",
      chapterSlug: chapterSlug ?? "",
      topicSlug: topicSlug ?? "",
      mode,
      chunkIds,
      model,
    }),
  );
}

export async function getCachedAnswer(cacheKey: string) {
  if (process.env.AI_CACHE_ENABLED === "false") return null;
  const supabase = createSupabaseAdminClient();
  if (!supabase) return null;
  const { data } = await supabase
    .from("ai_answer_cache")
    .select("*")
    .eq("cache_key", cacheKey)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();
  if (!data) return null;
  await supabase
    .from("ai_answer_cache")
    .update({ hit_count: Number(data.hit_count ?? 0) + 1, updated_at: new Date().toISOString() })
    .eq("id", data.id);
  return data;
}

export async function saveCachedAnswer({
  cacheKey,
  question,
  classLevel,
  subject,
  chapterSlug,
  topicSlug,
  mode,
  answer,
  citations,
  provider,
  model,
  ragChunkIds,
}: {
  cacheKey: string;
  question: string;
  classLevel?: string;
  subject?: string;
  chapterSlug?: string;
  topicSlug?: string;
  mode: MasterAlchemMode;
  answer: string;
  citations: RagCitation[];
  provider: string;
  model: string;
  ragChunkIds: string[];
}) {
  if (process.env.AI_CACHE_ENABLED === "false") return;
  const supabase = createSupabaseAdminClient();
  if (!supabase) return;
  const ttlDays = Number(process.env.AI_CACHE_TTL_DAYS || 30);
  const expiresAt = new Date(Date.now() + ttlDays * 24 * 60 * 60 * 1000).toISOString();
  await supabase.from("ai_answer_cache").upsert(
    {
      cache_key: cacheKey,
      normalized_question: normalizeQuestion(question),
      question_hash: hashText(normalizeQuestion(question)),
      class_level: classLevel,
      subject: subject ?? "chemistry",
      chapter_slug: chapterSlug,
      topic_slug: topicSlug,
      mode,
      answer,
      citations,
      provider,
      model,
      rag_chunk_ids: ragChunkIds,
      expires_at: expiresAt,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "cache_key" },
  );
}
