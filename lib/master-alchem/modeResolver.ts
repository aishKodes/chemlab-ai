import type { MasterAlchemMode } from "./types";

export function resolveMode(mode?: string): MasterAlchemMode {
  if (
    mode === "explain" ||
    mode === "hint" ||
    mode === "step_by_step" ||
    mode === "quiz_me" ||
    mode === "check_my_answer" ||
    mode === "lab_guide" ||
    mode === "lab_guide_mode" ||
    mode === "exam_mode"
  ) {
    return mode;
  }
  return "explain";
}
