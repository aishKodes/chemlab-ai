import { checkBudget, getBudgetSnapshot, recordBudgetBlocked } from "@/lib/ai/budgetGuard";

export async function getChemShastriBudgetSnapshot() {
  return getBudgetSnapshot();
}

export async function canSpendChemShastri(estimatedCostUsd: number) {
  return checkBudget(estimatedCostUsd);
}

export async function recordChemShastriBudgetBlock() {
  await recordBudgetBlocked();
}
