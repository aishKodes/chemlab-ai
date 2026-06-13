import * as THREE from "three";
import { BOND_LENGTHS_ANGSTROM, DISPLAY_SCALE } from "@/components/labs/hydrocarbon-quest/3d/moleculeGeometryConstants";
import { appendGeneratedHydrogens } from "@/components/labs/hydrocarbon-quest/3d/HydrogenBuilder";
import { bondOrderToLength, bondTypeToOrder, fromVector3 } from "@/components/labs/hydrocarbon-quest/3d/molecule3DUtils";
import { validateMolecule3D } from "@/components/labs/hydrocarbon-quest/3d/moleculeValidation";
import type { Atom3D, Bond3D, BuiltAtom3D, BuiltBond3D, BuiltMolecule3D, Hybridization, Molecule3DData } from "@/components/labs/hydrocarbon-quest/3d/molecule3DTypes";
import type { HydrocarbonLevel } from "@/components/labs/hydrocarbon-quest/hydrocarbonQuestTypes";

export function buildMolecule3D(level: HydrocarbonLevel): BuiltMolecule3D {
  const source = level.molecule3D ?? createMolecule3DDataFromLevel(level);
  const carbonAtoms = source.atoms.filter((atom) => atom.element === "C");
  const carbonPositions = assignCarbonPositions(source, level);
  const atoms: BuiltAtom3D[] = carbonAtoms.map((atom) => ({
    id: atom.id,
    element: atom.element,
    role: atom.role ?? "main",
    hybridization: atom.hybridization ?? inferHybridization(atom.id, source.bonds),
    position: atom.position ?? carbonPositions.get(atom.id) ?? [0, 0, 0],
    parentAtomId: atom.parentAtomId,
  }));

  const bonds: BuiltBond3D[] = source.bonds.map((bond) => {
    const from = atoms.find((atom) => atom.id === bond.from);
    const to = atoms.find((atom) => atom.id === bond.to);
    const hasHydrogen = from?.element === "H" || to?.element === "H";
    return {
      from: bond.from,
      to: bond.to,
      order: bond.order,
      lengthAngstrom: bond.lengthAngstrom ?? bondOrderToLength(bond.order, hasHydrogen),
    };
  });

  const generated = source.generateHydrogens ? appendGeneratedHydrogens(atoms, bonds) : { atoms, bonds };
  return {
    level,
    atoms: generated.atoms,
    bonds: generated.bonds,
    warnings: validateMolecule3D({
      level,
      atoms: generated.atoms,
      bonds: generated.bonds,
    }),
  };
}

export function createMolecule3DDataFromLevel(level: HydrocarbonLevel): Molecule3DData {
  return {
    id: level.molecule.id,
    name: level.targetName,
    formula: level.formula,
    atoms: level.molecule.atoms.map<Atom3D>((atom) => ({
      id: atom.id,
      element: atom.element,
      role: atom.role,
      hybridization: inferHybridization(atom.id, level.molecule.bonds.map((bond): Bond3D => ({ from: bond.from, to: bond.to, order: bondTypeToOrder(bond.type) }))),
      autoHydrogens: atom.element === "C",
    })),
    bonds: level.molecule.bonds.map((bond) => ({
      from: bond.from,
      to: bond.to,
      order: bondTypeToOrder(bond.type),
    })),
    generateHydrogens: true,
    geometryMode: "auto",
    correctMainChain: level.correctChainSequence,
    substituents: level.molecule.atoms
      .filter((atom) => atom.role === "methyl" || atom.role === "ethyl")
      .map((atom) => {
        const parentBond = level.molecule.bonds.find((bond) => bond.from === atom.id || bond.to === atom.id);
        const parentAtomId = parentBond?.from === atom.id ? parentBond.to : parentBond?.from ?? level.correctChainSequence[0];
        return {
          id: atom.id,
          type: atom.role === "ethyl" ? ("ethyl" as const) : ("methyl" as const),
          atomIds: [atom.id],
          parentAtomId,
          locant: Math.max(1, level.correctChainSequence.indexOf(parentAtomId) + 1),
        };
      }),
  };
}

function assignCarbonPositions(source: Molecule3DData, level: HydrocarbonLevel) {
  const positions = new Map<string, [number, number, number]>();
  const mainChain = source.correctMainChain.length ? source.correctMainChain : source.atoms.filter((atom) => atom.role === "main").map((atom) => atom.id);
  const multipleBond = source.bonds.find((bond) => bond.order > 1);
  const isAlkyne = multipleBond?.order === 3;
  const isAlkene = multipleBond?.order === 2;

  if (mainChain.length === 1) {
    positions.set(mainChain[0], [0, 0, 0]);
  } else {
    const steps = getMainChainSteps(mainChain.length, isAlkene, isAlkyne);
    let current = new THREE.Vector3(0, 0, 0);
    positions.set(mainChain[0], fromVector3(current));
    for (let index = 1; index < mainChain.length; index += 1) {
      const prev = mainChain[index - 1];
      const bond = source.bonds.find((item) => (item.from === prev && item.to === mainChain[index]) || (item.to === prev && item.from === mainChain[index]));
      const length = bondOrderToLength(bond?.order ?? 1) * DISPLAY_SCALE;
      current = current.clone().add(steps[index - 1].clone().normalize().multiplyScalar(length));
      positions.set(mainChain[index], fromVector3(current));
    }
  }

  centerPositions(positions);

  const branchAtoms = source.atoms.filter((atom) => atom.element === "C" && !positions.has(atom.id));
  branchAtoms.forEach((atom, branchIndex) => {
    const parentBond = source.bonds.find((bond) => bond.from === atom.id || bond.to === atom.id);
    const parentId = parentBond?.from === atom.id ? parentBond.to : parentBond?.from;
    const parentPosition = parentId ? positions.get(parentId) : undefined;
    if (!parentPosition) {
      positions.set(atom.id, [0, 1.8, branchIndex % 2 ? -1.2 : 1.2]);
      return;
    }
    const parentVector = new THREE.Vector3(parentPosition[0], parentPosition[1], parentPosition[2]);
    const sign = branchIndex % 2 === 0 ? 1 : -1;
    const out = new THREE.Vector3(0.32 * sign, 1.36, 1.0 * sign).normalize().multiplyScalar(BOND_LENGTHS_ANGSTROM.C_C_SINGLE * DISPLAY_SCALE);
    positions.set(atom.id, fromVector3(parentVector.add(out)));
  });

  if (level.targetName.includes("Dimethyl")) {
    spreadSiblingBranches(positions, source);
  }

  return positions;
}

function getMainChainSteps(count: number, isAlkene: boolean, isAlkyne: boolean) {
  if (isAlkyne) {
    return Array.from({ length: count - 1 }, () => new THREE.Vector3(1, 0, 0));
  }
  if (isAlkene) {
    return Array.from({ length: count - 1 }, (_, index) => {
      if (index === 0) return new THREE.Vector3(1, 0, 0);
      return new THREE.Vector3(0.88, index % 2 ? -0.5 : 0.5, 0);
    });
  }
  return Array.from({ length: count - 1 }, (_, index) => new THREE.Vector3(1, index % 2 ? -0.46 : 0.46, index % 2 ? 0.24 : -0.24));
}

function centerPositions(positions: Map<string, [number, number, number]>) {
  const vectors = [...positions.values()].map(([x, y, z]) => new THREE.Vector3(x, y, z));
  const center = vectors.reduce((sum, vector) => sum.add(vector), new THREE.Vector3()).divideScalar(Math.max(vectors.length, 1));
  positions.forEach((position, key) => {
    positions.set(key, [position[0] - center.x, position[1] - center.y, position[2] - center.z]);
  });
}

function spreadSiblingBranches(positions: Map<string, [number, number, number]>, source: Molecule3DData) {
  const byParent = new Map<string, string[]>();
  for (const atom of source.atoms.filter((item) => item.role === "methyl")) {
    const parentBond = source.bonds.find((bond) => bond.from === atom.id || bond.to === atom.id);
    const parentId = parentBond?.from === atom.id ? parentBond.to : parentBond?.from;
    if (!parentId) continue;
    byParent.set(parentId, [...(byParent.get(parentId) ?? []), atom.id]);
  }
  byParent.forEach((ids) => {
    if (ids.length < 2) return;
    ids.forEach((id, index) => {
      const current = positions.get(id);
      if (!current) return;
      positions.set(id, [current[0], current[1] * (index % 2 === 0 ? 1 : -1), current[2] * (index % 2 === 0 ? 1 : -1)]);
    });
  });
}

function inferHybridization(atomId: string, bonds: Bond3D[]): Hybridization {
  const attached = bonds.filter((bond) => bond.from === atomId || bond.to === atomId);
  if (attached.some((bond) => bond.order === 3)) return "sp";
  if (attached.some((bond) => bond.order === 2)) return "sp2";
  return "sp3";
}
