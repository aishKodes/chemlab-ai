import { z } from "zod";
import { buildSystemPrompt } from "@/lib/ai/prompts";
import { generateAiMentorResponse } from "@/lib/ai/provider";
import type { AiMentorMode } from "@/lib/ai/types";
import { checkRateLimit, isDevelopmentAiUnlimited } from "@/lib/rate-limit/basic";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const aiRequestSchema = z.object({
  message: z.string().min(1).max(4000),
  mode: z
    .enum([
      "explain",
      "hint",
      "step_by_step",
      "quiz_me",
      "check_my_answer",
      "exam_mode",
      "lab_guide_mode",
    ])
    .default("explain"),
  chapterSlug: z.string().optional(),
  conversationId: z.string().uuid().optional(),
  anonymousId: z.string().max(120).optional(),
});

export async function POST(request: Request) {
  const parsedBody = aiRequestSchema.safeParse(await request.json().catch(() => null));

  if (!parsedBody.success) {
    return Response.json(
      { error: "Invalid Master Alchem request.", details: parsedBody.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { message, mode, chapterSlug, conversationId, anonymousId } = parsedBody.data;
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const rateLimitKey = anonymousId ?? forwardedFor ?? "anonymous";
  const devUnlimited = isDevelopmentAiUnlimited(request);
  const limit = checkRateLimit(`ai:${rateLimitKey}`, false, { unlimited: devUnlimited });

  if (!limit.allowed) {
    return Response.json(
      {
        error: "Daily Master Alchem limit reached.",
        limit: limit.limit,
        remaining: limit.remaining,
      },
      { status: 429 },
    );
  }

  const systemPrompt = buildSystemPrompt(mode as AiMentorMode, chapterSlug);

  try {
    const aiResponse = await generateAiMentorResponse({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
    });

    const supabase = createSupabaseAdminClient();
    if (supabase) {
      await supabase.from("ai_usage_logs").insert({
        anonymous_id: anonymousId,
        provider: aiResponse.provider,
        model: aiResponse.model,
        input_tokens: aiResponse.inputTokens ?? 0,
        output_tokens: aiResponse.outputTokens ?? 0,
        mode,
      });

      if (conversationId) {
        await supabase.from("ai_messages").insert([
          { conversation_id: conversationId, role: "user", content: message },
          { conversation_id: conversationId, role: "assistant", content: aiResponse.content },
        ]);
      }
    }

    return Response.json({
      message: aiResponse.content,
      provider: aiResponse.provider,
      model: aiResponse.model,
      mock: aiResponse.mock ?? false,
      remaining: limit.remaining,
      unlimited: limit.unlimited ?? false,
    });
  } catch (error) {
    return Response.json(
      {
        error: "Master Alchem could not reach the AI provider.",
        detail: error instanceof Error ? error.message : "Unknown provider error.",
      },
      { status: 502 },
    );
  }
}
