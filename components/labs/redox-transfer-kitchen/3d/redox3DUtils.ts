import type { RedoxLevelId } from "../redoxTypes";

export type Vector3Tuple = [number, number, number];

export const redoxPositions = {
  zinc: [-2.75, 0, 0] as Vector3Tuple,
  copper: [2.75, 0, 0] as Vector3Tuple,
  sulfateLeft: [-1.55, -1.2, -0.15] as Vector3Tuple,
  sulfateRight: [1.55, -1.2, -0.15] as Vector3Tuple,
};

export function electronPoint(progress: number, offset = 0): Vector3Tuple {
  const t = (progress + offset) % 1;
  const x = redoxPositions.zinc[0] + (redoxPositions.copper[0] - redoxPositions.zinc[0]) * t;
  const y = 0.75 + Math.sin(t * Math.PI) * 1.25;
  const z = Math.sin(t * Math.PI * 2) * 0.12;
  return [x, y, z];
}

export function stageIntensity(levelId: RedoxLevelId, active: boolean) {
  if (!active) return 0.2;
  if (levelId === "simultaneous_redox") return 1;
  if (levelId === "electron_transaction" || levelId === "oxidation_gate" || levelId === "reduction_gate") return 0.8;
  return 0.45;
}
