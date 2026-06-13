import { enqueueMissingEmbeddings } from "@/lib/rag/embeddingQueue";

export async function POST() {
  return Response.json(await enqueueMissingEmbeddings());
}
