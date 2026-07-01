import { z } from "zod";
import { buildChemShastriContext } from "@/lib/chem-shastri/chemShastriContextBuilder";
import { retrieveChemShastriResources } from "@/lib/chem-shastri/chemShastriResourceRetriever";

export const dynamic = "force-dynamic";

const schema = z.object({
  query: z.string().min(1).max(1000).default("redox electron transfer"),
  classLevel: z.enum(["8", "9", "10", "11", "12"]).optional(),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return Response.json({ error: "Invalid retrieval test.", details: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const context = buildChemShastriContext({
    message: parsed.data.query,
    classLevel: parsed.data.classLevel ?? "10",
    role: "admin",
    currentPage: "/admin/chem-shastri",
  });
  const resources = await retrieveChemShastriResources({ query: parsed.data.query, context, limit: 6 });
  return Response.json({ ok: true, data: { resources, count: resources.length } });
}
