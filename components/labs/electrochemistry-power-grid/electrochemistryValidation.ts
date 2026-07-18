import type { CellPart, IonDirectionAnswer } from "./electrochemistryTypes";

export const requiredCellParts: CellPart[] = ["zn_electrode", "cu_electrode", "zn_solution", "cu_solution", "salt_bridge", "wire", "voltmeter"];

export function validateCellBuild(parts: Set<CellPart>) {
  return requiredCellParts.every((part) => parts.has(part));
}

export function validateAnodeAnswer(answer: string) {
  return answer === "zinc_anode";
}

export function validateCathodeAnswer(answer: string) {
  return answer === "copper_cathode";
}

export function validateIonDirection(answer: IonDirectionAnswer) {
  return answer === "anions_to_anode_cations_to_cathode";
}
