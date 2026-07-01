import type { MasterAlchemMood } from "@/components/master-alchem/MasterAlchemMood";

export type MasterAlchemLine = {
  mood: MasterAlchemMood;
  eyebrow: string;
  line: string;
  action?: string;
};

export const masterAlchemLines = {
  hero: {
    mood: "guide",
    eyebrow: "Chem-Shastri",
    line: "Welcome, future chemist. Pick a world, touch a model, and I will guide every reaction step by step.",
    action: "Meet Chem-Shastri",
  },
  quest: {
    mood: "celebrating",
    eyebrow: "Quest guidance",
    line: "Every world hides a concept. Explore, predict, test, then claim the XP when the idea clicks.",
    action: "Enter a quest",
  },
  simulation: {
    mood: "thinking",
    eyebrow: "Lab hint",
    line: "Change one variable at a time. Chemistry becomes clearer when you can see what stays conserved.",
    action: "Ask for a hint",
  },
  success: {
    mood: "celebrating",
    eyebrow: "Breakthrough",
    line: "That is real progress. Your mistake became evidence, and evidence became mastery.",
    action: "Claim XP",
  },
  warning: {
    mood: "warning",
    eyebrow: "Safety note",
    line: "Some chemistry belongs in supervised labs only. I can explain the theory without giving unsafe instructions.",
    action: "Learn safely",
  },
} satisfies Record<string, MasterAlchemLine>;
