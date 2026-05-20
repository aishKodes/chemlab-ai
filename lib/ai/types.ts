import type { AI_MENTOR_MODES } from "@/data/constants";

export type AiProvider = "openai-compatible" | "gemini" | "mock";

export type AiMentorMode = (typeof AI_MENTOR_MODES)[number];

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
