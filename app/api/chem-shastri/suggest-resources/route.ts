import { z } from "zod";
import { buildChemShastriContext } from "@/lib/chem-shastri/chemShastriContextBuilder";
import { retrieveChemShastriResources } from "@/lib/chem-shastri/chemShastriResourceRetriever";

export const dynamic = "force-dynamic";

const schema = z.object({
  query: z.string().min(1).max(1000),
  classLevel: z.enum(["8", "9", "10", "11", "12"]).optional(),
  role: z.enum(["anonymous", "student", "teacher", "admin"]).optional(),
  preferredLanguage: z.enum(["en", "hi", "bn", "or"]).optional(),
  currentPage: z.string().optional(),
  resourceSlug: z.string().optional(),
  simulationSlug: z.string().optional(),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Invalid resource suggestion request.", details: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const context = buildChemShastriContext({
    message: parsed.data.query,
    ...parsed.data,
  });
  const resources = await retrieveChemShastriResources({ query: parsed.data.query, context }).catch(() => []);
  return Response.json({ ok: true, resources });
}
