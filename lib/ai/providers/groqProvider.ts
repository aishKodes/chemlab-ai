import type { AiChatRequest, AiChatResponse, AiProvider, EmbeddingRequest, EmbeddingResponse } from "./types";

type GroqChatResponse = {
  choices?: Array<{ message?: { content?: string | null } }>;
  usage?: { prompt_tokens?: number; completion_tokens?: number };
};

export class GroqProvider implements AiProvider {
  name = "groq" as const;

  isConfigured() {
    return Boolean(process.env.GROQ_API_KEY);
  }

  async generateChat(request: AiChatRequest): Promise<AiChatResponse> {
    if (!process.env.GROQ_API_KEY) throw new Error("GROQ_API_KEY is not configured.");
    const started = Date.now();
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: request.model,
        messages: request.messages.filter((message) => message.role !== "tool"),
        temperature: request.temperature ?? 0.25,
        max_completion_tokens: request.maxOutputTokens ?? 900,
        response_format: request.responseFormat === "json" ? { type: "json_object" } : undefined,
      }),
      signal: AbortSignal.timeout(25_000),
    });
    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`Groq provider error: ${response.status} ${detail.slice(0, 240)}`);
    }
    const data = (await response.json()) as GroqChatResponse;
    const content = data.choices?.[0]?.message?.content?.trim();
    if (!content) throw new Error("Groq returned an empty response.");
    return {
      provider: "groq",
      model: request.model,
      content,
      inputTokens: data.usage?.prompt_tokens,
      outputTokens: data.usage?.completion_tokens,
      latencyMs: Date.now() - started,
      raw: data,
    };
  }

  async embedText(request: EmbeddingRequest): Promise<EmbeddingResponse> {
    void request;
    throw new Error("Groq is used for chat only; embeddings use the configured embedding provider.");
  }
}
