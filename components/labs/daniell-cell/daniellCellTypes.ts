import type { MasterAlchemMood } from "@/components/master-alchem/MasterAlchemMood";

export type DaniellPhase =
  | "cinematic_intro"
  | "setup_cell"
  | "connect_circuit"
  | "add_salt_bridge"
  | "start_reaction"
  | "observe_flow"
  | "challenge"
  | "explanation"
  | "reward";

export type DaniellBuildState = {
  zincPlaced: boolean;
  copperPlaced: boolean;
  wireConnected: boolean;
  saltBridgeAdded: boolean;
  cellStarted: boolean;
};

export type DaniellAction = {
  id: string;
  label: string;
  helper: string;
  disabled?: boolean;
};

export type DaniellPhaseStory = {
  phase: DaniellPhase;
  title: string;
  eyebrow: string;
  prompt: string;
  masterAlchemMessage: string;
  mood: MasterAlchemMood;
};

export type DaniellChallengeOption = {
  id: string;
  label: string;
  feedback: string;
};

export type DaniellChallengeQuestion = {
  id: string;
  question: string;
  options: DaniellChallengeOption[];
  correctOptionId: string;
  hint: string;
};

export type DaniellAnswerState = {
  selectedOptionId?: string;
  isCorrect?: boolean;
};

export type DaniellSceneSnapshot = {
  phase: DaniellPhase;
  buildState: DaniellBuildState;
  reactionProgress: number;
  voltage: number;
  reducedMotion: boolean;
};
