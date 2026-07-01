import type { Metadata } from "next";
import { CinematicLessonShell } from "@/components/simulation-engine/CinematicLessonShell";
import type { CinematicLessonConfig } from "@/components/simulation-engine/simulationTypes";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Lab Flow Preview",
  description:
    "A Chemlab preview showing the story, experiment, challenge, and reward rhythm for future labs.",
};

const demoConfig: CinematicLessonConfig = {
  title: "Lab Flow Preview",
  subtitle: "A polished structure preview for future Chemlab labs.",
  badge: "Lab Preview",
  rewardTitle: "Lab Flow Builder",
  rewardDetail:
    "You completed the flow: story first, experiment second, challenge third, reward last.",
  xpReward: 80,
  steps: [
    {
      id: "story",
      label: "Hear the mission",
      description: "Chem-Shastri explains what the student is about to test.",
    },
    {
      id: "experiment",
      label: "Enter the lab scene",
      description: "The stage appears and the reaction vessel responds.",
    },
    {
      id: "challenge",
      label: "Answer the check",
      description: "The student proves the idea with a short question.",
    },
    {
      id: "reward",
      label: "Claim the reward",
      description: "XP, stars, and a badge close the learning loop.",
    },
  ],
  scenes: [
    {
      id: "intro",
      phase: "story",
      eyebrow: "Story scene",
      title: "First, understand the mission.",
      description:
        "Future labs will begin with a short story moment so students know what they are trying to discover before touching the experiment.",
      masterAlchemMood: "guide",
      masterAlchemMessage:
        "Welcome, young chemist. In Chemlab, every practical starts with a question you can actually test.",
    },
    {
      id: "experiment",
      phase: "experiment",
      eyebrow: "Experiment scene",
      title: "Then, enter the lab.",
      description:
        "The stage is where future beakers, electrodes, molecules, instruments, and particles will animate as students act.",
      masterAlchemMood: "labGuide",
      masterAlchemMessage:
        "Change one thing at a time. Watch the vessel glow, then connect the visual change to the chemistry idea.",
      stageLabel: "Lab stage structure",
    },
    {
      id: "challenge",
      phase: "challenge",
      eyebrow: "Challenge scene",
      title: "Now prove what changed.",
      description:
        "A quick check turns the observation into a clear idea. Wrong answers stay safe and useful.",
      masterAlchemMood: "thinking",
      masterAlchemMessage:
        "Look at the stage first. Which action best matches learning by doing?",
      stageLabel: "Evidence check",
    },
    {
      id: "reward",
      phase: "reward",
      eyebrow: "Reward scene",
      title: "Finish with mastery.",
      description:
        "The final scene celebrates the completed loop and points the student toward the next mission.",
      masterAlchemMood: "celebrating",
      masterAlchemMessage:
        "That is the Chemlab rhythm: story, action, evidence, challenge, reward.",
      stageLabel: "Reward unlocked",
    },
  ],
  challenge: {
    question: "What should a Chemlab lab help you do first?",
    correctOptionId: "test",
    hint: "The best lab action lets you make a prediction and then check it.",
    options: [
      {
        id: "test",
        label: "Test an idea by changing something in the scene",
        feedback: "Correct. A good lab lets you act, observe, and explain.",
      },
      {
        id: "memorize",
        label: "Memorize a paragraph before anything moves",
        feedback: "Reading can help, but Chemlab labs should begin with active discovery.",
      },
      {
        id: "guess",
        label: "Guess quickly and move on",
        feedback: "Guessing is only useful when you compare it with evidence.",
      },
    ],
  },
};

export default function DemoCinematicShellPage() {
  return (
    <>
      <PageHeader
        eyebrow="Lab Preview"
        title="Chemlab Lab Flow"
        description="A short preview of how Chemlab labs move from mission to experiment to challenge to reward."
      />
      <Container className="pb-16">
        <CinematicLessonShell config={demoConfig} />
      </Container>
    </>
  );
}
