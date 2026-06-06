import type { MasterAlchemMood } from "@/components/master-alchem/MasterAlchemMood";

export type MasterAlchemRouteScript = {
  route: string;
  label: string;
  mood: MasterAlchemMood;
  message: string;
  nextLabel: string;
  nextHref: string;
  explainPrompt: string;
};

const scripts: MasterAlchemRouteScript[] = [
  {
    route: "/learn/chemistry",
    label: "Chemistry Worlds",
    mood: "guide",
    message: "Start with a world that feels exciting. I'll guide your first mission.",
    nextLabel: "Choose a world",
    nextHref: "/learn/chemistry",
    explainPrompt: "Help me choose a chemistry world to start with.",
  },
  {
    route: "/learn",
    label: "Chemistry Worlds",
    mood: "guide",
    message: "Pick a chemistry world. Each world has quests, labs, and challenges.",
    nextLabel: "Choose a world",
    nextHref: "/learn/chemistry",
    explainPrompt: "Explain how I should choose my first chemistry world.",
  },
  {
    route: "/simulations",
    label: "Virtual Labs",
    mood: "labGuide",
    message: "Choose a simulation. I'll help you see what the concept is really doing.",
    nextLabel: "Try a featured lab",
    nextHref: "/labs/hydrocarbon-naming-quest",
    explainPrompt: "Explain how to learn from a chemistry simulation.",
  },
  {
    route: "/labs/hydrocarbon-naming-quest",
    label: "Hydrocarbon Naming Quest",
    mood: "guide",
    message: "Trace the carbon family, then build the IUPAC name one clue at a time.",
    nextLabel: "Open the quest",
    nextHref: "/labs/hydrocarbon-naming-quest",
    explainPrompt: "Help me understand the IUPAC family-name rule.",
  },
  {
    route: "/labs/daniell-cell-studio",
    label: "Daniell Cell Studio",
    mood: "explaining",
    message: "Let's build a cell. Watch where the electrons go.",
    nextLabel: "Open the lab",
    nextHref: "/labs/daniell-cell-studio",
    explainPrompt: "Guide me through the Daniell cell step by step.",
  },
  {
    route: "/labs",
    label: "Lab Guide",
    mood: "labGuide",
    message: "Virtual labs are safe places to experiment. Let's learn by doing.",
    nextLabel: "Open Hydrocarbon Naming Quest",
    nextHref: "/labs/hydrocarbon-naming-quest",
    explainPrompt: "Explain how Chemlab labs help me learn by doing.",
  },
  {
    route: "/ai-tutor",
    label: "Ask Anything",
    mood: "thinking",
    message: "Ask me anything. I can explain, hint, quiz you, or guide a lab.",
    nextLabel: "Try lab guide mode",
    nextHref: "/ai-tutor",
    explainPrompt: "Help me ask a strong chemistry question.",
  },
  {
    route: "/quiz",
    label: "Battle Arena",
    mood: "celebrating",
    message: "Every question is a clue. Let's defeat the concept, not fear it.",
    nextLabel: "Fight a boss quiz",
    nextHref: "/quiz/atomic-structure",
    explainPrompt: "Give me a quiz strategy for chemistry.",
  },
  {
    route: "/mistake-lab",
    label: "Mistake Lab",
    mood: "warning",
    message: "Mistakes are clues. Let's turn them into mastery.",
    nextLabel: "Ask for a rescue hint",
    nextHref: "/ai-tutor",
    explainPrompt: "Help me turn one mistake into a study plan.",
  },
  {
    route: "/dashboard/mistakes",
    label: "Mistake Lab",
    mood: "warning",
    message: "Mistakes are clues. Let's turn them into mastery.",
    nextLabel: "Ask for a rescue hint",
    nextHref: "/ai-tutor",
    explainPrompt: "Help me turn one mistake into a study plan.",
  },
  {
    route: "/dashboard",
    label: "Progress Galaxy",
    mood: "idle",
    message: "This is your progress space. Your next mission is waiting.",
    nextLabel: "Review mistakes",
    nextHref: "/dashboard/mistakes",
    explainPrompt: "Explain what I should practice next from my dashboard.",
  },
];

export const homeMasterAlchemScript: MasterAlchemRouteScript = {
  route: "/",
  label: "Welcome",
  mood: "hero",
  message: "Welcome to Chemlab. Choose a world, enter a lab, or ask me a chemistry question.",
  nextLabel: "Start your first quest",
  nextHref: "/learn/chemistry",
  explainPrompt: "Explain how Chemlab helps me learn chemistry.",
};

export function getMasterAlchemScript(pathname: string): MasterAlchemRouteScript {
  if (pathname === "/") return homeMasterAlchemScript;
  return scripts.find((script) => pathname.startsWith(script.route)) ?? homeMasterAlchemScript;
}
