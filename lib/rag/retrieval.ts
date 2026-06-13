import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { RagChunk } from "@/lib/master-alchem/types";
import { keywordSearchFallback } from "./keywordSearch";

export function cosineSimilarity(a: number[], b: number[]) {
  const length = Math.min(a.length, b.length);
  if (!length) return 0;
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < length; i += 1) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return normA && normB ? dot / (Math.sqrt(normA) * Math.sqrt(normB)) : 0;
}

export async function retrieveKnowledge({
  query,
  embedding,
  embeddingProvider,
  embeddingModel,
  classLevel,
  subject = "chemistry",
  chapterSlug,
  topicSlug,
}: {
  query: string;
  embedding: number[];
  embeddingProvider: string;
  embeddingModel: string;
  classLevel?: string;
  subject?: string;
  chapterSlug?: string;
  topicSlug?: string;
}) {
  const topK = Number(process.env.RAG_TOP_K || 8);
  const minSimilarity = Number(process.env.RAG_MIN_SIMILARITY || 0.72);
  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return { chunks: [], method: "fallback_no_db" };
  }
  let dbQuery = supabase
    .from("knowledge_chunks")
    .select("id,title,chunk_text,clean_text,page_start,page_end,source_citation,class_level,subject,chapter_slug,metadata,embedding_json")
    .eq("status", "active")
    .eq("embedding_provider", embeddingProvider)
    .eq("embedding_model", embeddingModel)
    .eq("subject", subject)
    .limit(250);
  if (classLevel) dbQuery = dbQuery.eq("class_level", classLevel);
  if (chapterSlug) dbQuery = dbQuery.eq("chapter_slug", chapterSlug);
  if (topicSlug) dbQuery = dbQuery.eq("topic_slug", topicSlug);
  const { data, error } = await dbQuery;
  if (error || !data?.length) {
    const chunks = await keywordSearchFallback({ query, classLevel, subject, chapterSlug, topicSlug, limit: topK });
    return { chunks, method: "keyword" };
  }
  const chunks = data
    .map((row) => {
      const stored = Array.isArray(row.embedding_json) ? (row.embedding_json as number[]) : [];
      const score = stored.length ? cosineSimilarity(embedding, stored) : 0;
      return {
        id: row.id,
        title: row.title,
        chunkText: row.chunk_text,
        cleanText: row.clean_text,
        pageStart: row.page_start,
        pageEnd: row.page_end,
        sourceCitation: row.source_citation,
        classLevel: row.class_level,
        subject: row.subject,
        chapterSlug: row.chapter_slug,
        metadata: row.metadata || {},
        score,
      } satisfies RagChunk;
    })
    .filter((chunk) => chunk.score >= minSimilarity)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
  if (!chunks.length && process.env.RAG_ENABLE_KEYWORD_FALLBACK !== "false") {
    return {
      chunks: await keywordSearchFallback({ query, classLevel, subject, chapterSlug, topicSlug, limit: topK }),
      method: "keyword",
    };
  }
  return { chunks, method: "vector" };
}
