import type { RedoxGameMode, RedoxLedgerState, RedoxLevelId, RedoxStep } from "./redoxTypes";

export type RedoxSpeciesState = "Zn" | "Zn²⁺" | "Cu²⁺" | "Cu";

export type RedoxGameState = {
  currentLevelIndex: number;
  currentStep: RedoxStep;
  selectedItems: string[];
  transferredElectrons: number;
  murukkuTransferred: boolean;
  zincState: RedoxSpeciesState;
  copperState: RedoxSpeciesState;
  selectedAnswer?: string;
  reactionRun: boolean;
  agentAnswers: Record<string, string>;
  completedLevels: RedoxLevelId[];
  mistakes: number;
  hintsUsed: number;
  mode: RedoxGameMode;
  isAnimating: boolean;
  ledgerState: RedoxLedgerState;
  feedback?: string;
};

export const initialLedgerState: RedoxLedgerState = {
  giverIdentified: false,
  receiverIdentified: false,
  electronsTransferred: false,
  oxidationDetected: false,
  reductionDetected: false,
  spectatorRemoved: false,
  redoxLinked: false,
};

export const initialRedoxGameState: RedoxGameState = {
  currentLevelIndex: 0,
  currentStep: "objective",
  selectedItems: [],
  transferredElectrons: 0,
  murukkuTransferred: false,
  zincState: "Zn",
  copperState: "Cu²⁺",
  agentAnswers: {},
  completedLevels: [],
  mistakes: 0,
  hintsUsed: 0,
  mode: "game",
  isAnimating: false,
  reactionRun: false,
  ledgerState: initialLedgerState,
};

export const redoxSuccessConditions: Record<RedoxLevelId, string> = {
  murukku_transaction: "murukkuTransferred === true",
  electron_transaction: "transferredElectrons === 2 and Zn state is Zn²⁺ and Cu state is Cu",
  oxidation_gate: "selectedAnswer === oxidation",
  reduction_gate: "selectedAnswer === reduction",
  spectator_cleanup: "both spectator ions selected",
  simultaneous_redox: "reactionRun === true and oxidation/reduction labels revealed",
  agents_challenge: "all four agent answers correct",
};
