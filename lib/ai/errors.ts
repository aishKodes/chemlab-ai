export class AiConfigurationError extends Error {}
export class AiProviderError extends Error {}
export class AiSafetyError extends Error {}
export class AiBudgetExceededError extends Error {
  remainingInr: number;
  estimatedCostInr: number;

  constructor(message: string, remainingInr: number, estimatedCostInr: number) {
    super(message);
    this.remainingInr = remainingInr;
    this.estimatedCostInr = estimatedCostInr;
  }
}
