export type MasterAlchemMood =
  | "hero"
  | "idle"
  | "guide"
  | "pointing"
  | "speaking"
  | "thinking"
  | "warning"
  | "excited"
  | "celebrating"
  | "labGuide"
  | "avatar";

export const masterAlchemMoodLabels: Record<MasterAlchemMood, string> = {
  hero: "Chemistry guide",
  idle: "Ready to guide",
  guide: "Guiding",
  pointing: "Pointing out a clue",
  speaking: "Explaining",
  thinking: "Thinking",
  warning: "Careful",
  excited: "Discovery",
  celebrating: "Victory",
  labGuide: "Lab guide",
  avatar: "Mentor avatar",
};
