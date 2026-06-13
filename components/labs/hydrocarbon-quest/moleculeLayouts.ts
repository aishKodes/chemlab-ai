import type { MoleculeAtom, MoleculeBond, MoleculeGraphData } from "@/components/labs/hydrocarbon-quest/hydrocarbonQuestTypes";

const startXByLength: Record<number, number> = {
  1: 400,
  2: 330,
  3: 250,
  4: 180,
  5: 120,
  6: 80,
};

export function straightChainMolecule(id: string, carbonCount: number, bondType: "single" | "double" | "triple" = "single"): MoleculeGraphData {
  const spacing = carbonCount <= 3 ? 170 : carbonCount === 4 ? 145 : 125;
  const startX = startXByLength[carbonCount] ?? 80;
  const y = 245;
  return {
    id,
    showHydrogens: true,
    atoms: Array.from({ length: carbonCount }).map((_, index) => ({
      id: `c${index + 1}`,
      element: "C" as const,
      role: "main" as const,
      label: carbonCount === 1 ? "C" : undefined,
      x: startX + index * spacing,
      y,
    })),
    bonds: Array.from({ length: carbonCount - 1 }).map((_, index) => ({
      from: `c${index + 1}`,
      to: `c${index + 2}`,
      type: index === 0 ? bondType : "single",
    })),
  };
}

export function methylBranchedMolecule(id: string, mainCount: number, methylPositions: number[]): MoleculeGraphData {
  const spacing = mainCount <= 4 ? 145 : 125;
  const startX = startXByLength[mainCount] ?? 80;
  const y = 245;
  const atoms: MoleculeAtom[] = Array.from({ length: mainCount }).map((_, index) => ({
    id: `c${index + 1}`,
    element: "C" as const,
    role: "main" as const,
    x: startX + index * spacing,
    y,
  }));
  const bonds: MoleculeBond[] = Array.from({ length: mainCount - 1 }).map((_, index) => ({
    from: `c${index + 1}`,
    to: `c${index + 2}`,
    type: "single",
  }));
  const branchCounts = new Map<number, number>();

  for (const position of methylPositions) {
    const count = (branchCounts.get(position) ?? 0) + 1;
    branchCounts.set(position, count);
    const parent = atoms[position - 1];
    const branchId = `m${position}_${count}`;
    const yOffset = count % 2 === 1 ? -130 : 130;
    atoms.push({
      id: branchId,
      element: "C" as const,
      role: "methyl" as const,
      x: parent.x,
      y: parent.y + yOffset,
    });
    bonds.push({ from: parent.id, to: branchId, type: "single" });
  }

  return { id, showHydrogens: true, atoms, bonds };
}

export function alkeneMolecule(id: string, carbonCount: number, doubleBondStart: number): MoleculeGraphData {
  const molecule = straightChainMolecule(id, carbonCount);
  molecule.bonds = molecule.bonds.map((bond) =>
    bond.from === `c${doubleBondStart}` && bond.to === `c${doubleBondStart + 1}` ? { ...bond, type: "double" } : bond,
  );
  return molecule;
}

export function alkyneMolecule(id: string, carbonCount: number, tripleBondStart: number): MoleculeGraphData {
  const molecule = straightChainMolecule(id, carbonCount);
  molecule.bonds = molecule.bonds.map((bond) =>
    bond.from === `c${tripleBondStart}` && bond.to === `c${tripleBondStart + 1}` ? { ...bond, type: "triple" } : bond,
  );
  return molecule;
}
