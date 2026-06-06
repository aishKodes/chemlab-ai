import type { ReactNode } from "react";

export type HydrocarbonLevelId = "butane" | "methylpentane" | "butene";

export type HydrocarbonQuestMode = "story" | "level" | "success" | "final";

export type HydrocarbonCharacter = "Kabir" | "Aparna" | "Master Alchem";

export type HydrocarbonPose =
  | "idle"
  | "speaking"
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
  label?: string;
  x: number;
  y: number;
};

export type MoleculeBond = {
  from: string;
  to: string;
  type: "single" | "double";
};

export type MoleculeGraphData = {
  id: string;
  atoms: MoleculeAtom[];
  bonds: MoleculeBond[];
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

export type HydrocarbonLevel = {
  id: HydrocarbonLevelId;
  title: string;
  subtitle: string;
  targetName: string;
  formula: string;
  xp: number;
  learningGoal: string;
  molecule: MoleculeGraphData;
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
};

export type SlotMap = Record<string, string | undefined>;

export type HydrocarbonStageAction = {
  id: string;
  label: string;
  disabled?: boolean;
  icon?: ReactNode;
};
