import { z } from "zod";
import { sampleQuestions } from "@/data/sample-questions";
import { scoreQuiz } from "@/lib/quiz/scoring";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const submitSchema = z.object({
  chapterSlug: z.string().min(1),
  answers: z.record(z.string(), z.string()),
});

export async function POST(request: Request) {
  const parsedBody = submitSchema.safeParse(await request.json().catch(() => null));

  if (!parsedBody.success) {
    return Response.json({ error: "Invalid quiz submission." }, { status: 400 });
  }

  const { chapterSlug, answers } = parsedBody.data;
  const questions = sampleQuestions.filter((question) => question.chapterSlug === chapterSlug);
  const result = scoreQuiz(questions, answers);
  const supabase = await createSupabaseServerClient();

  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: attempt } = await supabase
        .from("quiz_attempts")
        .insert({
          user_id: user.id,
          chapter_slug: chapterSlug,
          score: result.score,
          total: result.total,
          percentage: result.percentage,
        })
        .select("id")
        .single();

      if (attempt?.id) {
        const uuidAnswerRows = result.results
          .filter((item) =>
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
              item.question.id,
            ),
          )
          .map((item) => ({
            attempt_id: attempt.id,
            question_id: item.question.id,
            user_answer: item.answer,
            is_correct: item.correct,
          }));

        if (uuidAnswerRows.length > 0) {
          await supabase.from("quiz_answers").insert(uuidAnswerRows);
        }
      }
    }
  }

  return Response.json(result);
}
