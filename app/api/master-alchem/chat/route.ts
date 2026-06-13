import { z } from "zod";
import { answerMasterAlchem } from "@/lib/master-alchem/masterAlchemService";

export const dynamic = "force-dynamic";

const requestSchema = z.object({
  message: z.string().min(1).max(6000),
  conversationId: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
  anonymousId: z.string().max(160).optional(),
  classLevel: z.enum(["8", "9", "10", "11", "12"]).optional(),
  subject: z.literal("chemistry").optional(),
  chapterSlug: z.string().max(120).optional(),
  topicSlug: z.string().max(120).optional(),
  simulationSlug: z.string().max(120).optional(),
  mode: z
    .enum(["explain", "hint", "step_by_step", "quiz_me", "check_my_answer", "lab_guide", "lab_guide_mode", "exam_mode"])
    .optional(),
});

export async function POST(request: Request) {
  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Invalid Master Alchem request.", details: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  try {
    const response = await answerMasterAlchem(parsed.data, request);
    return Response.json({
      answer: response.answer,
      message: response.message,
      spokenText: response.spokenText,
      conversationId: response.conversationId,
      provider: response.provider,
      model: response.model,
      providerUsed: response.providerUsed,
      modelUsed: response.modelUsed,
      source: response.source,
      mode: response.mode,
      intent: response.intent,
      citations: response.citations,
      cacheHit: response.cacheHit,
      ragUsed: response.ragUsed,
      safetyStatus: response.safetyStatus,
      remaining: response.remaining,
      mock: response.mock,
      estimatedCostInr: response.estimatedCostInr,
      budgetRemainingInr: response.budgetRemainingInr,
    });
  } catch (error) {
    const status = typeof (error as { status?: unknown }).status === "number" ? Number((error as { status: number }).status) : 502;
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Master Alchem request failed.",
        limit: (error as { limit?: unknown }).limit,
      },
      { status },
    );
  }
}
