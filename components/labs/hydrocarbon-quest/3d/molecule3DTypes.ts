import type { HydrocarbonLevel, NumberingOption } from "@/components/labs/hydrocarbon-quest/hydrocarbonQuestTypes";

export type AtomElement = "C" | "H";
export type AtomRole = "main" | "methyl" | "ethyl" | "hydrogen" | "other";
export type Hybridization = "sp3" | "sp2" | "sp";
export type BondOrder = 1 | 2 | 3;
export type Vec3 = [number, number, number];

export type Atom3D = {
  id: string;
  element: AtomElement;
  role?: AtomRole;
  hybridization?: Hybridization;
  position?: Vec3;
  autoHydrogens?: boolean;
  parentAtomId?: string;
};

export type Bond3D = {
  from: string;
  to: string;
  order: BondOrder;
  lengthAngstrom?: number;
};

export type Substituent3D = {
  id: string;
  type: "methyl" | "ethyl";
  atomIds: string[];
  parentAtomId: string;
  locant: number;
};

export type Molecule3DData = {
  id: string;
  name: string;
  formula: string;
  atoms: Atom3D[];
  bonds: Bond3D[];
  generateHydrogens: boolean;
  geometryMode: "auto" | "manual";
  correctMainChain: string[];
  substituents?: Substituent3D[];
};

export type BuiltAtom3D = Required<Pick<Atom3D, "id" | "element">> & {
  role: AtomRole;
  hybridization: Hybridization;
  position: Vec3;
  parentAtomId?: string;
  generated?: boolean;
};

export type BuiltBond3D = Required<Pick<Bond3D, "from" | "to" | "order" | "lengthAngstrom">>;

export type BuiltMolecule3D = {
  level: HydrocarbonLevel;
  atoms: BuiltAtom3D[];
  bonds: BuiltBond3D[];
  warnings: Molecule3DValidationWarning[];
};

export type Molecule3DValidationWarning = {
  code:
    | "carbon_valence_not_four"
    | "hydrogen_valence_not_one"
    | "missing_hydrogens"
    | "overlapping_atoms"
    | "invalid_bond_order"
    | "invalid_double_bond_locant"
    | "invalid_triple_bond_locant"
    | "wrong_hybridization"
    | "missing_correct_main_chain"
    | "missing_substituent_atom"
    | "formula_mismatch"
    | "duplicate_atom_id"
    | "zero_length_bond";
  message: string;
  atomId?: string;
  bondId?: string;
};

export type Molecule3DStageProps = {
  level: HydrocarbonLevel;
  selectedAtoms: string[];
  wrongAtoms?: string[];
  numberingOption?: NumberingOption;
  glowing?: boolean;
  onAtomClick?: (atomId: string) => void;
  className?: string;
};

export type Molecule3DRenderOptions = {
  showHydrogens: boolean;
  showLabels: boolean;
  showHydrogenLabels: boolean;
  showMeasurements: boolean;
  autoRotate: boolean;
  labelMode: "clean" | "learning" | "measurement";
};
