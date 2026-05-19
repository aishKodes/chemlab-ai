import type { AiMessage, AiProvider, AiResponse } from "@/lib/ai/types";

type ProviderRequest = {
  messages: AiMessage[];
  provider?: string;
  model?: string;
};

function resolveProvider(provider?: string): AiProvider {
  if (provider === "gemini" || provider === "openai-compatible" || provider === "mock") {
    return provider;
  }
  return "mock";
}

function estimateTokens(text: string) {
  return Math.ceil(text.length / 4);
}

function mockResponse(messages: AiMessage[], model = "mock-chemistry-tutor"): AiResponse {
  const lastUserMessage = [...messages].reverse().find((message) => message.role === "user")?.content;
  return {
    provider: "mock",
    model,
    mock: true,
    inputTokens: estimateTokens(messages.map((message) => message.content).join("\n")),
    outputTokens: 90,
    content: `I can help with that. Since the live AI key is not configured, here is the ChemLab AI mock tutor response:

Start by identifying the chemistry idea in your question: ${lastUserMessage ?? "the concept you are studying"}.

1. Write the known values or particles involved.
2. Choose the rule: conservation of atoms, charge balance, mole conversion, or periodic trend.
3. Apply the rule carefully and check units or atom counts.

Try one next step yourself, and I can check it when the server AI provider is connected.`,
  };
}

async function callOpenAICompatible({
  messages,
  model,
  apiKey,
}: {
  messages: AiMessage[];
  model: string;
  apiKey: string;
}): Promise<AiResponse> {
  const baseUrl = process.env.AI_BASE_URL ?? "https://api.openai.com/v1";
  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.35,
      max_tokens: 900,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`AI provider error: ${response.status} ${detail.slice(0, 240)}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
    usage?: { prompt_tokens?: number; completion_tokens?: number };
  };

  return {
    provider: "openai-compatible",
    model,
    content: data.choices?.[0]?.message?.content ?? "I could not generate a response.",
    inputTokens: data.usage?.prompt_tokens,
    outputTokens: data.usage?.completion_tokens,
  };
}

async function callGemini({
  messages,
  model,
  apiKey,
}: {
  messages: AiMessage[];
  model: string;
  apiKey: string;
}): Promise<AiResponse> {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const system = messages.find((message) => message.role === "system")?.content;
  const contents = messages
    .filter((message) => message.role !== "system")
    .map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: message.content }],
    }));

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: system ? { parts: [{ text: system }] } : undefined,
      contents,
      generationConfig: {
        temperature: 0.35,
        maxOutputTokens: 900,
      },
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Gemini provider error: ${response.status} ${detail.slice(0, 240)}`);
  }

  const data = (await response.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    usageMetadata?: { promptTokenCount?: number; candidatesTokenCount?: number };
  };

  return {
    provider: "gemini",
    model,
    content:
      data.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("\n").trim() ||
      "I could not generate a response.",
    inputTokens: data.usageMetadata?.promptTokenCount,
    outputTokens: data.usageMetadata?.candidatesTokenCount,
  };
}

export async function generateAiTutorResponse({
  messages,
  provider: providerInput,
  model: modelInput,
}: ProviderRequest): Promise<AiResponse> {
  const provider = resolveProvider(providerInput ?? process.env.AI_PROVIDER);
  const apiKey = process.env.AI_API_KEY;
  const model =
    modelInput ??
    process.env.AI_MODEL ??
    (provider === "gemini" ? "gemini-1.5-flash" : "gpt-4o-mini");

  if (!apiKey || provider === "mock") {
    return mockResponse(messages, model);
  }

  if (provider === "gemini") {
    return callGemini({ messages, model, apiKey });
  }

  return callOpenAICompatible({ messages, model, apiKey });
}
