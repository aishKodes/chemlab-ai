import { z } from "zod";
import { answerMasterAlchem } from "@/lib/master-alchem/masterAlchemService";

const schema = z.object({
  question: z.string().min(1),
  studentAnswer: z.string().min(1),
  correctAnswer: z.string().optional(),
  anonymousId: z.string().optional(),
  userId: z.string().uuid().optional(),
  classLevel: z.enum(["8", "9", "10", "11", "12"]).optional(),
  chapterSlug: z.string().optional(),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Invalid request." }, { status: 400 });
  const { question, studentAnswer, correctAnswer, ...rest } = parsed.data;
  const message = `Question: ${question}\nStudent answer: ${studentAnswer}\nCorrect answer if known: ${correctAnswer || "not provided"}\nExplain the mistake gently.`;
  return Response.json(await answerMasterAlchem({ ...rest, message, subject: "chemistry", mode: "check_my_answer" }, request));
}
