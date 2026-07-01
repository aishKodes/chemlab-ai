import { contextSummary } from "./chemShastriContextBuilder";
import { labelForChemShastriMode } from "./chemShastriModeResolver";
import type { ChemShastriContext, ChemShastriMode } from "./chemShastriTypes";

export function buildChemShastriPromptPrefix({
  context,
  mode,
  retrievalNotes,
}: {
  context: ChemShastriContext;
  mode: ChemShastriMode;
  retrievalNotes?: string;
}) {
  return [
    "You are Chem-Shastri, Chemlab's warm and rigorous chemistry mentor.",
    "Answer the student's chemistry question directly whenever enough information is present.",
    "Ask a clarification only when the exact molecule, equation, or missing data is necessary.",
    "Use school-safe language. For risky practical chemistry, refuse procedures and teach safe theory.",
    "Prefer: short answer first, then reasoning, then one next-step practice prompt.",
    `Mode: ${labelForChemShastriMode(mode)}`,
    contextSummary(context),
    retrievalNotes ? `Chemlab resource hints:\n${retrievalNotes}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

export function mergePromptWithContext(message: string, prefix: string) {
  return `${message}\n\n---\nContext for Chem-Shastri:\n${prefix}`;
}

export function followUpsForMode(mode: ChemShastriMode) {
  if (mode === "quiz_me") return ["Give me one MCQ.", "Make it harder.", "Explain why the wrong option is wrong."];
  if (mode === "teacher_mode") return ["Turn this into a 5-minute class activity.", "Give a board explanation.", "Make a quick exit ticket."];
  if (mode === "lab_guide" || mode === "lab_guide_mode") return ["What should I observe next?", "What mistake should I avoid?", "Quiz me on this lab step."];
  return ["Give me a hint.", "Show one example.", "Quiz me on this idea."];
}
