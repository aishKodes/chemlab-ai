import { redoxAgentQuestions } from "./redoxQuestData";
import type { RedoxFeedback } from "./redoxTypes";

export function validateSpectatorIon(selected: string[]): RedoxFeedback {
  const required = ["reactant_sulfate", "product_sulfate"];
  const hasBoth = required.every((id) => selected.includes(id));

  if (hasBoth) {
    return {
      correct: true,
      message: "Correct. SO₄²⁻ is present on both sides, so it is the spectator.",
    };
  }

  return {
    correct: false,
    message: "You found part of it. The spectator must appear unchanged on both sides.",
    hint: "Tap SO₄²⁻ in CuSO₄ and SO₄²⁻ in ZnSO₄.",
  };
}

export function validateElectronTransfer(from: string, to: string): RedoxFeedback {
  if (from === "Zn" && to === "Cu2+") {
    return {
      correct: true,
      message: "Exactly. Electrons travel from zinc to copper ion.",
    };
  }

  return {
    correct: false,
    message: "Try again. The giver must be zinc, and the receiver must be copper ion.",
    hint: "LEO happens at zinc. GER happens at Cu²⁺.",
  };
}

export function validateAgentAnswer(questionId: string, answer: string): RedoxFeedback {
  const question = redoxAgentQuestions.find((item) => item.id === questionId);

  if (!question) {
    return { correct: false, message: "That question is not ready yet." };
  }

  if (answer === question.correctAnswer) {
    return { correct: true, message: question.explanation };
  }

  if (questionId === "reducing_agent") {
    return {
      correct: false,
      message: "Not quite. The reducing agent is the one that gives electrons away.",
      hint: "Who lost electrons and became Zn²⁺?",
    };
  }

  if (questionId === "oxidizing_agent") {
    return {
      correct: false,
      message: "Close, but the oxidizing agent is the electron receiver.",
      hint: "Which ion gained the two electrons?",
    };
  }

  return {
    correct: false,
    message: "Mistakes are clues. Follow the electrons and try once more.",
    hint: "Loss means oxidation. Gain means reduction.",
  };
}

export function formatIonLabel(raw: string) {
  return raw
    .replace(/SO4-2/g, "SO₄²⁻")
    .replace(/Cu2\+/g, "Cu²⁺")
    .replace(/Zn2\+/g, "Zn²⁺")
    .replace(/e-/g, "e⁻");
}

export function formatElectronCount(count: number) {
  return `${count}e⁻`;
}
