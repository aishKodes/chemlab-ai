import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { MasterAlchemRequest } from "./types";

export async function detectAndLogMisconceptions(request: MasterAlchemRequest) {
  const supabase = createSupabaseAdminClient();
  if (!supabase || !process.env.TRACK_STUDENT_PROGRESS || process.env.TRACK_STUDENT_PROGRESS === "false") return [];
  const { data } = await supabase
    .from("misconceptions")
    .select("*")
    .eq("status", "active")
    .limit(100);
  const text = request.message.toLowerCase();
  const matched = (data ?? []).filter((row) =>
    Array.isArray(row.detection_phrases)
      ? row.detection_phrases.some((phrase: string) => text.includes(String(phrase).toLowerCase()))
      : false,
  );
  for (const row of matched) {
    await supabase.from("student_misconceptions").insert({
      user_id: request.userId || null,
      anonymous_id: request.anonymousId || null,
      class_level: request.classLevel || null,
      subject: request.subject || "chemistry",
      chapter_slug: request.chapterSlug || null,
      topic_slug: request.topicSlug || null,
      misconception_key: row.misconception_key,
      detected_from: "master_alchem_message",
      confidence: 0.72,
      resolved: false,
    });
  }
  return matched;
}
