import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function trackEvent({
  userId,
  anonymousId,
  sessionId,
  eventType,
  eventName,
  pagePath,
  metadata,
}: {
  userId?: string;
  anonymousId?: string;
  sessionId?: string;
  eventType: string;
  eventName: string;
  pagePath?: string;
  metadata?: Record<string, unknown>;
}) {
  const supabase = createSupabaseAdminClient();
  if (!supabase || process.env.ANALYTICS_ENABLED === "false") return;
  await supabase.from("learning_events").insert({
    user_id: userId || null,
    anonymous_id: anonymousId || null,
    session_id: sessionId || anonymousId || userId || "anonymous",
    event_type: eventType,
    event_name: eventName,
    page_path: pagePath || null,
    metadata: metadata || {},
  });
}
