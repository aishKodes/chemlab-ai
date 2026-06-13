import { z } from "zod";
import { trackEvent } from "@/lib/analytics/analytics";

export const dynamic = "force-dynamic";

const allowedEvents = new Set([
  "page_view",
  "master_alchem_opened",
  "master_alchem_question_asked",
  "master_alchem_answer_returned",
  "ai_cache_hit",
  "ai_budget_blocked",
  "voice_enabled",
  "voice_play_clicked",
  "simulation_started",
  "simulation_level_started",
  "simulation_wrong_answer",
  "simulation_completed",
  "quiz_attempted",
  "hint_used",
]);

const schema = z.object({
  eventType: z.string().min(1).max(80),
  eventName: z.string().min(1).max(120),
  anonymousId: z.string().max(160).optional(),
  userId: z.string().max(160).optional(),
  sessionId: z.string().max(160).optional(),
  pagePath: z.string().max(300).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Invalid analytics event.", details: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  if (!allowedEvents.has(parsed.data.eventName)) {
    return Response.json({ ok: false, error: "unsupported_event" }, { status: 400 });
  }
  await trackEvent(parsed.data).catch(() => undefined);
  return Response.json({ ok: true });
}
