import { z } from "zod";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const feedbackSchema = z.object({
  conversationId: z.string().uuid().optional(),
  messageId: z.string().uuid().optional(),
  rating: z.enum(["helpful", "not_helpful", "wrong_answer", "too_hard", "too_long"]),
  comment: z.string().max(1000).optional(),
  anonymousId: z.string().max(160).optional(),
});

export async function POST(request: Request) {
  const parsed = feedbackSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Invalid feedback.", details: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const supabase = createSupabaseAdminClient();
  if (supabase) {
    await supabase.from("feature_events").insert({
      anonymous_id: parsed.data.anonymousId || null,
      feature: "master_alchem",
      action: "feedback",
      label: parsed.data.rating,
      metadata: parsed.data,
    });
  }
  return Response.json({ ok: true });
}
