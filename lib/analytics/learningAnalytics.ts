import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function getLearningOverview() {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return { misconceptions: [], progressRows: 0, quizAttempts: 0 };
  const [misconceptions, progress, quizzes] = await Promise.all([
    supabase.from("student_misconceptions").select("misconception_key,confidence,resolved").limit(50),
    supabase.from("student_progress").select("id", { count: "exact", head: true }),
    supabase.from("quiz_attempts").select("id", { count: "exact", head: true }),
  ]);
  return {
    misconceptions: misconceptions.data ?? [],
    progressRows: progress.count ?? 0,
    quizAttempts: quizzes.count ?? 0,
  };
}
