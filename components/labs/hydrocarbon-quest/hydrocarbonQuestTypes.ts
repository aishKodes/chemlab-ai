import type { ReactNode } from "react";
import type { Molecule3DData } from "@/components/labs/hydrocarbon-quest/3d/molecule3DTypes";

export type HydrocarbonLevelId = string;

export type HydrocarbonModuleId =
  | "family_lineage"
  | "cousin_branches"
  | "vip_double_bonds"
  | "triple_bond_trails"
  | "numbering_arena"
  | "senior_secondary_boss";

export type HydrocarbonQuestMode = "story" | "map" | "level" | "success" | "final";

export type HydrocarbonCharacter = "Kabir" | "Aparna" | "Master Alchem";

export type HydrocarbonPose =
  | "idle"
  | "speaking"
  | "listening"
  | "explaining"
  | "thinking"
  | "confused"
  | "warning"
  | "celebrating"
  | "pointing"
  | "success";

export type DialogueLine = {
  speaker: HydrocarbonCharacter;
  pose: HydrocarbonPose;
  text: string;
  duration?: number;
  emotion?: string;
};

export type MoleculeAtom = {
  id: string;
  element: "C" | "H";
  role?: "main" | "methyl" | "ethyl" | "other" | "hydrogen";
  label?: string;
  x: number;
  y: number;
};

export type MoleculeBond = {
  from: string;
  to: string;
  type: "single" | "double" | "triple";
};

export type MoleculeGraphData = {
  id: string;
  atoms: MoleculeAtom[];
  bonds: MoleculeBond[];
  showHydrogens?: boolean;
};

export type NamingSlot = {
  id: string;
  label: string;
  helper: string;
};

export type NamingBlock = {
  id: string;
  label: string;
  kind: "rank" | "prefix" | "root" | "suffix" | "distractor";
};

export type NumberingOption = {
  id: "left" | "right";
  label: string;
  branchPosition?: number;
  doubleBondPosition?: number;
  correct: boolean;
};

export type HydrocarbonTask =
  | {
      type: "trace_main_chain";
      correctSequence: string[];
      wrongHint: string;
    }
  | {
      type: "choose_numbering_direction";
      correctDirection: "left_to_right" | "right_to_left" | "none";
      wrongHint: string;
    }
  | {
      type: "assemble_name";
      availableBlocks: string[];
      correctBlocks: string[];
    };

export type HydrocarbonLevel = {
  id: HydrocarbonLevelId;
  moduleId: HydrocarbonModuleId;
  title: string;
  subtitle: string;
  targetName: string;
  formula: string;
  difficulty: "beginner" | "beginner-plus" | "intermediate" | "senior-secondary";
  status: "playable" | "locked" | "coming-soon";
  xp: number;
  learningGoal: string;
  molecule: MoleculeGraphData;
  molecule3D?: Molecule3DData;
  tasks: HydrocarbonTask[];
  correctChainSequence: string[];
  chainCompleteMessage: string;
  availableBlocks: NamingBlock[];
  slots: NamingSlot[];
  correctSlotSolution: Record<string, string>;
  dialogue: DialogueLine[];
  wrongPathHint?: string;
  numberingOptions?: NumberingOption[];
  successMessage: string;
  successKind: "flame" | "chain" | "badge";
  explanation: string;
  previewAssetRole?: string;
};

export type SlotMap = Record<string, string | undefined>;

export type HydrocarbonStageAction = {
  id: string;
  label: string;
  disabled?: boolean;
  icon?: ReactNode;
};
