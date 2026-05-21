import type { ReactNode } from "react";
import type { MasterAlchemMood } from "@/components/master-alchem/MasterAlchemMood";

export type LabPhaseKind = "intro" | "experiment" | "challenge" | "explanation" | "reward";

export type LabAction = {
  id: string;
  label: string;
  helper?: string;
  disabled?: boolean;
  tone?: "primary" | "secondary" | "ghost" | "danger";
};

export type LabChallengeOption = {
  id: string;
  label: string;
  feedback: string;
};

export type LabChallenge = {
  question: string;
  options: LabChallengeOption[];
  correctOptionId: string;
  hint: string;
};

export type LabReward = {
  title: string;
  detail: string;
  xp: number;
  badge?: string;
};

export type LabShellProps = {
  title: string;
  subtitle?: string;
  phase: string;
  phaseKind?: LabPhaseKind;
  progress: number;
  xp: number;
  badge?: string;
  voltage?: string;
  masterAlchemMessage: string;
  masterAlchemMood: MasterAlchemMood;
  children: ReactNode;
  actions?: LabAction[];
  onAction?: (actionId: string) => void;
  sidePanel?: ReactNode;
  challenge?: ReactNode;
  reward?: ReactNode;
  allowCompactMode?: boolean;
};
