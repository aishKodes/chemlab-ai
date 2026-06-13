import * as THREE from "three";
import type { BuiltAtom3D, BuiltBond3D, BuiltMolecule3D, Vec3 } from "@/components/labs/hydrocarbon-quest/3d/molecule3DTypes";
import { toVector3 } from "@/components/labs/hydrocarbon-quest/3d/molecule3DUtils";

const subscriptMap: Record<string, string> = {
  "0": "₀",
  "1": "₁",
  "2": "₂",
  "3": "₃",
  "4": "₄",
  "5": "₅",
  "6": "₆",
  "7": "₇",
  "8": "₈",
  "9": "₉",
};

const normalDigitMap: Record<string, string> = Object.fromEntries(
  Object.entries(subscriptMap).map(([normal, subscript]) => [subscript, normal]),
);

export function formatChemicalFormula(formula: string) {
  return formula.replace(/\d/g, (digit) => subscriptMap[digit] ?? digit);
}

export function normalizeFormulaDigits(formula: string) {
  return formula.replace(/[₀-₉]/g, (digit) => normalDigitMap[digit] ?? digit);
}

export function parseFormulaCounts(formula: string) {
  const normalized = normalizeFormulaDigits(formula);
  const counts = new Map<string, number>();
  for (const match of normalized.matchAll(/([A-Z][a-z]?)(\d*)/g)) {
    counts.set(match[1], (counts.get(match[1]) ?? 0) + Number(match[2] || 1));
  }
  return counts;
}

export function calculateFormulaCounts(molecule: BuiltMolecule3D) {
  const counts = new Map<string, number>();
  for (const atom of molecule.atoms) {
    counts.set(atom.element, (counts.get(atom.element) ?? 0) + 1);
  }
  return counts;
}

export function formulaCountsEqual(left: Map<string, number>, right: Map<string, number>) {
  const keys = new Set([...left.keys(), ...right.keys()]);
  for (const key of keys) {
    if ((left.get(key) ?? 0) !== (right.get(key) ?? 0)) return false;
  }
  return true;
}

export function formulaCountsToString(counts: Map<string, number>) {
  const ordered = ["C", "H", ...[...counts.keys()].filter((key) => key !== "C" && key !== "H").sort()];
  return ordered
    .filter((element, index, list) => counts.has(element) && list.indexOf(element) === index)
    .map((element) => `${element}${counts.get(element) === 1 ? "" : counts.get(element)}`)
    .join("");
}

export function atomLabelOffset(atom: BuiltAtom3D): Vec3 {
  if (atom.element === "H") return [0, 0.28, 0];
  if (atom.role === "methyl" || atom.role === "ethyl") return [0.18, 0.52, 0.12];
  return [0, 0.58, 0.08];
}

export function locantOffset(atom: BuiltAtom3D, index: number): Vec3 {
  const side = index % 2 === 0 ? 1 : -1;
  return [0.44 * side, 0.78, 0.2];
}

export function bondLabelPosition(from: BuiltAtom3D, to: BuiltAtom3D, lift = 0.2) {
  const mid = toVector3(from.position).add(toVector3(to.position)).multiplyScalar(0.5);
  return [mid.x, mid.y + lift, mid.z] satisfies Vec3;
}

export function labelPosition(atom: BuiltAtom3D, offset: Vec3) {
  return [
    atom.position[0] + offset[0],
    atom.position[1] + offset[1],
    atom.position[2] + offset[2],
  ] satisfies Vec3;
}

export function getBondCenterAndDirection(from: BuiltAtom3D, to: BuiltAtom3D) {
  const start = toVector3(from.position);
  const end = toVector3(to.position);
  const center = start.clone().add(end).multiplyScalar(0.5);
  const direction = end.clone().sub(start).normalize();
  return { center, direction };
}

export function chooseAngleTriplet(molecule: BuiltMolecule3D) {
  const carbon = molecule.atoms.find((atom) => atom.element === "C");
  if (!carbon) return undefined;
  const neighbors = molecule.bonds
    .filter((bond) => bond.from === carbon.id || bond.to === carbon.id)
    .map((bond) => molecule.atoms.find((atom) => atom.id === (bond.from === carbon.id ? bond.to : bond.from)))
    .filter(Boolean) as BuiltAtom3D[];
  if (neighbors.length < 2) return undefined;
  return {
    a: neighbors[0],
    center: carbon,
    b: neighbors[1],
  };
}

export function distanceBetweenAtoms(from: BuiltAtom3D, to: BuiltAtom3D) {
  return new THREE.Vector3(...from.position).distanceTo(new THREE.Vector3(...to.position));
}

export function isHydrogenBond(bond: BuiltBond3D) {
  return bond.from.includes("_h") || bond.to.includes("_h");
}
