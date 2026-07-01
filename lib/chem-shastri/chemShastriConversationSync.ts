import { chemShastriConfig } from "./chemShastriConfig";
import type { ChemShastriConversationSummary, ChemShastriRequest, ChemShastriResponse } from "./chemShastriTypes";

async function hostingerJson<T>(path: string, init?: RequestInit): Promise<T | null> {
  const baseUrl = chemShastriConfig.hostingerBaseUrl();
  if (!baseUrl) return null;
  try {
    const response = await fetch(`${baseUrl}${path}`, {
      ...init,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
      cache: "no-store",
    });
    if (!response.ok) return null;
    const payload = (await response.json()) as { ok?: boolean; data?: T };
    return payload.ok ? payload.data ?? null : null;
  } catch {
    return null;
  }
}

export async function logChemShastriQuestionToBackend(request: ChemShastriRequest, response: ChemShastriResponse) {
  await hostingerJson<{ question_log_id: number }>("/api/learning/chem-shastri/question-log", {
    method: "POST",
    body: JSON.stringify({
      question_text: request.message,
      anonymous_id: request.anonymousId,
      conversation_id: response.conversationId,
      class_level: request.classLevel,
      simulation_slug: request.simulationSlug,
      mode: response.mode,
      intent: response.intent,
      answer_source: response.source,
      provider: response.providerUsed ?? response.provider,
      model: response.modelUsed ?? response.model,
      cost_inr_est: response.estimatedCostInr ?? 0,
      metadata: { currentPage: request.currentPage, resourceSlug: request.resourceSlug },
    }),
  });
}

export async function listChemShastriConversations(): Promise<ChemShastriConversationSummary[]> {
  const payload = await hostingerJson<{ conversations?: ChemShastriConversationSummary[] }>("/api/chem-shastri/conversations");
  return payload?.conversations ?? [];
}

export async function getChemShastriConversation(id: string) {
  return hostingerJson<{ conversation: unknown; messages: unknown[] }>(`/api/chem-shastri/conversations/${id}`);
}
