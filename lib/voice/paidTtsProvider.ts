export type PaidTtsResult = {
  audioUrl: string;
  estimatedCostInr: number;
};

export async function generatePaidTts(): Promise<PaidTtsResult> {
  throw new Error("paid_tts_provider_not_configured");
}
