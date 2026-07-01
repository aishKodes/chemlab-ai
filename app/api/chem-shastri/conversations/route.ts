import { listChemShastriConversations } from "@/lib/chem-shastri/chemShastriConversationSync";

export const dynamic = "force-dynamic";

export async function GET() {
  const conversations = await listChemShastriConversations().catch(() => []);
  return Response.json({ ok: true, conversations });
}
