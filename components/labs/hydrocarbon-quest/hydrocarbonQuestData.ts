import type { DialogueLine, HydrocarbonLevel } from "@/components/labs/hydrocarbon-quest/hydrocarbonQuestTypes";

const openingDialogue: DialogueLine[] = [
  {
    speaker: "Kabir",
    pose: "confused",
    text: "Aparna ma'am, this chemistry chapter is so confusing. IUPAC nomenclature feels like a completely foreign language.",
  },
  {
    speaker: "Aparna",
    pose: "speaking",
    text: "Think about it, Kabir. If someone asks for Sharma ji, they may not find the right person. IUPAC gives each chemical its exact full name.",
  },
  {
    speaker: "Aparna",
    pose: "pointing",
    text: "In our game, First Name means side branch, Middle Name means main carbon chain, and Surname means bond type.",
  },
];

export const hydrocarbonQuestOpening = {
  title: "Hydrocarbon Naming Quest",
  subtitle: "The IUPAC Family Naming Game",
  dialogue: openingDialogue,
};

export const hydrocarbonQuestLevels: HydrocarbonLevel[] = [
  {
    id: "butane",
    title: "Level 1: The Basic Family Lineage",
    subtitle: "Trace four carbons and name the straight-chain alkane.",
    targetName: "Butane",
    formula: "CH₃-CH₂-CH₂-CH₃",
    xp: 100,
    learningGoal: "Four carbon atoms use the root word But, and single bonds use the suffix -ane.",
    molecule: {
      id: "butane",
      atoms: [
        { id: "c1", element: "C", label: "CH₃", x: 140, y: 250 },
        { id: "c2", element: "C", label: "CH₂", x: 300, y: 250 },
        { id: "c3", element: "C", label: "CH₂", x: 460, y: 250 },
        { id: "c4", element: "C", label: "CH₃", x: 620, y: 250 },
      ],
      bonds: [
        { from: "c1", to: "c2", type: "single" },
        { from: "c2", to: "c3", type: "single" },
        { from: "c3", to: "c4", type: "single" },
      ],
    },
    correctChainSequence: ["c1", "c2", "c3", "c4"],
    chainCompleteMessage: "Four carbons are locked in. The middle name is But.",
    availableBlocks: [
      { id: "prop", label: "Prop", kind: "distractor" },
      { id: "but", label: "But", kind: "root" },
      { id: "pent", label: "Pent", kind: "distractor" },
      { id: "ane", label: "-ane", kind: "suffix" },
      { id: "ene", label: "-ene", kind: "distractor" },
    ],
    slots: [
      { id: "root", label: "Middle Name / Root Word", helper: "How many carbons are in the main chain?" },
      { id: "suffix", label: "Surname / Suffix", helper: "What bond family does it belong to?" },
    ],
    correctSlotSolution: { root: "but", suffix: "ane" },
    dialogue: [
      {
        speaker: "Aparna",
        pose: "pointing",
        text: "Click the carbon atoms in order. We are finding the main family line first.",
      },
    ],
    successMessage:
      "Perfect. You combined the middle name and surname to make Butane, the gas family connected with our cooking flame.",
    successKind: "flame",
  },
  {
    id: "methylpentane",
    title: "Level 2: Ranking the Cousin",
    subtitle: "Find the longest chain, rank the branch, and build 2-Methylpentane.",
    targetName: "2-Methylpentane",
    formula: "CH₃-CH(CH₃)-CH₂-CH₂-CH₃",
    xp: 150,
    learningGoal: "A five-carbon main chain uses Pent, and the methyl branch gets the lowest possible number.",
    molecule: {
      id: "methylpentane",
      atoms: [
        { id: "c1", element: "C", label: "CH₃", x: 110, y: 260 },
        { id: "c2", element: "C", label: "CH", x: 250, y: 260 },
        { id: "c3", element: "C", label: "CH₂", x: 390, y: 260 },
        { id: "c4", element: "C", label: "CH₂", x: 530, y: 260 },
        { id: "c5", element: "C", label: "CH₃", x: 670, y: 260 },
        { id: "b1", element: "C", label: "CH₃", x: 250, y: 120 },
      ],
      bonds: [
        { from: "c1", to: "c2", type: "single" },
        { from: "c2", to: "c3", type: "single" },
        { from: "c3", to: "c4", type: "single" },
        { from: "c4", to: "c5", type: "single" },
        { from: "c2", to: "b1", type: "single" },
      ],
    },
    correctChainSequence: ["c1", "c2", "c3", "c4", "c5"],
    chainCompleteMessage: "Five carbons are the main family line. The middle name is Pent.",
    wrongPathHint: "Arre, do not let the side cousin distract you. Find the longest main family line.",
    numberingOptions: [
      { id: "left", label: "Count Left-to-Right", branchPosition: 2, correct: true },
      { id: "right", label: "Count Right-to-Left", branchPosition: 4, correct: false },
    ],
    availableBlocks: [
      { id: "two", label: "2-", kind: "rank" },
      { id: "four", label: "4-", kind: "distractor" },
      { id: "methyl", label: "Methyl", kind: "prefix" },
      { id: "but", label: "But", kind: "distractor" },
      { id: "pent", label: "Pent", kind: "root" },
      { id: "ane", label: "-ane", kind: "suffix" },
      { id: "yne", label: "-yne", kind: "distractor" },
    ],
    slots: [
      { id: "rank", label: "Rank / Position", helper: "Where is the methyl branch?" },
      { id: "prefix", label: "First Name / Prefix", helper: "What is the side branch called?" },
      { id: "root", label: "Middle Name / Root Word", helper: "How long is the main chain?" },
      { id: "suffix", label: "Surname / Suffix", helper: "Single bonds belong to which family?" },
    ],
    correctSlotSolution: { rank: "two", prefix: "methyl", root: "pent", suffix: "ane" },
    dialogue: [
      {
        speaker: "Aparna",
        pose: "warning",
        text: "This molecule has a cousin branch. Trace the longest main family line before naming the side branch.",
      },
    ],
    successMessage: "Rank 2. Perfect. The full family name is 2-Methylpentane.",
    successKind: "chain",
  },
  {
    id: "butene",
    title: "Level 3: Serving the VIP Guest",
    subtitle: "Give the double bond the lowest seat number and build But-1-ene.",
    targetName: "But-1-ene",
    formula: "CH₂=CH-CH₂-CH₃",
    xp: 200,
    learningGoal: "A double bond uses -ene and must receive the lowest possible number.",
    molecule: {
      id: "butene",
      atoms: [
        { id: "c1", element: "C", label: "CH₂", x: 140, y: 250 },
        { id: "c2", element: "C", label: "CH", x: 300, y: 250 },
        { id: "c3", element: "C", label: "CH₂", x: 460, y: 250 },
        { id: "c4", element: "C", label: "CH₃", x: 620, y: 250 },
      ],
      bonds: [
        { from: "c1", to: "c2", type: "double" },
        { from: "c2", to: "c3", type: "single" },
        { from: "c3", to: "c4", type: "single" },
      ],
    },
    correctChainSequence: ["c1", "c2", "c3", "c4"],
    chainCompleteMessage: "Four carbons give But. Now serve the double bond first.",
    numberingOptions: [
      { id: "left", label: "Count from double-bond side", doubleBondPosition: 1, correct: true },
      { id: "right", label: "Count from far end", doubleBondPosition: 3, correct: false },
    ],
    availableBlocks: [
      { id: "but", label: "But", kind: "root" },
      { id: "one", label: "1", kind: "rank" },
      { id: "three", label: "3", kind: "distractor" },
      { id: "ane", label: "-ane", kind: "distractor" },
      { id: "ene", label: "-ene", kind: "suffix" },
      { id: "yne", label: "-yne", kind: "distractor" },
    ],
    slots: [
      { id: "root", label: "Middle Name / Root Word", helper: "How many carbons are in the chain?" },
      { id: "rank", label: "VIP Seat Number", helper: "Where does the double bond begin?" },
      { id: "suffix", label: "Surname / Suffix", helper: "Double bonds belong to which family?" },
    ],
    correctSlotSolution: { root: "but", rank: "one", suffix: "ene" },
    dialogue: [
      {
        speaker: "Aparna",
        pose: "pointing",
        text: "The double bond is our VIP guest. It must get the lowest seat number.",
      },
    ],
    successMessage: "Excellent. The VIP double bond gets seat 1, so the name is But-1-ene.",
    successKind: "badge",
  },
];
