export type CoordinateSource = "pubchem" | "idealized_vsepr" | "hand_curated" | "literature" | "simplified";
export type AccuracyLevel = "school_level" | "pubchem_3d" | "idealized" | "simplified";
export type MoleculeCategory =
  | "vsepr"
  | "organic"
  | "inorganic"
  | "coordination"
  | "hydrocarbon"
  | "functional_group"
  | "ionic"
  | "biomolecule";

export type MoleculeAtom = {
  id: string;
  element: string;
  position: [number, number, number];
  charge?: string;
  label?: string;
  role?: "central" | "terminal" | "ligand" | "counterion" | "framework";
};

export type MoleculeBond = {
  from: string;
  to: string;
  order: 1 | 2 | 3 | 1.5;
  lengthAngstrom?: number;
  label?: string;
};

export type LonePair = {
  atomId: string;
  count: number;
  positions?: [number, number, number][];
};

export type NcertMolecule = {
  id: string;
  name: string;
  formula: string;
  classLevels: Array<"10" | "11" | "12">;
  chapters: string[];
  topics: string[];
  categories: MoleculeCategory[];
  geometry: string;
  hybridization?: string;
  bondAngles: string[];
  atoms: MoleculeAtom[];
  bonds: MoleculeBond[];
  lonePairs?: LonePair[];
  coordinateSource: CoordinateSource;
  sourceUrl?: string;
  accuracyLevel: AccuracyLevel;
  notes: string;
  lastReviewed: string;
};
