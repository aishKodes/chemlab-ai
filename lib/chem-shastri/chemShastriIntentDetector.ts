import type { ChemShastriIntent, ChemShastriMode } from "./chemShastriTypes";

export function detectChemShastriIntent(message: string, mode: ChemShastriMode): ChemShastriIntent {
  const text = message.toLowerCase();
  if (mode === "check_my_answer") return "check_my_answer";
  if (mode === "quiz_me") return "quiz_feedback";
  if (mode === "lab_guide" || mode === "lab_guide_mode") return "lab_guide";
  if (mode === "teacher_mode") return "resource_recommendation";
  if (/\b(resource|lesson|worksheet|classroom|teach|activity|homework|assignment)\b/.test(text)) {
    return "resource_recommendation";
  }
  if (/\b(derive|prove|why exactly|mechanism|multi[- ]step|numerical|calculate|solve)\b/.test(text)) {
    return "hard_reasoning";
  }
  if (/\b(hint|clue|nudge)\b/.test(text)) return "lab_guide";
  if (/\b(what is|define|meaning|explain|difference between|why)\b/.test(text)) return "simple_explain";
  return "direct_answer";
}

export function shouldAskClarifyingQuestion(message: string) {
  const trimmed = message.trim();
  if (trimmed.length < 4) {
    return {
      shouldClarify: true,
      question: "What chemistry idea do you want to explore?",
    };
  }
  if (/^(help|explain|solve|answer)$/i.test(trimmed)) {
    return {
      shouldClarify: true,
      question: "Send the exact question or concept, and I will guide you step by step.",
    };
  }
  if (/\b(this|it|that)\b/i.test(trimmed) && trimmed.length < 24) {
    return {
      shouldClarify: true,
      question: "Which molecule, equation, or step are you pointing to?",
    };
  }
  return { shouldClarify: false };
}
