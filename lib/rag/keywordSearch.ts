import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { RagChunk } from "@/lib/master-alchem/types";

export async function keywordSearchFallback({
  query,
  classLevel,
  subject = "chemistry",
  chapterSlug,
  topicSlug,
  limit = 8,
}: {
  query: string;
  classLevel?: string;
  subject?: string;
  chapterSlug?: string;
  topicSlug?: string;
  limit?: number;
}): Promise<RagChunk[]> {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return [];
  const terms = query
    .toLowerCase()
    .split(/\W+/)
    .filter((term) => term.length > 3)
    .slice(0, 8);
  let dbQuery = supabase
    .from("knowledge_chunks")
    .select("id,title,chunk_text,clean_text,page_start,page_end,source_citation,class_level,subject,chapter_slug,metadata")
    .eq("status", "active")
    .eq("subject", subject)
    .limit(100);
  if (classLevel) dbQuery = dbQuery.eq("class_level", classLevel);
  if (chapterSlug) dbQuery = dbQuery.eq("chapter_slug", chapterSlug);
  if (topicSlug) dbQuery = dbQuery.eq("topic_slug", topicSlug);
  const { data } = await dbQuery;
  return (data ?? [])
    .map((row) => {
      const text = `${row.title ?? ""} ${row.clean_text ?? row.chunk_text ?? ""}`.toLowerCase();
      const score = terms.reduce((sum, term) => sum + (text.includes(term) ? 1 : 0), 0) / Math.max(1, terms.length);
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
    .filter((chunk) => chunk.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
