import type { DaniellAction, DaniellChallengeQuestion, DaniellPhase, DaniellPhaseStory } from "@/components/labs/daniell-cell/daniellCellTypes";
import {
  getCellNotation,
  getAnode,
  getCathode,
  getElectronFlowDirection,
  getOverallReaction,
  getOxidationHalfReaction,
  getReductionHalfReaction,
} from "@/components/labs/daniell-cell/daniellCellLogic";

export const daniellPhaseStories: Record<DaniellPhase, DaniellPhaseStory> = {
  cinematic_intro: {
    phase: "cinematic_intro",
    eyebrow: "Electrochemistry mission",
    title: "Daniell Cell Studio",
    prompt: "How can a reaction make electricity?",
    masterAlchemMessage:
      "Welcome, young chemist. Today we will build a cell that turns a chemical reaction into electricity.",
    mood: "guide",
  },
  setup_cell: {
    phase: "setup_cell",
    eyebrow: "Build the half-cells",
    title: "Place the metal electrodes",
    prompt: "A galvanic cell starts by separating two half-reactions.",
    masterAlchemMessage: "Zinc is ready to give away electrons. Copper ions are waiting to receive them.",
    mood: "thinking",
  },
  connect_circuit: {
    phase: "connect_circuit",
    eyebrow: "External path",
    title: "Connect the wire",
    prompt: "Electrons need a path outside the solutions.",
    masterAlchemMessage: "The wire gives electrons a path to travel from zinc toward copper.",
    mood: "thinking",
  },
  add_salt_bridge: {
    phase: "add_salt_bridge",
    eyebrow: "Charge balance",
    title: "Add the salt bridge",
    prompt: "The solutions must stay electrically balanced.",
    masterAlchemMessage: "The salt bridge keeps charge balanced so the cell can keep working.",
    mood: "labGuide",
  },
  start_reaction: {
    phase: "start_reaction",
    eyebrow: "Start the cell",
    title: "Let the reaction produce voltage",
    prompt: "The circuit is ready. Watch the reaction become electrical energy.",
    masterAlchemMessage: "Now watch carefully. Zinc gives away electrons. Copper ions receive them.",
    mood: "explaining",
  },
  observe_flow: {
    phase: "observe_flow",
    eyebrow: "Observation",
    title: "Watch electron flow",
    prompt: "Particles are enlarged so you can see the process.",
    masterAlchemMessage:
      "Zinc loses electrons at the anode. Copper ions gain electrons at the cathode. The voltmeter rises as electrons move.",
    mood: "explaining",
  },
  challenge: {
    phase: "challenge",
    eyebrow: "Boss check",
    title: "Prove what you observed",
    prompt: "Answer each clue to lock in the concept.",
    masterAlchemMessage: "Every question is a clue. Follow the electron trail and you will solve the cell.",
    mood: "thinking",
  },
  explanation: {
    phase: "explanation",
    eyebrow: "Big picture",
    title: "Connect the animation to the equation",
    prompt: "The moving particles match the half-reactions.",
    masterAlchemMessage:
      "Zinc was oxidized at the anode. Copper ions were reduced at the cathode. The electron flow through the wire produced a voltage.",
    mood: "explaining",
  },
  reward: {
    phase: "reward",
    eyebrow: "Mastery unlocked",
    title: "Electrochem Explorer",
    prompt: "You built the cell, traced the flow, and explained the chemistry.",
    masterAlchemMessage: "Brilliant work. You followed the electrons and turned a reaction into a clear idea.",
    mood: "celebrating",
  },
};

export const introExchange = [
  "How can a reaction make electricity?",
  "By separating oxidation and reduction. Zinc will give away electrons, copper ions will receive them, and the wire will carry the charge.",
];

export const daniellChallengeQuestions: DaniellChallengeQuestion[] = [
  {
    id: "anode",
    question: "Which electrode is the anode?",
    correctOptionId: "zinc",
    hint: "The anode is where oxidation happens. Look for the metal that loses electrons.",
    options: [
      {
        id: "zinc",
        label: "Zinc",
        feedback: "Correct. Zinc loses electrons, so oxidation happens there.",
      },
      {
        id: "copper",
        label: "Copper",
        feedback: "Try again. Copper ions gain electrons, so copper is the cathode side.",
      },
    ],
  },
  {
    id: "cathode",
    question: "Which electrode is the cathode?",
    correctOptionId: "copper",
    hint: "The cathode is where reduction happens. Look for the ions that gain electrons.",
    options: [
      {
        id: "zinc",
        label: "Zinc",
        feedback: "Not this one. Zinc gives away electrons, so it is the anode.",
      },
      {
        id: "copper",
        label: "Copper",
        feedback: "Yes. Copper ions gain electrons at the cathode.",
      },
    ],
  },
  {
    id: "electron-flow",
    question: "Which way do electrons flow?",
    correctOptionId: "zinc-to-copper",
    hint: "Electrons leave the metal that is oxidized and travel through the wire.",
    options: [
      {
        id: "zinc-to-copper",
        label: "Zinc to Copper",
        feedback: "Exactly. Electrons travel through the external wire from anode to cathode.",
      },
      {
        id: "copper-to-zinc",
        label: "Copper to Zinc",
        feedback: "Follow the oxidation clue. Zinc loses electrons first.",
      },
      {
        id: "salt-bridge",
        label: "Through the salt bridge",
        feedback: "Careful. Ions move through the salt bridge, not electrons.",
      },
    ],
  },
  {
    id: "overall-reaction",
    question: "What is the overall reaction?",
    correctOptionId: "zn-cu",
    hint: "Zinc becomes zinc ions, and copper ions become copper metal.",
    options: [
      {
        id: "zn-cu",
        label: "Zn + Cu²⁺ → Zn²⁺ + Cu",
        feedback: "Correct. Zinc is oxidized and copper ions are reduced.",
      },
      {
        id: "cu-zn",
        label: "Cu + Zn²⁺ → Cu²⁺ + Zn",
        feedback: "That reverses the direction. Watch which metal dissolves in this cell.",
      },
      {
        id: "ions-metals",
        label: "Zn²⁺ + Cu²⁺ → Zn + Cu",
        feedback: "Both ions are not turning into metals here. Zinc metal is the electron source.",
      },
    ],
  },
];

export const finalExplanationFacts = [
  ["Anode", getAnode()],
  ["Cathode", getCathode()],
  ["Electron flow", getElectronFlowDirection()],
  ["Cell voltage", "about 1.10 V"],
  ["Overall reaction", getOverallReaction()],
  ["Cell notation", getCellNotation()],
  ["Oxidation", getOxidationHalfReaction()],
  ["Reduction", getReductionHalfReaction()],
];

export function getPrimaryAction(phase: DaniellPhase, zincPlaced: boolean, copperPlaced: boolean, canChallenge: boolean): DaniellAction | null {
  if (phase === "cinematic_intro") {
    return {
      id: "build-cell",
      label: "Build the Cell",
      helper: "Enter the lab bench and assemble the galvanic cell.",
    };
  }

  if (phase === "setup_cell" && !zincPlaced) {
    return {
      id: "place-zinc",
      label: "Place zinc electrode",
      helper: "Zinc will be our anode. It is ready to lose electrons.",
    };
  }

  if (phase === "setup_cell" && !copperPlaced) {
    return {
      id: "place-copper",
      label: "Place copper electrode",
      helper: "Copper will be our cathode. Copper ions will gain electrons here.",
    };
  }

  if (phase === "connect_circuit") {
    return {
      id: "connect-wire",
      label: "Connect wire",
      helper: "The wire gives electrons a path to travel.",
    };
  }

  if (phase === "add_salt_bridge") {
    return {
      id: "add-salt-bridge",
      label: "Add salt bridge",
      helper: "The salt bridge keeps the charges balanced.",
    };
  }

  if (phase === "start_reaction") {
    return {
      id: "start-cell",
      label: "Start cell",
      helper: "Wake up the voltmeter and watch the particles move.",
    };
  }

  if (phase === "observe_flow") {
    return {
      id: "take-challenge",
      label: canChallenge ? "Take challenge" : "Observe a little longer",
      helper: canChallenge
        ? "You have seen enough evidence. Time for the boss check."
        : "Watch the voltage climb and trace the electron path.",
      disabled: !canChallenge,
    };
  }

  if (phase === "explanation") {
    return {
      id: "claim-badge",
      label: "Claim badge",
      helper: "Lock in the summary and collect your reward.",
    };
  }

  if (phase === "reward") {
    return {
      id: "restart",
      label: "Run the cell again",
      helper: "Reset the lab and rebuild the cell from the start.",
    };
  }

  return null;
}
