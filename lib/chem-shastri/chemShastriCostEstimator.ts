import { estimateAiCostUsd } from "@/lib/ai/costEstimator";

export function estimateChemShastriCostInr({
  model,
  inputTokens,
  outputTokens,
}: {
  model: string;
  inputTokens: number;
  outputTokens: number;
}) {
  const usd = estimateAiCostUsd(model, inputTokens, outputTokens);
  return {
    usd,
    inr: usd * Number(process.env.AI_USD_TO_INR || 90),
  };
}
