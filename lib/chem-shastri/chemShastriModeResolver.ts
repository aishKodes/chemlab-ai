import type { ChemShastriMode } from "./chemShastriTypes";
import type { MasterAlchemMode } from "@/lib/master-alchem/types";

const MODES = new Set<ChemShastriMode>([
  "explain",
  "hint",
  "step_by_step",
  "quiz_me",
  "check_my_answer",
  "exam_mode",
  "lab_guide",
  "lab_guide_mode",
  "teacher_mode",
]);

export function resolveChemShastriMode(mode?: string | null): ChemShastriMode {
  if (mode && MODES.has(mode as ChemShastriMode)) return mode as ChemShastriMode;
  return "explain";
}

export function toMasterAlchemMode(mode: ChemShastriMode): MasterAlchemMode {
  if (mode === "teacher_mode") return "explain";
  if (mode === "lab_guide_mode") return "lab_guide";
  return mode;
}

export function labelForChemShastriMode(mode: ChemShastriMode) {
  return {
    explain: "Explain",
    hint: "Hint",
    step_by_step: "Step by step",
    quiz_me: "Quiz me",
    check_my_answer: "Check my answer",
    exam_mode: "Exam mode",
    lab_guide: "Lab guide",
    lab_guide_mode: "Lab guide",
    teacher_mode: "Teacher mode",
  }[mode];
}
