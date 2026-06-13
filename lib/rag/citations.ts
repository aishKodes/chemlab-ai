import type { RagChunk, RagCitation } from "@/lib/master-alchem/types";

export function citationFromChunk(chunk: RagChunk): RagCitation {
  return {
    label:
      chunk.sourceCitation ||
      `${chunk.classLevel ? `NCERT Class ${chunk.classLevel}` : "NCERT"} ${chunk.subject || "Chemistry"}${chunk.chapterSlug ? ` - ${chunk.chapterSlug}` : ""}`,
    sourceType: String(chunk.metadata?.source_type || "ncert"),
    classLevel: chunk.classLevel,
    subject: chunk.subject,
    chapterSlug: chunk.chapterSlug,
    pageStart: chunk.pageStart,
    pageEnd: chunk.pageEnd,
  };
}

export function citationsFromChunks(chunks: RagChunk[]) {
  return chunks.map(citationFromChunk);
}
