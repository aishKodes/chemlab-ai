import { z } from "zod";
import { submitChemShastriFeedback } from "@/lib/chem-shastri/chemShastriFeedback";

export const dynamic = "force-dynamic";

const feedbackSchema = z.object({
  conversationId: z.string().optional(),
  messageId: z.string().optional(),
  questionLogId: z.number().int().positive().optional(),
  rating: z.enum(["helpful", "not_helpful", "wrong_answer", "too_hard", "too_long"]),
  comment: z.string().max(1000).optional(),
  anonymousId: z.string().max(160).optional(),
});

export async function POST(request: Request) {
  const parsed = feedbackSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Invalid feedback.", details: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const result = await submitChemShastriFeedback(parsed.data);
  return Response.json({ ok: true, source: result.source });
}
