import type { MasterAlchemIntent, MasterAlchemMode } from "./types";

export function detectIntent(message: string, mode: MasterAlchemMode): MasterAlchemIntent {
  const text = message.toLowerCase();
  if (mode === "lab_guide" || mode === "lab_guide_mode") return "lab_guide";
  if (mode === "check_my_answer") return "check_my_answer";
  if (mode === "quiz_me") return "quiz_feedback";
  if (/\b(calculate|numerical|moles?|molarity|enthalpy|balance|derive|steps?|why)\b/i.test(text) && text.length > 180) {
    return "hard_reasoning";
  }
  if (/^\s*(what is|define|meaning of|difference between|why does|how does)\b/i.test(message)) {
    return "faq_answer";
  }
  return "simple_explain";
}
