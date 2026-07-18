import type { MoleculeAtom, MoleculeBond, NcertMolecule } from "./moleculeGeometryTypes";

export const elementVisuals: Record<string, { color: string; radius: number }> = {
  H: { color: "#f8fafc", radius: 0.15 },
  C: { color: "#1f2937", radius: 0.28 },
  N: { color: "#2563eb", radius: 0.29 },
  O: { color: "#ef4444", radius: 0.3 },
  F: { color: "#22c55e", radius: 0.25 },
  Cl: { color: "#16a34a", radius: 0.33 },
  Br: { color: "#92400e", radius: 0.36 },
  I: { color: "#7c3aed", radius: 0.4 },
  B: { color: "#f59e0b", radius: 0.26 },
  Be: { color: "#94a3b8", radius: 0.25 },
  P: { color: "#f97316", radius: 0.34 },
  S: { color: "#facc15", radius: 0.34 },
  Xe: { color: "#a855f7", radius: 0.42 },
  Na: { color: "#38bdf8", radius: 0.38 },
  Ca: { color: "#818cf8", radius: 0.4 },
  Cu: { color: "#c2410c", radius: 0.34 },
  Ni: { color: "#64748b", radius: 0.34 },
  Co: { color: "#0f766e", radius: 0.34 },
  Fe: { color: "#b45309", radius: 0.34 },
  default: { color: "#64748b", radius: 0.28 },
};

export function atom(id: string, element: string, position: [number, number, number], extra: Partial<MoleculeAtom> = {}): MoleculeAtom {
  return { id, element, position, ...extra };
}

export function bond(from: string, to: string, order: 1 | 2 | 3 | 1.5 = 1, label?: string): MoleculeBond {
  return { from, to, order, label };
}

export function tetrahedralSubstituents(scale = 1.05): [number, number, number][] {
  return [
    [scale, scale, scale],
    [-scale, -scale, scale],
    [-scale, scale, -scale],
    [scale, -scale, -scale],
  ];
}

export function octahedralSubstituents(scale = 1.25): [number, number, number][] {
  return [
    [scale, 0, 0],
    [-scale, 0, 0],
    [0, scale, 0],
    [0, -scale, 0],
    [0, 0, scale],
    [0, 0, -scale],
  ];
}

export function squarePlanarSubstituents(scale = 1.2): [number, number, number][] {
  return [
    [scale, 0, 0],
    [-scale, 0, 0],
    [0, scale, 0],
    [0, -scale, 0],
  ];
}

export function trigonalPlanarSubstituents(scale = 1.12): [number, number, number][] {
  return [
    [0, scale, 0],
    [-0.97 * scale, -0.56 * scale, 0],
    [0.97 * scale, -0.56 * scale, 0],
  ];
}

export function benzeneAtoms(prefix = ""): MoleculeAtom[] {
  const atoms: MoleculeAtom[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i;
    atoms.push(atom(`${prefix}C${i + 1}`, "C", [Math.cos(angle), Math.sin(angle), 0], { role: "framework" }));
    atoms.push(atom(`${prefix}H${i + 1}`, "H", [1.45 * Math.cos(angle), 1.45 * Math.sin(angle), 0]));
  }
  return atoms;
}

export function benzeneBonds(prefix = ""): MoleculeBond[] {
  const bonds: MoleculeBond[] = [];
  for (let i = 1; i <= 6; i++) {
    const next = i === 6 ? 1 : i + 1;
    bonds.push(bond(`${prefix}C${i}`, `${prefix}C${next}`, 1.5, "aromatic"));
    bonds.push(bond(`${prefix}C${i}`, `${prefix}H${i}`));
  }
  return bonds;
}

export function chainAtoms(count: number, idPrefix = "C", startX = 0, spacing = 0.78): MoleculeAtom[] {
  const offset = ((count - 1) * spacing) / 2;
  return Array.from({ length: count }, (_, index) => atom(`${idPrefix}${index + 1}`, "C", [startX + index * spacing - offset, index % 2 ? 0.22 : -0.22, 0]));
}

export function chainBonds(count: number, idPrefix = "C", doubleAt?: number, tripleAt?: number): MoleculeBond[] {
  return Array.from({ length: count - 1 }, (_, index) => {
    const order = tripleAt === index + 1 ? 3 : doubleAt === index + 1 ? 2 : 1;
    return bond(`${idPrefix}${index + 1}`, `${idPrefix}${index + 2}`, order, order === 2 ? "double" : order === 3 ? "triple" : undefined);
  });
}

export function attachSimpleHydrogens(carbons: MoleculeAtom[], bonds: MoleculeBond[], maxPerCarbon = 3): { atoms: MoleculeAtom[]; bonds: MoleculeBond[] } {
  const atoms = [...carbons];
  const nextBonds = [...bonds];
  const bondOrderFor = (carbonId: string) =>
    bonds.reduce((sum, item) => (item.from === carbonId || item.to === carbonId ? sum + item.order : sum), 0);

  for (const carbon of carbons) {
    const needed = Math.max(0, Math.min(maxPerCarbon, Math.round(4 - bondOrderFor(carbon.id))));
    const [x, y, z] = carbon.position;
    for (let i = 0; i < needed; i++) {
      const angle = (Math.PI * 2 * i) / Math.max(needed, 1) + (carbon.position[1] > 0 ? 0.3 : -0.3);
      const id = `${carbon.id}H${i + 1}`;
      atoms.push(atom(id, "H", [x + Math.cos(angle) * 0.46, y + Math.sin(angle) * 0.46, z + (i % 2 ? 0.2 : -0.2)]));
      nextBonds.push(bond(carbon.id, id));
    }
  }
  return { atoms, bonds: nextBonds };
}

export function molecule(entry: NcertMolecule): NcertMolecule {
  return entry;
}
