import { z } from "zod";
import { routeVoiceRequest } from "@/lib/voice/voiceRouter";

export const dynamic = "force-dynamic";

const schema = z.object({
  text: z.string().min(1).max(4000),
  language: z.string().max(24).optional(),
  voiceName: z.string().max(80).optional(),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Invalid voice request.", details: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  try {
    return Response.json(await routeVoiceRequest(parsed.data));
  } catch (error) {
    return Response.json(
      {
        mode: "browser",
        provider: "browser",
        text: parsed.data.text.slice(0, 700),
        audioUrl: null,
        error: error instanceof Error ? error.message : "Voice request failed.",
      },
      { status: 200 },
    );
  }
}
