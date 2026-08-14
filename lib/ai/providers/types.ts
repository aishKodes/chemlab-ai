export type AiProviderName = "openai" | "gemini" | "groq" | "mock";

export type AiChatMessage = {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
};

export type AiChatRequest = {
  messages: AiChatMessage[];
  model: string;
  temperature?: number;
  maxOutputTokens?: number;
  responseFormat?: "text" | "json";
};

export type AiChatResponse = {
  content: string;
  provider: AiProviderName;
  model: string;
  inputTokens?: number;
  outputTokens?: number;
  latencyMs: number;
  raw?: unknown;
};

export type EmbeddingRequest = {
  text: string;
  model: string;
};

export type EmbeddingResponse = {
  embedding: number[];
  provider: AiProviderName;
  model: string;
  dimension: number;
  latencyMs: number;
};

export interface AiProvider {
  name: AiProviderName;
  isConfigured(): boolean;
  generateChat(request: AiChatRequest): Promise<AiChatResponse>;
  embedText(request: EmbeddingRequest): Promise<EmbeddingResponse>;
}
