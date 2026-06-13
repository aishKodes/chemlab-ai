import { ingestNcertFolder } from "@/lib/rag/ncertIngestion";

export async function POST() {
  const result = await ingestNcertFolder();
  return Response.json(result);
}
