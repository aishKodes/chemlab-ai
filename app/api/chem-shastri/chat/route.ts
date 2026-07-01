import { z } from "zod";
import { answerChemShastri } from "@/lib/chem-shastri/chemShastriService";

export const dynamic = "force-dynamic";

const requestSchema = z.object({
  message: z.string().min(1).max(9000),
  conversationId: z.string().optional(),
  userId: z.string().optional(),
  anonymousId: z.string().max(160).optional(),
  classLevel: z.enum(["8", "9", "10", "11", "12"]).optional(),
  preferredLanguage: z.enum(["en", "hi", "bn", "or"]).optional(),
  role: z.enum(["anonymous", "student", "teacher", "admin"]).optional(),
  subject: z.literal("chemistry").optional(),
  chapterSlug: z.string().max(120).optional(),
  topicSlug: z.string().max(120).optional(),
  resourceSlug: z.string().max(160).optional(),
  simulationSlug: z.string().max(160).optional(),
  currentPage: z.string().max(240).optional(),
  usePageContext: z.boolean().optional(),
  mode: z
    .enum([
      "explain",
      "hint",
      "step_by_step",
      "quiz_me",
      "check_my_answer",
      "lab_guide",
      "lab_guide_mode",
      "exam_mode",
      "teacher_mode",
    ])
    .optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export async function POST(request: Request) {
  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid Chem-Shastri request.", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }
  try {
    const response = await answerChemShastri(parsed.data, request);
    return Response.json(response);
  } catch (error) {
    const status = typeof (error as { status?: unknown }).status === "number" ? Number((error as { status: number }).status) : 502;
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Chem-Shastri request failed.",
        limit: (error as { limit?: unknown }).limit,
      },
      { status },
    );
  }
}
