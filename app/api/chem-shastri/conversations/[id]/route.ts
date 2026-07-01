import { getChemShastriConversation } from "@/lib/chem-shastri/chemShastriConversationSync";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const conversation = await getChemShastriConversation(id).catch(() => null);
  if (!conversation) {
    return Response.json({ ok: true, conversation: null, messages: [] });
  }
  return Response.json({ ok: true, ...conversation });
}
