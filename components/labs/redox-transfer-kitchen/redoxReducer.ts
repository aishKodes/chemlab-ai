import { redoxAgentQuestions, redoxLevels } from "./redoxQuestData";
import { initialRedoxGameState } from "./redoxGameState";
import type { RedoxGameState } from "./redoxGameState";
import type { RedoxGameMode, RedoxLevelId } from "./redoxTypes";

export type RedoxGameAction =
  | { type: "set_mode"; mode: RedoxGameMode }
  | { type: "begin_animation" }
  | { type: "finish_animation" }
  | { type: "transfer_murukku" }
  | { type: "transfer_electrons" }
  | { type: "choose_gate_answer"; answer: string }
  | { type: "toggle_spectator"; id: string }
  | { type: "run_redox" }
  | { type: "answer_agent"; questionId: string; answer: string }
  | { type: "complete_current_level" }
  | { type: "next_level" }
  | { type: "reset_current_level" }
  | { type: "reset_game" }
  | { type: "set_feedback"; feedback?: string }
  | { type: "record_mistake"; feedback: string };

function currentLevelId(state: RedoxGameState): RedoxLevelId {
  return redoxLevels[state.currentLevelIndex]?.id ?? "murukku_transaction";
}

export function isCurrentLevelSuccessful(state: RedoxGameState) {
  const levelId = currentLevelId(state);

  if (levelId === "murukku_transaction") return state.murukkuTransferred;
  if (levelId === "electron_transaction") return state.transferredElectrons === 2 && state.zincState === "Zn²⁺" && state.copperState === "Cu";
  if (levelId === "oxidation_gate") return state.selectedAnswer === "oxidation";
  if (levelId === "reduction_gate") return state.selectedAnswer === "reduction";
  if (levelId === "spectator_cleanup") return state.selectedItems.includes("reactant_sulfate") && state.selectedItems.includes("product_sulfate");
  if (levelId === "simultaneous_redox") return state.reactionRun && state.ledgerState.redoxLinked;
  if (levelId === "agents_challenge") return redoxAgentQuestions.every((question) => state.agentAnswers[question.id] === question.correctAnswer);

  return false;
}

function completeLevel(state: RedoxGameState): RedoxGameState {
  const levelId = currentLevelId(state);
  return {
    ...state,
    currentStep: "result",
    completedLevels: state.completedLevels.includes(levelId) ? state.completedLevels : [...state.completedLevels, levelId],
    isAnimating: false,
  };
}

function resetLevelState(state: RedoxGameState): RedoxGameState {
  const levelId = currentLevelId(state);
  const shared = {
    ...state,
    currentStep: "objective" as const,
    selectedItems: [],
    selectedAnswer: undefined,
    isAnimating: false,
    feedback: undefined,
    mode: "game" as const,
    completedLevels: state.completedLevels.filter((id) => id !== levelId),
  };

  if (levelId === "murukku_transaction") return { ...shared, murukkuTransferred: false };
  if (levelId === "electron_transaction") return { ...shared, transferredElectrons: 0, zincState: "Zn", copperState: "Cu²⁺" };
  if (levelId === "simultaneous_redox") return { ...shared, reactionRun: false, transferredElectrons: 0, zincState: "Zn", copperState: "Cu²⁺", ledgerState: { ...state.ledgerState, redoxLinked: false } };
  if (levelId === "agents_challenge") return { ...shared, agentAnswers: {} };
  return shared;
}

export function redoxReducer(state: RedoxGameState, action: RedoxGameAction): RedoxGameState {
  if (action.type === "set_mode") return { ...state, mode: action.mode };
  if (action.type === "begin_animation") return { ...state, isAnimating: true, currentStep: "action", feedback: undefined };
  if (action.type === "finish_animation") return { ...state, isAnimating: false };
  if (action.type === "set_feedback") return { ...state, feedback: action.feedback };
  if (action.type === "record_mistake") return { ...state, mistakes: state.mistakes + 1, feedback: action.feedback };
  if (action.type === "reset_game") return initialRedoxGameState;
  if (action.type === "reset_current_level") return resetLevelState(state);

  if (action.type === "transfer_murukku") {
    return completeLevel({
      ...state,
      murukkuTransferred: true,
      feedback: "This is one transaction: Paati loses and Karthik gains at the same time.",
    });
  }

  if (action.type === "transfer_electrons") {
    return completeLevel({
      ...state,
      transferredElectrons: 2,
      zincState: "Zn²⁺",
      copperState: "Cu",
      feedback: "Zinc lost electrons. Copper ion gained electrons. This is redox.",
      ledgerState: {
        ...state.ledgerState,
        giverIdentified: true,
        receiverIdentified: true,
        electronsTransferred: true,
      },
    });
  }

  if (action.type === "choose_gate_answer") {
    const levelId = currentLevelId(state);
    const correct = (levelId === "oxidation_gate" && action.answer === "oxidation") || (levelId === "reduction_gate" && action.answer === "reduction");

    if (!correct) {
      return {
        ...state,
        selectedAnswer: action.answer,
        mistakes: state.mistakes + 1,
        feedback: levelId === "oxidation_gate" ? "Not yet. Zinc lost electrons, and loss has a special name." : "Not yet. Copper ion gained electrons, and gain has a special name.",
      };
    }

    return completeLevel({
      ...state,
      selectedAnswer: action.answer,
      feedback: levelId === "oxidation_gate" ? "Loss of Electrons = Oxidation. LEO badge unlocked." : "Gain of Electrons = Reduction. GER badge unlocked.",
      ledgerState: {
        ...state.ledgerState,
        oxidationDetected: state.ledgerState.oxidationDetected || levelId === "oxidation_gate",
        reductionDetected: state.ledgerState.reductionDetected || levelId === "reduction_gate",
      },
    });
  }

  if (action.type === "toggle_spectator") {
    const selectedItems = state.selectedItems.includes(action.id) ? state.selectedItems.filter((id) => id !== action.id) : [...state.selectedItems, action.id];
    const nextState: RedoxGameState = { ...state, selectedItems, currentStep: "action", feedback: "Tap both SO₄²⁻ ions that appear unchanged." };
    if (selectedItems.includes("reactant_sulfate") && selectedItems.includes("product_sulfate")) {
      return completeLevel({
        ...nextState,
        feedback: "SO₄²⁻ is unchanged, so it moves to the spectator gallery.",
        ledgerState: { ...state.ledgerState, spectatorRemoved: true },
      });
    }
    return nextState;
  }

  if (action.type === "run_redox") {
    return completeLevel({
      ...state,
      reactionRun: true,
      transferredElectrons: 2,
      zincState: "Zn²⁺",
      copperState: "Cu",
      feedback: "One electron transfer creates both events: zinc is oxidized and copper ion is reduced.",
      ledgerState: {
        ...state.ledgerState,
        giverIdentified: true,
        receiverIdentified: true,
        electronsTransferred: true,
        oxidationDetected: true,
        reductionDetected: true,
        redoxLinked: true,
      },
    });
  }

  if (action.type === "answer_agent") {
    const question = redoxAgentQuestions.find((item) => item.id === action.questionId);
    if (!question) return state;
    if (question.correctAnswer !== action.answer) {
      return {
        ...state,
        mistakes: state.mistakes + 1,
        feedback: action.questionId.includes("agent") ? "Follow the cause: the giver causes reduction, the receiver causes oxidation." : "Follow the electron: loss is oxidation, gain is reduction.",
      };
    }

    const agentAnswers = { ...state.agentAnswers, [action.questionId]: action.answer };
    const nextState: RedoxGameState = {
      ...state,
      agentAnswers,
      feedback: question.explanation,
    };

    if (redoxAgentQuestions.every((item) => agentAnswers[item.id] === item.correctAnswer)) {
      return completeLevel(nextState);
    }

    return nextState;
  }

  if (action.type === "complete_current_level") return completeLevel(state);

  if (action.type === "next_level") {
    const nextIndex = Math.min(state.currentLevelIndex + 1, redoxLevels.length);
    return {
      ...state,
      currentLevelIndex: nextIndex,
      currentStep: "objective",
      selectedItems: [],
      selectedAnswer: undefined,
      feedback: undefined,
      isAnimating: false,
      mode: "game",
    };
  }

  return state;
}
