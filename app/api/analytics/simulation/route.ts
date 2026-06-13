import { z } from "zod";
import { trackEvent } from "@/lib/analytics/analytics";

const schema = z.object({
  simulationSlug: z.string().min(1).max(160),
  eventName: z.string().min(1).max(160),
  anonymousId: z.string().max(160).optional(),
  userId: z.string().uuid().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Invalid simulation event." }, { status: 400 });
  await trackEvent({
    userId: parsed.data.userId,
    anonymousId: parsed.data.anonymousId,
    sessionId: parsed.data.anonymousId || parsed.data.userId,
    eventType: parsed.data.eventName.includes("complete") ? "simulation_complete" : "simulation_event",
    eventName: parsed.data.eventName,
    pagePath: `/labs/${parsed.data.simulationSlug}`,
    metadata: { simulationSlug: parsed.data.simulationSlug, ...(parsed.data.metadata || {}) },
  });
  return Response.json({ ok: true });
}
