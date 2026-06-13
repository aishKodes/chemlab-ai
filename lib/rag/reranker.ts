import type { RagChunk } from "@/lib/master-alchem/types";

export function rerankChunks(query: string, chunks: RagChunk[]) {
  const terms = new Set(query.toLowerCase().split(/\W+/).filter((term) => term.length > 3));
  return chunks
    .map((chunk) => {
      const text = `${chunk.title} ${chunk.cleanText || chunk.chunkText}`.toLowerCase();
      let overlap = 0;
      terms.forEach((term) => {
        if (text.includes(term)) overlap += 1;
      });
      return { ...chunk, score: chunk.score + overlap * 0.03 };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, Number(process.env.RAG_RERANK_TOP_K || 4));
}
