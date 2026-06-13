import type { AiChatRequest, AiChatResponse, AiProvider, EmbeddingRequest, EmbeddingResponse } from "./types";

type GeminiGenerateResponse = {
  candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  usageMetadata?: { promptTokenCount?: number; candidatesTokenCount?: number };
};

type GeminiEmbeddingResponse = {
  embedding?: { values?: number[] };
};

export class GeminiProvider implements AiProvider {
  name = "gemini" as const;

  isConfigured() {
    return Boolean(process.env.GEMINI_API_KEY);
  }

  private apiKey() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured.");
    }
    return process.env.GEMINI_API_KEY;
  }

  async generateChat(request: AiChatRequest): Promise<AiChatResponse> {
    const started = Date.now();
    const system = request.messages.find((message) => message.role === "system")?.content;
    const contents = request.messages
      .filter((message) => message.role !== "system" && message.role !== "tool")
      .map((message) => ({
        role: message.role === "assistant" ? "model" : "user",
        parts: [{ text: message.content }],
      }));
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${request.model}:generateContent?key=${this.apiKey()}`;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: system ? { parts: [{ text: system }] } : undefined,
        contents,
        generationConfig: {
          temperature: request.temperature ?? 0.25,
          maxOutputTokens: request.maxOutputTokens ?? 900,
          responseMimeType: request.responseFormat === "json" ? "application/json" : undefined,
        },
      }),
    });
    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`Gemini provider error: ${response.status} ${detail.slice(0, 240)}`);
    }
    const data = (await response.json()) as GeminiGenerateResponse;
    return {
      provider: "gemini",
      model: request.model,
      latencyMs: Date.now() - started,
      content:
        data.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("\n").trim() ||
        "I can answer the chemistry idea directly, but the model returned an empty response. Try the question once more with the key concept or equation included.",
      inputTokens: data.usageMetadata?.promptTokenCount,
      outputTokens: data.usageMetadata?.candidatesTokenCount,
      raw: data,
    };
  }

  async embedText(request: EmbeddingRequest): Promise<EmbeddingResponse> {
    const started = Date.now();
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${request.model}:embedContent?key=${this.apiKey()}`;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: { parts: [{ text: request.text }] },
      }),
    });
    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`Gemini embedding error: ${response.status} ${detail.slice(0, 240)}`);
    }
    const data = (await response.json()) as GeminiEmbeddingResponse;
    const embedding = data.embedding?.values ?? [];
    return {
      provider: "gemini",
      model: request.model,
      dimension: embedding.length,
      embedding,
      latencyMs: Date.now() - started,
    };
  }
}
