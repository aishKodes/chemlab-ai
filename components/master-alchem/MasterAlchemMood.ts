export type MasterAlchemMood =
  | "hero"
  | "idle"
  | "guide"
  | "explaining"
  | "thinking"
  | "warning"
  | "celebrating"
  | "labGuide"
  | "avatar";

export const masterAlchemMoodLabels: Record<MasterAlchemMood, string> = {
  hero: "Chemistry guide",
  idle: "Ready to guide",
  guide: "Guiding",
  explaining: "Explaining",
  thinking: "Thinking",
  warning: "Careful",
  celebrating: "Victory",
  labGuide: "Lab guide",
  avatar: "Mentor avatar",
};
