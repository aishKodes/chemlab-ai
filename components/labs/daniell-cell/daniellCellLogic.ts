import type { DaniellBuildState, DaniellChallengeQuestion, DaniellPhase } from "@/components/labs/daniell-cell/daniellCellTypes";

export const DANIELL_CELL_VOLTAGE = 1.1;

export const initialDaniellBuildState: DaniellBuildState = {
  zincPlaced: false,
  copperPlaced: false,
  wireConnected: false,
  saltBridgeAdded: false,
  cellStarted: false,
};

export function clampProgress(value: number) {
  return Math.min(1, Math.max(0, value));
}

export function getCellVoltage(progress: number) {
  const eased = 1 - (1 - clampProgress(progress)) ** 3;
  return Number((DANIELL_CELL_VOLTAGE * eased).toFixed(2));
}

export function getAnode() {
  return "Zinc";
}

export function getCathode() {
  return "Copper";
}

export function getElectronFlowDirection() {
  return "Zinc to Copper";
}

export function getOxidationHalfReaction() {
  return "Zn → Zn²⁺ + 2e⁻";
}

export function getReductionHalfReaction() {
  return "Cu²⁺ + 2e⁻ → Cu";
}

export function getOverallReaction() {
  return "Zn + Cu²⁺ → Zn²⁺ + Cu";
}

export function getCellNotation() {
  return "Zn | Zn²⁺ || Cu²⁺ | Cu";
}

export function calculateProgressFromSteps(buildState: DaniellBuildState, phase: DaniellPhase) {
  const completed = [
    buildState.zincPlaced,
    buildState.copperPlaced,
    buildState.wireConnected,
    buildState.saltBridgeAdded,
    buildState.cellStarted,
    phase === "challenge" || phase === "explanation" || phase === "reward",
    phase === "explanation" || phase === "reward",
    phase === "reward",
  ].filter(Boolean).length;

  return Math.round((completed / 8) * 100);
}

export function checkChallengeAnswer(question: DaniellChallengeQuestion, optionId: string) {
  return question.correctOptionId === optionId;
}

export function getPhaseStep(phase: DaniellPhase, buildState: DaniellBuildState) {
  if (phase === "cinematic_intro") return 1;
  if (phase === "setup_cell" && !buildState.zincPlaced) return 2;
  if (phase === "setup_cell" && !buildState.copperPlaced) return 3;
  if (phase === "connect_circuit") return 4;
  if (phase === "add_salt_bridge") return 5;
  if (phase === "start_reaction") return 6;
  if (phase === "observe_flow") return 7;
  if (phase === "challenge") return 8;
  if (phase === "explanation") return 9;
  return 9;
}

export function isReactionVisible(phase: DaniellPhase) {
  return phase === "observe_flow" || phase === "challenge" || phase === "explanation" || phase === "reward";
}
