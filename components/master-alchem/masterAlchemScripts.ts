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
    route: "/learn",
    label: "Chemistry Worlds",
    mood: "guide",
    message: "Choose a chemistry world. Each world has quests, labs, and battles.",
    nextLabel: "Choose a world",
    nextHref: "/learn/chemistry",
    explainPrompt: "Explain how I should choose my first chemistry world.",
  },
  {
    route: "/simulations",
    label: "Virtual Labs",
    mood: "labGuide",
    message: "Pick a lab to explore. Don't just read chemistry. Make it react.",
    nextLabel: "Try a featured lab",
    nextHref: "/labs/neutralization-studio",
    explainPrompt: "Explain how to learn from a chemistry simulation.",
  },
  {
    route: "/labs",
    label: "Lab Guide",
    mood: "labGuide",
    message: "Let's do chemistry safely in a virtual lab. I will guide each step.",
    nextLabel: "Start Neutralization Studio",
    nextHref: "/labs/neutralization-studio",
    explainPrompt: "Explain neutralization before I start the lab.",
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
    message: "Treat every question like a clue. Every mistake can be repaired.",
    nextLabel: "Fight a boss quiz",
    nextHref: "/quiz/atomic-structure",
    explainPrompt: "Give me a quiz strategy for chemistry.",
  },
  {
    route: "/dashboard",
    label: "Progress Galaxy",
    mood: "idle",
    message: "This is your progress galaxy. Today's mission is waiting.",
    nextLabel: "Review mistakes",
    nextHref: "/dashboard/mistakes",
    explainPrompt: "Explain what I should practice next from my dashboard.",
  },
];

export const homeMasterAlchemScript: MasterAlchemRouteScript = {
  route: "/",
  label: "Welcome",
  mood: "hero",
  message: "Welcome to Chemlab. Start with a world, a lab, or ask me a chemistry question.",
  nextLabel: "Start your first quest",
  nextHref: "/learn/chemistry",
  explainPrompt: "Explain how Chemlab helps me learn chemistry.",
};

export function getMasterAlchemScript(pathname: string): MasterAlchemRouteScript {
  if (pathname === "/") return homeMasterAlchemScript;
  return scripts.find((script) => pathname.startsWith(script.route)) ?? homeMasterAlchemScript;
}

