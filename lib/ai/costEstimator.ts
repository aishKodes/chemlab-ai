const PRICE_PER_MILLION_TOKENS: Record<string, { input: number; output: number }> = {
  "gpt-4o-mini": { input: 0.15, output: 0.6 },
  "gpt-4o": { input: 5, output: 15 },
  "text-embedding-3-small": { input: 0.02, output: 0 },
  "gemini-1.5-flash": { input: 0.075, output: 0.3 },
  "gemini-1.5-pro": { input: 1.25, output: 5 },
  "text-embedding-004": { input: 0.01, output: 0 },
  "gemini-2.0-flash": { input: 0.1, output: 0.4 },
  "gemini-2.5-flash": { input: 0.3, output: 2.5 },
};

export function estimateAiCostUsd(model: string, inputTokens: number, outputTokens: number) {
  const prices = PRICE_PER_MILLION_TOKENS[model] ?? { input: 0.1, output: 0.4 };
  return (inputTokens / 1_000_000) * prices.input + (outputTokens / 1_000_000) * prices.output;
}

export function estimateAiCostInr(model: string, inputTokens: number, outputTokens: number) {
  return estimateAiCostUsd(model, inputTokens, outputTokens) * Number(process.env.AI_USD_TO_INR || 90);
}
