import type { AiChatRequest, AiChatResponse, AiProvider, EmbeddingRequest, EmbeddingResponse } from "./types";

function hashNumber(text: string, index: number) {
  let hash = 2166136261 + index;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return ((hash >>> 0) % 2000) / 1000 - 1;
}

export class MockProvider implements AiProvider {
  name = "mock" as const;

  isConfigured() {
    return true;
  }

  async generateChat(request: AiChatRequest): Promise<AiChatResponse> {
    const started = Date.now();
    const userMessage = [...request.messages].reverse().find((message) => message.role === "user")?.content ?? "";
    return {
      provider: "mock",
      model: request.model || "mock-master-alchem",
      latencyMs: Date.now() - started,
      inputTokens: Math.ceil(request.messages.map((message) => message.content).join("\n").length / 4),
      outputTokens: 110,
      content: `Here is a direct Chem-Shastri practice answer.\n\n${mockChemistryAnswer(userMessage)}\n\nTiny check: which keyword in your question tells us the main chemistry idea?`,
    };
  }

  async embedText(request: EmbeddingRequest): Promise<EmbeddingResponse> {
    const started = Date.now();
    const dimension = 384;
    return {
      provider: "mock",
      model: request.model || "mock-embedding",
      dimension,
      latencyMs: Date.now() - started,
      embedding: Array.from({ length: dimension }, (_, index) => hashNumber(request.text, index)),
    };
  }
}

function mockChemistryAnswer(message: string) {
  const text = message.toLowerCase();
  if (text.includes("valency")) {
    return "Valency is the combining capacity of an atom. A simple way to read it is: atoms try to complete their outer shell, so valency tells us how many electrons they tend to lose, gain, or share. Sodium has valency 1, oxygen has valency 2, and carbon has valency 4.";
  }
  if (text.includes("mole")) {
    return "A mole is a counting unit, like a dozen, but much larger. One mole means 6.022 x 10^23 particles. Chemists use it to connect tiny particles to measurable mass in grams.";
  }
  if (text.includes("balance") || text.includes("equation")) {
    return "A chemical equation is balanced because atoms are conserved. Count each element on the reactant side and product side, then change only coefficients until every element has the same count on both sides.";
  }
  if (text.includes("ionic") || text.includes("covalent")) {
    return "Ionic bonds form when electrons are transferred, usually from a metal to a non-metal. Covalent bonds form when atoms share electrons, usually between non-metals.";
  }
  if (text.includes("atom")) {
    return "An atom is the smallest unit of an element that keeps that element's identity. It has a nucleus with protons and neutrons, and electrons arranged around it.";
  }
  return "For a clear chemistry question, first identify the concept, then connect it to the rule: particles, bonds, equations, moles, or periodic trends. Then apply that rule step by step instead of memorising the final answer.";
}
