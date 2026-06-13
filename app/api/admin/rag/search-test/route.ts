import { z } from "zod";
import { retrieveRagContext } from "@/lib/master-alchem/ragRetriever";

const schema = z.object({
  query: z.string().min(1),
  classLevel: z.string().optional(),
  subject: z.string().default("chemistry"),
  chapterSlug: z.string().optional(),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Invalid search request." }, { status: 400 });
  return Response.json(await retrieveRagContext(parsed.data));
}
