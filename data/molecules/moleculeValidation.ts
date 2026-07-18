import type { MoleculeBond, NcertMolecule } from "./moleculeGeometryTypes";

const valenceMax: Record<string, number> = {
  H: 1,
  C: 4,
  N: 4,
  O: 3,
  F: 1,
  Cl: 1,
  Br: 1,
  I: 1,
  B: 3,
  Be: 2,
  P: 6,
  S: 6,
  Xe: 8,
  Na: 1,
  Ca: 2,
  Cu: 6,
  Ni: 6,
  Co: 6,
  Fe: 6,
};

export type MoleculeValidationWarning = {
  moleculeId: string;
  severity: "warning" | "error";
  message: string;
};

export function validateMolecule(molecule: NcertMolecule): MoleculeValidationWarning[] {
  const warnings: MoleculeValidationWarning[] = [];
  const atomIds = new Set<string>();

  for (const atom of molecule.atoms) {
    if (atomIds.has(atom.id)) {
      warnings.push({ moleculeId: molecule.id, severity: "error", message: `Duplicate atom id: ${atom.id}` });
    }
    atomIds.add(atom.id);
  }

  for (const bond of molecule.bonds) {
    if (!atomIds.has(bond.from) || !atomIds.has(bond.to)) {
      warnings.push({ moleculeId: molecule.id, severity: "error", message: `Bond references missing atom: ${bond.from}-${bond.to}` });
    }
    if (![1, 1.5, 2, 3].includes(bond.order)) {
      warnings.push({ moleculeId: molecule.id, severity: "error", message: `Invalid bond order in ${bond.from}-${bond.to}` });
    }
  }

  if (!molecule.coordinateSource || !molecule.accuracyLevel || !molecule.notes || !molecule.lastReviewed) {
    warnings.push({ moleculeId: molecule.id, severity: "error", message: "Missing source or accuracy metadata." });
  }
  if (!molecule.geometry || !molecule.bondAngles.length) {
    warnings.push({ moleculeId: molecule.id, severity: "error", message: "Missing geometry or bond-angle label." });
  }

  for (const atom of molecule.atoms) {
    const max = valenceMax[atom.element];
    if (!max || molecule.categories.includes("coordination") || molecule.categories.includes("ionic")) continue;
    const order = valenceAround(atom.id, molecule.bonds);
    if (order > max + 0.1) {
      warnings.push({ moleculeId: molecule.id, severity: "warning", message: `${atom.id} exceeds normal school-level valence (${order}).` });
    }
  }

  return warnings;
}

export function validateMoleculeLibrary(molecules: NcertMolecule[]) {
  return molecules.flatMap(validateMolecule);
}

function valenceAround(atomId: string, bonds: MoleculeBond[]) {
  return bonds.reduce((sum, bond) => (bond.from === atomId || bond.to === atomId ? sum + bond.order : sum), 0);
}
