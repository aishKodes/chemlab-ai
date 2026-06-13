import type { AtomElement, AtomRole, BondOrder } from "@/components/labs/hydrocarbon-quest/3d/molecule3DTypes";

export const BOND_LENGTHS_ANGSTROM = {
  C_H: 1.09,
  C_C_SINGLE: 1.54,
  C_C_DOUBLE: 1.34,
  C_C_TRIPLE: 1.2,
} as const;

export const BOND_ANGLES_DEGREES = {
  SP3_TETRAHEDRAL: 109.5,
  SP2_TRIGONAL_PLANAR: 120,
  SP_LINEAR: 180,
} as const;

export const DISPLAY_SCALE = 1.35;

export const ATOM_DISPLAY_RADII: Record<AtomElement, number> = {
  C: 0.36,
  H: 0.2,
};

export const HYDROCARBON_COLORS: Record<AtomRole | "singleBond" | "doubleBondA" | "doubleBondB" | "tripleBond" | "selected" | "correct" | "wrong", string> = {
  main: "#38bdf8",
  methyl: "#fb923c",
  ethyl: "#4ade80",
  hydrogen: "#f8fafc",
  other: "#c084fc",
  singleBond: "#dbeafe",
  doubleBondA: "#f472b6",
  doubleBondB: "#fbbf24",
  tripleBond: "#a78bfa",
  selected: "#f59e0b",
  correct: "#22c55e",
  wrong: "#fb7185",
};

export const BOND_DISPLAY_RADIUS: Record<BondOrder, number> = {
  1: 0.055,
  2: 0.045,
  3: 0.04,
};

export const BOND_PARALLEL_OFFSET: Record<BondOrder, number> = {
  1: 0,
  2: 0.09,
  3: 0.11,
};
