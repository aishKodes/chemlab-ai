import * as THREE from "three";
import { BOND_LENGTHS_ANGSTROM, DISPLAY_SCALE } from "@/components/labs/hydrocarbon-quest/3d/moleculeGeometryConstants";
import { fromVector3, getAtomById, toVector3 } from "@/components/labs/hydrocarbon-quest/3d/molecule3DUtils";
import type { BuiltAtom3D, BuiltBond3D, Hybridization } from "@/components/labs/hydrocarbon-quest/3d/molecule3DTypes";

const sp3Candidates = [
  [1, 1, 1],
  [1, -1, -1],
  [-1, 1, -1],
  [-1, -1, 1],
  [0.35, 1.15, -0.55],
  [-0.35, -1.15, -0.55],
  [0.55, -0.35, 1.15],
  [-0.55, 0.35, 1.15],
] as const;

const sp2Candidates = [
  [1, 0, 0],
  [-0.5, 0.86, 0],
  [-0.5, -0.86, 0],
  [0.5, 0.86, 0],
  [0.5, -0.86, 0],
] as const;

const spCandidates = [
  [1, 0, 0],
  [-1, 0, 0],
] as const;

export function appendGeneratedHydrogens(atoms: BuiltAtom3D[], bonds: BuiltBond3D[]) {
  const nextAtoms: BuiltAtom3D[] = [...atoms];
  const nextBonds: BuiltBond3D[] = [...bonds];

  for (const atom of atoms) {
    if (atom.element !== "C") continue;
    const attachedBonds = nextBonds.filter((bond) => bond.from === atom.id || bond.to === atom.id);
    const carbonValenceUsed = attachedBonds.reduce((sum, bond) => sum + bond.order, 0);
    const hydrogenCount = Math.max(0, 4 - carbonValenceUsed);
    if (hydrogenCount === 0) continue;

    const neighborVectors = attachedBonds
      .map((bond) => getAtomById(nextAtoms, bond.from === atom.id ? bond.to : bond.from))
      .filter(Boolean)
      .map((neighbor) => toVector3(neighbor!.position).sub(toVector3(atom.position)).normalize());

    chooseHydrogenVectors(atom.hybridization, neighborVectors, hydrogenCount).forEach((direction, index) => {
      const hydrogenId = `${atom.id}_h${index + 1}`;
      const position = toVector3(atom.position).add(direction.multiplyScalar(BOND_LENGTHS_ANGSTROM.C_H * DISPLAY_SCALE));
      nextAtoms.push({
        id: hydrogenId,
        element: "H",
        role: "hydrogen",
        hybridization: atom.hybridization,
        position: fromVector3(position),
        parentAtomId: atom.id,
        generated: true,
      });
      nextBonds.push({
        from: atom.id,
        to: hydrogenId,
        order: 1,
        lengthAngstrom: BOND_LENGTHS_ANGSTROM.C_H,
      });
    });
  }

  return { atoms: nextAtoms, bonds: nextBonds };
}

function chooseHydrogenVectors(hybridization: Hybridization, neighborVectors: THREE.Vector3[], count: number) {
  const candidates = getCandidates(hybridization)
    .map(([x, y, z]) => new THREE.Vector3(x, y, z).normalize())
    .map((candidate) => ({
      vector: candidate,
      score: neighborVectors.reduce((highest, neighbor) => Math.max(highest, candidate.dot(neighbor)), -1),
    }))
    .sort((a, b) => a.score - b.score)
    .map((item) => item.vector);

  const chosen: THREE.Vector3[] = [];
  for (const candidate of candidates) {
    if (chosen.length >= count) break;
    const tooCloseToChosen = chosen.some((existing) => existing.dot(candidate) > 0.62);
    if (!tooCloseToChosen) chosen.push(candidate.clone());
  }

  return chosen.length >= count ? chosen.slice(0, count) : candidates.slice(0, count).map((vector) => vector.clone());
}

function getCandidates(hybridization: Hybridization) {
  if (hybridization === "sp") return spCandidates;
  if (hybridization === "sp2") return sp2Candidates;
  return sp3Candidates;
}
