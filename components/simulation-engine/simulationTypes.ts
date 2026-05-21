import type { MasterAlchemMood } from "@/components/master-alchem/MasterAlchemMood";

export type CinematicPhase = "story" | "experiment" | "challenge" | "reward";

export type SimulationStep = {
  id: string;
  label: string;
  description: string;
};

export type ChallengeOption = {
  id: string;
  label: string;
  feedback: string;
};

export type SimulationChallenge = {
  question: string;
  correctOptionId: string;
  hint: string;
  options: ChallengeOption[];
};

export type CinematicSceneConfig = {
  id: string;
  phase: CinematicPhase;
  eyebrow: string;
  title: string;
  description: string;
  masterAlchemMood?: MasterAlchemMood;
  masterAlchemMessage: string;
  stageLabel?: string;
};

export type CinematicLessonConfig = {
  title: string;
  subtitle: string;
  badge: string;
  rewardTitle: string;
  rewardDetail: string;
  xpReward: number;
  steps: SimulationStep[];
  scenes: CinematicSceneConfig[];
  challenge: SimulationChallenge;
};
