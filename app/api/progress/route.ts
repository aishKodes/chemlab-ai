import { z } from "zod";
import { chemistryModules } from "@/data/chemistry-modules";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const progressSchema = z.object({
  chapterSlug: z.string().min(1),
  mastery: z.number().min(0).max(100).optional(),
  lessonsCompleted: z.number().int().min(0).optional(),
  quizzesCompleted: z.number().int().min(0).optional(),
});

const mockProgress = chemistryModules.map((module, index) => ({
  chapter_slug: module.slug,
  mastery: [72, 58, 41, 34, 26][index] ?? 20,
  lessons_completed: index + 1,
  quizzes_completed: index > 1 ? 0 : 1,
  last_activity_at: new Date().toISOString(),
}));

export async function GET() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return Response.json({ progress: mockProgress, source: "mock" });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ progress: mockProgress, source: "mock" });
  }

  const { data, error } = await supabase
    .from("student_progress")
    .select("*")
    .eq("user_id", user.id)
    .order("last_activity_at", { ascending: false });

  if (error) {
    return Response.json({ progress: mockProgress, source: "mock" });
  }

  return Response.json({ progress: data ?? [], source: "supabase" });
}

export async function POST(request: Request) {
  const parsedBody = progressSchema.safeParse(await request.json().catch(() => null));

  if (!parsedBody.success) {
    return Response.json({ error: "Invalid progress update." }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return Response.json({ saved: false, source: "mock" });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ saved: false, source: "mock" });
  }

  const { chapterSlug, mastery, lessonsCompleted, quizzesCompleted } = parsedBody.data;
  const { error } = await supabase.from("student_progress").upsert({
    user_id: user.id,
    chapter_slug: chapterSlug,
    mastery,
    lessons_completed: lessonsCompleted,
    quizzes_completed: quizzesCompleted,
    last_activity_at: new Date().toISOString(),
  });

  if (error) {
    return Response.json({ saved: false, error: error.message }, { status: 500 });
  }

  return Response.json({ saved: true });
}
