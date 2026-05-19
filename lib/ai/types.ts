import type { AI_TUTOR_MODES } from "@/data/constants";

export type AiProvider = "openai-compatible" | "gemini" | "mock";

export type AiTutorMode = (typeof AI_TUTOR_MODES)[number];

export type AiMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type AiResponse = {
  content: string;
  provider: AiProvider;
  model: string;
  inputTokens?: number;
  outputTokens?: number;
  mock?: boolean;
};
