import type { ConcentrationState } from "./electrochemistryTypes";

const STANDARD_CELL_POTENTIAL = 1.1;
const ELECTRON_COUNT = 2;
const NERNST_FACTOR_298K = 0.0591;

export function calculateReactionQuotient({ zn2Concentration, cu2Concentration }: ConcentrationState) {
  validateConcentration(zn2Concentration);
  validateConcentration(cu2Concentration);
  return zn2Concentration / cu2Concentration;
}

export function calculateDaniellCellVoltage(state: ConcentrationState) {
  validateConcentration(state.zn2Concentration);
  validateConcentration(state.cu2Concentration);
  const quotient = calculateReactionQuotient(state);
  return STANDARD_CELL_POTENTIAL - (NERNST_FACTOR_298K / ELECTRON_COUNT) * Math.log10(quotient);
}

export function formatCellPotential(value: number) {
  return `${value.toFixed(2)} V`;
}

export function getVoltageTrend(previous: number, current: number) {
  if (Math.abs(previous - current) < 0.005) return "steady";
  return current > previous ? "increased" : "decreased";
}

export function validateConcentration(value: number) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error("Concentration must be a positive number.");
  }
  if (value > 10) {
    throw new Error("Use a school-level concentration between 0.01 M and 10 M.");
  }
}

export function getIonMigrationDirection() {
  return {
    anions: "toward the zinc anode half-cell",
    cations: "toward the copper cathode half-cell",
    reason: "Anions balance Zn2+ building up at the anode, while cations help balance charge near the cathode.",
  };
}

export const electrochemistryConstants = {
  standardCellPotential: STANDARD_CELL_POTENTIAL,
  electronCount: ELECTRON_COUNT,
  nernstFactor298K: NERNST_FACTOR_298K,
};
