import * as THREE from "three";
import { BOND_LENGTHS_ANGSTROM, BOND_PARALLEL_OFFSET, DISPLAY_SCALE } from "@/components/labs/hydrocarbon-quest/3d/moleculeGeometryConstants";
import type { BondOrder, BuiltAtom3D, BuiltBond3D, Vec3 } from "@/components/labs/hydrocarbon-quest/3d/molecule3DTypes";
import type { MoleculeBond } from "@/components/labs/hydrocarbon-quest/hydrocarbonQuestTypes";

export function bondTypeToOrder(type: MoleculeBond["type"]): BondOrder {
  if (type === "double") return 2;
  if (type === "triple") return 3;
  return 1;
}

export function bondOrderToLength(order: BondOrder, hasHydrogen = false) {
  if (hasHydrogen) return BOND_LENGTHS_ANGSTROM.C_H;
  if (order === 2) return BOND_LENGTHS_ANGSTROM.C_C_DOUBLE;
  if (order === 3) return BOND_LENGTHS_ANGSTROM.C_C_TRIPLE;
  return BOND_LENGTHS_ANGSTROM.C_C_SINGLE;
}

export function scaleAngstrom(value: number) {
  return value * DISPLAY_SCALE;
}

export function toVector3(position: Vec3) {
  return new THREE.Vector3(position[0], position[1], position[2]);
}

export function fromVector3(vector: THREE.Vector3): Vec3 {
  return [vector.x, vector.y, vector.z];
}

export function getAtomById(atoms: BuiltAtom3D[], atomId: string) {
  return atoms.find((atom) => atom.id === atomId);
}

export function getBondId(bond: Pick<BuiltBond3D, "from" | "to">) {
  return [bond.from, bond.to].sort().join("__");
}

export function isBondInSelectedPath(bond: BuiltBond3D, selectedAtoms: string[], correctMainChain: string[]) {
  const selected = new Set(selectedAtoms);
  if (!selected.has(bond.from) || !selected.has(bond.to)) return false;
  const fromIndex = correctMainChain.indexOf(bond.from);
  const toIndex = correctMainChain.indexOf(bond.to);
  return Math.abs(fromIndex - toIndex) === 1;
}

export function getNumberForAtom(atomId: string, sequence: string[], option?: { id: "left" | "right" }) {
  if (!option) return undefined;
  const index = sequence.indexOf(atomId);
  if (index === -1) return undefined;
  return option.id === "left" ? index + 1 : sequence.length - index;
}

export function getParallelOffsets(start: THREE.Vector3, end: THREE.Vector3, order: BondOrder) {
  const offset = BOND_PARALLEL_OFFSET[order];
  if (!offset || order === 1) return [new THREE.Vector3(0, 0, 0)];

  const direction = end.clone().sub(start).normalize();
  const up = Math.abs(direction.dot(new THREE.Vector3(0, 1, 0))) > 0.92 ? new THREE.Vector3(0, 0, 1) : new THREE.Vector3(0, 1, 0);
  const perpendicular = new THREE.Vector3().crossVectors(direction, up).normalize().multiplyScalar(offset);

  if (order === 2) return [perpendicular.clone(), perpendicular.clone().multiplyScalar(-1)];
  return [new THREE.Vector3(0, 0, 0), perpendicular.clone(), perpendicular.clone().multiplyScalar(-1)];
}

export function calculateAngleDegrees(a: Vec3, center: Vec3, b: Vec3) {
  const v1 = toVector3(a).sub(toVector3(center)).normalize();
  const v2 = toVector3(b).sub(toVector3(center)).normalize();
  const dot = THREE.MathUtils.clamp(v1.dot(v2), -1, 1);
  return THREE.MathUtils.radToDeg(Math.acos(dot));
}

export function formatAngstrom(value?: number) {
  if (!value) return "";
  return `${value.toFixed(2)} Å`;
}
