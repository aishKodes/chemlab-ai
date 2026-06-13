import { getEmbedding } from "./embeddingService";
import { keywordSearchFallback } from "@/lib/rag/keywordSearch";
import { retrieveKnowledge } from "@/lib/rag/retrieval";

export async function retrieveRagContext({
  query,
  classLevel,
  subject,
  chapterSlug,
  topicSlug,
}: {
  query: string;
  classLevel?: string;
  subject?: string;
  chapterSlug?: string;
  topicSlug?: string;
}) {
  if (process.env.RAG_ENABLED === "false") {
    return { chunks: [], method: "rag_disabled" };
  }
  const topK = Number(process.env.RAG_TOP_K || 6);
  if (process.env.RAG_USE_VECTOR_SEARCH !== "true") {
    return {
      chunks: await keywordSearchFallback({
        query,
        classLevel,
        subject,
        chapterSlug,
        topicSlug,
        limit: topK,
      }),
      method: "keyword",
    };
  }
  const embedding = await getEmbedding(query);
  return retrieveKnowledge({
    query,
    embedding: embedding.embedding,
    embeddingProvider: embedding.provider,
    embeddingModel: embedding.model,
    classLevel,
    subject,
    chapterSlug,
    topicSlug,
  });
}
