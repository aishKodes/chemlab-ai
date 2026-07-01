import type { StoichiometryResult, SubstanceCard } from "@/components/labs/basic-concepts-universe/basicConceptsTypes";

export const AVOGADRO_CONSTANT = 6.022e23;

export function calculateMolesFromMass(massGrams: number, molarMass: number) {
  if (!Number.isFinite(massGrams) || !Number.isFinite(molarMass) || molarMass <= 0) return 0;
  return massGrams / molarMass;
}

export function calculateParticlesFromMoles(moles: number) {
  if (!Number.isFinite(moles) || moles <= 0) return 0;
  return moles * AVOGADRO_CONSTANT;
}

export function calculateMassFromMoles(moles: number, molarMass: number) {
  if (!Number.isFinite(moles) || !Number.isFinite(molarMass) || moles <= 0 || molarMass <= 0) return 0;
  return moles * molarMass;
}

export function calculateMassPercent(elementMass: number, compoundMolarMass: number) {
  if (!Number.isFinite(elementMass) || !Number.isFinite(compoundMolarMass) || compoundMolarMass <= 0) return 0;
  return (elementMass / compoundMolarMass) * 100;
}

export function calculateMolarity(molesSolute: number, litresSolution: number) {
  if (!Number.isFinite(molesSolute) || !Number.isFinite(litresSolution) || litresSolution <= 0) return 0;
  return molesSolute / litresSolution;
}

export function formatScientific(value: number, digits = 3) {
  if (!Number.isFinite(value) || value === 0) return "0";
  return value.toExponential(digits).replace("e+", " x 10^").replace("e-", " x 10^-");
}

export function countSignificantFigures(input: string) {
  const trimmed = input.trim();
  if (!trimmed) return 0;
  if (trimmed.includes(".")) {
    const normalized = trimmed.replace(/^[-+]?0+/, "").replace(".", "").replace(/^0+/, "");
    return normalized.length;
  }
  const withoutSign = trimmed.replace(/^[-+]/, "");
  const withoutLeading = withoutSign.replace(/^0+/, "");
  const withoutTrailing = withoutLeading.replace(/0+$/, "");
  return withoutTrailing.length;
}

export function convertMlToLitres(ml: number) {
  if (!Number.isFinite(ml)) return 0;
  return ml / 1000;
}

export function calculateMolarMassFromAtoms(substance: SubstanceCard, atomicMasses: Record<string, number>) {
  return Object.entries(substance.atoms).reduce((sum, [element, count]) => sum + (atomicMasses[element] ?? 0) * count, 0);
}

export function solveAmmoniaStoichiometry(n2Moles: number, h2Moles: number): StoichiometryResult {
  const safeN2 = Math.max(0, Number.isFinite(n2Moles) ? n2Moles : 0);
  const safeH2 = Math.max(0, Number.isFinite(h2Moles) ? h2Moles : 0);
  const possibleFromN2 = safeN2 * 2;
  const possibleFromH2 = (safeH2 / 3) * 2;
  const ammoniaMoles = Math.min(possibleFromN2, possibleFromH2);

  if (ammoniaMoles === 0) {
    return {
      limitingReagent: safeN2 === safeH2 ? "balanced" : safeN2 <= 0 ? "N2" : "H2",
      ammoniaMoles: 0,
      leftoverN2: safeN2,
      leftoverH2: safeH2,
    };
  }

  const usedN2 = ammoniaMoles / 2;
  const usedH2 = (ammoniaMoles / 2) * 3;
  const leftoverN2 = Math.max(0, safeN2 - usedN2);
  const leftoverH2 = Math.max(0, safeH2 - usedH2);
  let limitingReagent: StoichiometryResult["limitingReagent"] = "balanced";
  if (leftoverN2 > leftoverH2) limitingReagent = "H2";
  if (leftoverH2 > leftoverN2) limitingReagent = "N2";

  return {
    limitingReagent,
    ammoniaMoles,
    leftoverN2,
    leftoverH2,
  };
}
