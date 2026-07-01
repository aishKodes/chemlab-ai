import { getChemShastriAdminSummary } from "@/lib/chem-shastri/chemShastriConfig";

export const dynamic = "force-dynamic";

export async function GET() {
  const summary = await getChemShastriAdminSummary();
  return Response.json({ ok: true, data: summary });
}
