import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { MasterAlchemRequest } from "./types";

export async function createOrLoadConversation(request: MasterAlchemRequest) {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return request.conversationId;
  if (request.conversationId) return request.conversationId;
  const { data } = await supabase
    .from("master_alchem_conversations")
    .insert({
      user_id: request.userId || null,
      anonymous_id: request.anonymousId || null,
      session_id: request.anonymousId || request.userId || crypto.randomUUID(),
      title: request.message.slice(0, 80),
      class_level: request.classLevel || null,
      subject: request.subject || "chemistry",
      chapter_slug: request.chapterSlug || null,
      topic_slug: request.topicSlug || null,
      simulation_slug: request.simulationSlug || null,
      mode: request.mode || "explain",
    })
    .select("id")
    .single();
  return data?.id as string | undefined;
}

export async function saveConversationMessages({
  conversationId,
  userMessage,
  assistantMessage,
  metadata,
}: {
  conversationId?: string;
  userMessage: string;
  assistantMessage: string;
  metadata: Record<string, unknown>;
}) {
  const supabase = createSupabaseAdminClient();
  if (!supabase || !conversationId) return;
  await supabase.from("master_alchem_messages").insert([
    { conversation_id: conversationId, role: "user", content: userMessage, metadata },
    { conversation_id: conversationId, role: "assistant", content: assistantMessage, metadata },
  ]);
}
