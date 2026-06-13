import * as THREE from "three";
import type { BuiltMolecule3D, Molecule3DValidationWarning } from "@/components/labs/hydrocarbon-quest/3d/molecule3DTypes";
import { calculateFormulaCounts, distanceBetweenAtoms, formulaCountsEqual, formulaCountsToString, parseFormulaCounts } from "@/components/labs/hydrocarbon-quest/3d/labelUtils";

export function validateMolecule3D(molecule: Omit<BuiltMolecule3D, "warnings">): Molecule3DValidationWarning[] {
  const warnings: Molecule3DValidationWarning[] = [];
  const atomIds = new Set<string>();

  for (const atom of molecule.atoms) {
    if (atomIds.has(atom.id)) {
      warnings.push({ code: "duplicate_atom_id", atomId: atom.id, message: `Duplicate atom id ${atom.id}.` });
    }
    atomIds.add(atom.id);
  }

  for (const bond of molecule.bonds) {
    if (![1, 2, 3].includes(bond.order)) {
      warnings.push({ code: "invalid_bond_order", bondId: `${bond.from}-${bond.to}`, message: `Invalid bond order ${bond.order}.` });
    }
    const from = molecule.atoms.find((atom) => atom.id === bond.from);
    const to = molecule.atoms.find((atom) => atom.id === bond.to);
    if (!from || !to) {
      warnings.push({ code: "missing_substituent_atom", bondId: `${bond.from}-${bond.to}`, message: `Bond ${bond.from}-${bond.to} references a missing atom.` });
      continue;
    }
    if (new THREE.Vector3(...from.position).distanceTo(new THREE.Vector3(...to.position)) < 0.05) {
      warnings.push({ code: "zero_length_bond", bondId: `${bond.from}-${bond.to}`, message: `Bond ${bond.from}-${bond.to} has almost zero length.` });
    }
  }

  for (const atom of molecule.atoms) {
    const valence = molecule.bonds
      .filter((bond) => bond.from === atom.id || bond.to === atom.id)
      .reduce((sum, bond) => sum + bond.order, 0);
    if (atom.element === "C" && valence !== 4) {
      warnings.push({ code: "carbon_valence_not_four", atomId: atom.id, message: `${atom.id} has valence ${valence}, expected 4 after hydrogens.` });
    }
    if (atom.element === "H" && valence !== 1) {
      warnings.push({ code: "hydrogen_valence_not_one", atomId: atom.id, message: `${atom.id} has valence ${valence}, expected 1.` });
    }
  }

  for (const atomId of molecule.level.correctChainSequence) {
    if (!atomIds.has(atomId)) {
      warnings.push({ code: "missing_correct_main_chain", atomId, message: `Main-chain atom ${atomId} does not exist.` });
    }
  }

  for (const substituent of molecule.level.molecule3D?.substituents ?? []) {
    for (const atomId of substituent.atomIds) {
      if (!atomIds.has(atomId)) {
        warnings.push({ code: "missing_substituent_atom", atomId, message: `Substituent atom ${atomId} does not exist.` });
      }
    }
  }

  const calculated = calculateFormulaCounts({ ...molecule, warnings: [] });
  const expected = parseFormulaCounts(molecule.level.formula);
  if (expected.size && !formulaCountsEqual(calculated, expected)) {
    warnings.push({
      code: "formula_mismatch",
      message: `Formula mismatch: level shows ${molecule.level.formula}, generated molecule is ${formulaCountsToString(calculated)}.`,
    });
  }

  const multipleBonds = molecule.bonds.filter((bond) => bond.order > 1 && !bond.from.includes("_h") && !bond.to.includes("_h"));
  for (const bond of multipleBonds) {
    const fromIndex = molecule.level.correctChainSequence.indexOf(bond.from);
    const toIndex = molecule.level.correctChainSequence.indexOf(bond.to);
    if (fromIndex === -1 || toIndex === -1 || Math.abs(fromIndex - toIndex) !== 1) {
      warnings.push({
        code: bond.order === 2 ? "invalid_double_bond_locant" : "invalid_triple_bond_locant",
        bondId: `${bond.from}-${bond.to}`,
        message: `Multiple bond ${bond.from}-${bond.to} is not on adjacent parent-chain atoms.`,
      });
    }
  }

  for (let a = 0; a < molecule.atoms.length; a += 1) {
    for (let b = a + 1; b < molecule.atoms.length; b += 1) {
      const first = molecule.atoms[a];
      const second = molecule.atoms[b];
      if (distanceBetweenAtoms(first, second) < 0.2) {
        warnings.push({ code: "overlapping_atoms", atomId: first.id, message: `${first.id} is very close to ${second.id}.` });
      }
    }
  }

  return warnings;
}
