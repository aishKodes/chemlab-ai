import { GoogleGenAI } from "@google/genai";
import type { AiChatRequest, AiChatResponse, AiProvider, EmbeddingRequest, EmbeddingResponse } from "./types";

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
    const client = new GoogleGenAI({ apiKey: this.apiKey() });
    const system = request.messages.find((message) => message.role === "system")?.content;
    const contents = request.messages
      .filter((message) => message.role !== "system" && message.role !== "tool")
      .map((message) => ({
        role: message.role === "assistant" ? "model" : "user",
        parts: [{ text: message.content }],
      }));
    const response = await client.models.generateContent({
      model: request.model,
      contents,
      config: {
        systemInstruction: system,
        temperature: request.temperature ?? 0.25,
        maxOutputTokens: request.maxOutputTokens ?? 900,
        responseMimeType: request.responseFormat === "json" ? "application/json" : undefined,
      },
    });
    return {
      provider: "gemini",
      model: request.model,
      latencyMs: Date.now() - started,
      content:
        response.text?.trim() ||
        "I can answer the chemistry idea directly, but the model returned an empty response. Try the question once more with the key concept or equation included.",
      inputTokens: response.usageMetadata?.promptTokenCount,
      outputTokens: response.usageMetadata?.candidatesTokenCount,
      raw: response,
    };
  }

  async embedText(request: EmbeddingRequest): Promise<EmbeddingResponse> {
    const started = Date.now();
    const client = new GoogleGenAI({ apiKey: this.apiKey() });
    const response = await client.models.embedContent({
      model: request.model,
      contents: request.text,
    });
    const embedding = response.embeddings?.[0]?.values ?? [];
    return {
      provider: "gemini",
      model: request.model,
      dimension: embedding.length,
      embedding,
      latencyMs: Date.now() - started,
    };
  }
}
