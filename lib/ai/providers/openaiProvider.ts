import OpenAI from "openai";
import type { AiChatRequest, AiChatResponse, AiProvider, EmbeddingRequest, EmbeddingResponse } from "./types";

export class OpenAIProvider implements AiProvider {
  name = "openai" as const;
  private client: OpenAI | null = null;

  isConfigured() {
    return Boolean(process.env.OPENAI_API_KEY);
  }

  private getClient() {
    if (!this.client) {
      if (!process.env.OPENAI_API_KEY) {
        throw new Error("OPENAI_API_KEY is not configured.");
      }
      this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }
    return this.client;
  }

  async generateChat(request: AiChatRequest): Promise<AiChatResponse> {
    const started = Date.now();
    const response = await this.getClient().chat.completions.create({
      model: request.model,
      messages: request.messages
        .filter((message) => message.role !== "tool")
        .map((message) => ({
          role: message.role === "system" ? "system" : message.role === "assistant" ? "assistant" : "user",
          content: message.content,
        })),
      temperature: request.temperature ?? 0.25,
      max_tokens: request.maxOutputTokens ?? 900,
      response_format: request.responseFormat === "json" ? { type: "json_object" } : undefined,
    });
    return {
      provider: "openai",
      model: request.model,
      latencyMs: Date.now() - started,
      content:
        response.choices[0]?.message?.content?.trim() ||
        "I can answer the chemistry idea directly, but the model returned an empty response. Try the question once more with the key concept or equation included.",
      inputTokens: response.usage?.prompt_tokens,
      outputTokens: response.usage?.completion_tokens,
      raw: response,
    };
  }

  async embedText(request: EmbeddingRequest): Promise<EmbeddingResponse> {
    const started = Date.now();
    const response = await this.getClient().embeddings.create({
      model: request.model,
      input: request.text,
    });
    const embedding = response.data[0]?.embedding ?? [];
    return {
      provider: "openai",
      model: request.model,
      dimension: embedding.length,
      embedding,
      latencyMs: Date.now() - started,
    };
  }
}
