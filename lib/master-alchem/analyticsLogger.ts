import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { MasterAlchemIntent, MasterAlchemMode } from "./types";

export async function logAiRequest(payload: {
  conversationId?: string;
  userId?: string;
  anonymousId?: string;
  endpoint: string;
  intent: MasterAlchemIntent;
  mode: MasterAlchemMode;
  provider: string;
  model: string;
  embeddingProvider?: string;
  embeddingModel?: string;
  promptHash: string;
  inputChars: number;
  outputChars: number;
  estimatedInputTokens: number;
  estimatedOutputTokens: number;
  estimatedCostUsd: number;
  estimatedCostInr?: number;
  latencyMs: number;
  cacheHit: boolean;
  ragUsed: boolean;
  fallbackUsed?: boolean;
  blockedByBudget?: boolean;
  safetyStatus: string;
  status: string;
  errorMessage?: string;
}) {
  const supabase = createSupabaseAdminClient();
  if (!supabase || process.env.ANALYTICS_ENABLED === "false") return undefined;
  const { data } = await supabase
    .from("ai_requests")
    .insert({
      conversation_id: payload.conversationId || null,
      user_id: payload.userId || null,
      anonymous_id: payload.anonymousId || null,
      endpoint: payload.endpoint,
      question_hash: payload.promptHash,
      intent: payload.intent,
      mode: payload.mode,
      provider: payload.provider,
      model: payload.model,
      embedding_provider: payload.embeddingProvider || null,
      embedding_model: payload.embeddingModel || null,
      prompt_hash: payload.promptHash,
      input_chars: payload.inputChars,
      output_chars: payload.outputChars,
      input_tokens_est: payload.estimatedInputTokens,
      output_tokens_est: payload.estimatedOutputTokens,
      cost_usd_est: payload.estimatedCostUsd,
      cost_inr_est: payload.estimatedCostInr ?? payload.estimatedCostUsd * Number(process.env.AI_USD_TO_INR || 90),
      estimated_input_tokens: payload.estimatedInputTokens,
      estimated_output_tokens: payload.estimatedOutputTokens,
      estimated_cost_usd: payload.estimatedCostUsd,
      latency_ms: payload.latencyMs,
      cache_hit: payload.cacheHit,
      rag_used: payload.ragUsed,
      fallback_used: payload.fallbackUsed ?? false,
      blocked_by_budget: payload.blockedByBudget ?? false,
      safety_status: payload.safetyStatus,
      status: payload.status,
      error_message: payload.errorMessage || null,
    })
    .select("id")
    .single();
  return data?.id as string | undefined;
}

export async function logRetrieval(payload: {
  aiRequestId?: string;
  query: string;
  normalizedQuery: string;
  classLevel?: string;
  subject?: string;
  chapterSlug?: string;
  topicSlug?: string;
  retrievalMethod: string;
  topK: number;
  returnedChunkIds: string[];
  selectedChunkIds: string[];
  scores: number[];
}) {
  const supabase = createSupabaseAdminClient();
  if (!supabase || !payload.aiRequestId || process.env.ANALYTICS_ENABLED === "false") return;
  await supabase.from("rag_retrieval_logs").insert({
    ai_request_id: payload.aiRequestId,
    query: payload.query,
    normalized_query: payload.normalizedQuery,
    class_level: payload.classLevel || null,
    subject: payload.subject || "chemistry",
    chapter_slug: payload.chapterSlug || null,
    topic_slug: payload.topicSlug || null,
    retrieval_method: payload.retrievalMethod,
    top_k: payload.topK,
    returned_chunk_ids: payload.returnedChunkIds,
    selected_chunk_ids: payload.selectedChunkIds,
    scores: payload.scores,
  });
}
