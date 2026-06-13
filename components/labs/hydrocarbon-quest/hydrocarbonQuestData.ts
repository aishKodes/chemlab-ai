import type { DialogueLine, HydrocarbonLevel, HydrocarbonModuleId, NamingBlock, NamingSlot } from "@/components/labs/hydrocarbon-quest/hydrocarbonQuestTypes";
import { alkeneMolecule, alkyneMolecule, methylBranchedMolecule, straightChainMolecule } from "@/components/labs/hydrocarbon-quest/moleculeLayouts";

const openingDialogue: DialogueLine[] = [
  {
    speaker: "Kabir",
    pose: "confused",
    text: "Aparna ma'am, IUPAC nomenclature feels like a foreign language. Why can't we just call everything gas?",
  },
  {
    speaker: "Aparna",
    pose: "explaining",
    text: "If someone asks for Sharma ji in a big neighbourhood, which Sharma ji? We need the exact full name.",
  },
  {
    speaker: "Aparna",
    pose: "explaining",
    text: "IUPAC does the same for molecules. It gives every chemical a precise full name.",
  },
  {
    speaker: "Aparna",
    pose: "pointing",
    text: "First Name is the side branch. Middle Name is the main carbon chain. Surname is the bond type.",
  },
  {
    speaker: "Aparna",
    pose: "celebrating",
    text: "Now let's turn naming into a quest.",
  },
];

export const hydrocarbonQuestOpening = {
  title: "Hydrocarbon Naming Quest",
  subtitle: "The IUPAC Family Naming Game",
  dialogue: openingDialogue,
};

export const hydrocarbonQuestModules: Array<{
  id: HydrocarbonModuleId;
  title: string;
  subtitle: string;
  assetRole: string;
  xp: number;
}> = [
  {
    id: "family_lineage",
    title: "Module 1 — Family Lineage",
    subtitle: "Straight-chain alkanes",
    assetRole: "level_1_visual_reference",
    xp: 600,
  },
  {
    id: "cousin_branches",
    title: "Module 2 — Cousin Branches",
    subtitle: "Branched alkanes",
    assetRole: "level_2_visual_reference",
    xp: 750,
  },
  {
    id: "vip_double_bonds",
    title: "Module 3 — VIP Double Bonds",
    subtitle: "Alkenes and lowest double-bond locants",
    assetRole: "level_3_visual_reference",
    xp: 500,
  },
  {
    id: "triple_bond_trails",
    title: "Module 4 — Triple Bond Trails",
    subtitle: "Alkynes and violet bond priority",
    assetRole: "game_board_background_futuristic",
    xp: 500,
  },
  {
    id: "numbering_arena",
    title: "Module 5 — Numbering Arena",
    subtitle: "Lowest locant and priority rules",
    assetRole: "game_board_background_futuristic",
    xp: 650,
  },
  {
    id: "senior_secondary_boss",
    title: "Module 6 — Senior Secondary Boss",
    subtitle: "Mixed challenge levels",
    assetRole: "game_board_background_futuristic",
    xp: 1000,
  },
];

const rootBlocks: NamingBlock[] = [
  "Meth",
  "Eth",
  "Prop",
  "But",
  "Pent",
  "Hex",
  "Hept",
  "Oct",
  "Non",
  "Dec",
].map((label) => ({ id: label.toLowerCase(), label, kind: "root" as const }));

const suffixBlocks: NamingBlock[] = [
  { id: "ane", label: "ane", kind: "suffix" },
  { id: "ene", label: "ene", kind: "suffix" },
  { id: "yne", label: "yne", kind: "suffix" },
];

const rootSlot: NamingSlot = {
  id: "root",
  label: "Middle Name / Root Word",
  helper: "Count the parent chain carbons.",
};

const suffixSlot: NamingSlot = {
  id: "suffix",
  label: "Surname / Suffix",
  helper: "Choose ane, ene, or yne from the bond family.",
};

export const hydrocarbonQuestLevels: HydrocarbonLevel[] = [
  alkaneLevel(1, "Methane", "CH₄", "Meth", 1, "Meet the smallest alkane family member."),
  alkaneLevel(2, "Ethane", "C₂H₆", "Eth", 2, "Trace two carbons and lock the root Eth."),
  alkaneLevel(3, "Propane", "C₃H₈", "Prop", 3, "Three carbons create the root Prop."),
  alkaneLevel(4, "Butane", "C₄H₁₀", "But", 4, "Trace four carbons and name the cooking-gas family.", "flame"),
  alkaneLevel(5, "Pentane", "C₅H₁₂", "Pent", 5, "Five carbons build the root Pent."),
  alkaneLevel(6, "Hexane", "C₆H₁₄", "Hex", 6, "Six carbons build the root Hex."),
  methylLevel(7, "2-Methylpropane", "C₄H₁₀", "Prop", 3, [2], "2-", "Find a three-carbon parent chain and one methyl cousin."),
  methylLevel(8, "2-Methylbutane", "C₅H₁₂", "But", 4, [2], "2-", "Give the methyl cousin the lower number."),
  methylLevel(9, "2-Methylpentane", "C₆H₁₄", "Pent", 5, [2], "2-", "Find the five-carbon parent chain and rank the methyl branch."),
  methylLevel(10, "3-Methylpentane", "C₆H₁₄", "Pent", 5, [3], "3-", "The branch sits in the middle, so the locant is 3."),
  dimethylLevel(11, "2,2-Dimethylpropane", "C₅H₁₂", "Prop", 3, [2, 2], "2,2-", "Two methyl cousins sit on the same carbon."),
  dimethylLevel(12, "2,3-Dimethylbutane", "C₆H₁₄", "But", 4, [2, 3], "2,3-", "Two methyl cousins sit on adjacent carbons."),
  alkeneLevel(13, "Ethene", "C₂H₄", "Eth", 2, 1, "Meet the first VIP double bond."),
  alkeneLevel(14, "Propene", "C₃H₆", "Prop", 3, 1, "The double bond still receives the lowest number."),
  alkeneLevel(15, "But-1-ene", "C₄H₈", "But", 4, 1, "Serve the double-bond VIP first."),
  lockedAlkene(16, "But-2-ene", "C₄H₈", "But", 4, 2),
  lockedAlkene(17, "Pent-1-ene", "C₅H₁₀", "Pent", 5, 1),
  lockedAlkene(18, "Pent-2-ene", "C₅H₁₀", "Pent", 5, 2),
  alkyneLevel(19, "Ethyne", "C₂H₂", "Eth", 2, 1, "Meet the first linear triple bond."),
  lockedAlkyne(20, "Propyne", "C₃H₄", "Prop", 3, 1),
  lockedAlkyne(21, "But-1-yne", "C₄H₆", "But", 4, 1),
  lockedAlkyne(22, "But-2-yne", "C₄H₆", "But", 4, 2),
  lockedAlkyne(23, "Pent-1-yne", "C₅H₈", "Pent", 5, 1),
  lockedAlkyne(24, "Pent-2-yne", "C₅H₈", "Pent", 5, 2),
  placeholderLevel(25, "numbering_arena", "4-Methylpent-2-ene", "Lowest locant with branch and double bond"),
  placeholderLevel(26, "numbering_arena", "3-Methylhex-1-yne", "Alkyne priority and branch locant"),
  placeholderLevel(27, "numbering_arena", "3-Ethylhexane", "Ethyl branch recognition"),
  placeholderLevel(28, "numbering_arena", "4-Ethyl-2-methylhexane", "Alphabetical substituent order"),
  placeholderLevel(29, "senior_secondary_boss", "Longest chain trap", "Find the true parent chain"),
  placeholderLevel(30, "senior_secondary_boss", "Lowest locant boss", "Choose the best numbering direction"),
  placeholderLevel(31, "senior_secondary_boss", "Alphabetical substituent order", "Ethyl before methyl in final naming"),
  placeholderLevel(32, "senior_secondary_boss", "Double bond priority", "Multiple bond priority over branches"),
  placeholderLevel(33, "senior_secondary_boss", "Triple bond priority", "Alkyne locants in mixed names"),
  placeholderLevel(34, "senior_secondary_boss", "Mixed challenge", "Branches, double bonds, and triple bonds together"),
  placeholderLevel(35, "senior_secondary_boss", "Final boss", "Complete senior-secondary hydrocarbon naming"),
];

function alkaneLevel(
  number: number,
  targetName: string,
  formula: string,
  root: string,
  carbonCount: number,
  learningGoal: string,
  successKind: HydrocarbonLevel["successKind"] = "chain",
): HydrocarbonLevel {
  const id = `level_${String(number).padStart(3, "0")}_${targetName.toLowerCase().replaceAll(/[^a-z0-9]+/g, "_")}`;
  const sequence = Array.from({ length: carbonCount }, (_, index) => `c${index + 1}`);
  return {
    id,
    moduleId: "family_lineage",
    title: number === 4 ? "The Basic Family Lineage" : `Family Lineage ${number}`,
    subtitle: learningGoal,
    targetName,
    formula,
    difficulty: "beginner",
    status: "playable",
    xp: 100,
    learningGoal,
    molecule: straightChainMolecule(id, carbonCount),
    tasks: [
      { type: "trace_main_chain", correctSequence: sequence, wrongHint: "Stay on the straight parent chain from one end to the other." },
      { type: "assemble_name", availableBlocks: [root, "ane"], correctBlocks: [root, "ane"] },
    ],
    correctChainSequence: sequence,
    chainCompleteMessage: `${carbonCount} carbon${carbonCount === 1 ? "" : "s"} locked. The middle name is ${root}.`,
    availableBlocks: [...rootBlocks, ...suffixBlocks],
    slots: [rootSlot, suffixSlot],
    correctSlotSolution: { root: root.toLowerCase(), suffix: "ane" },
    dialogue: [{ speaker: "Aparna", pose: "pointing", text: "Trace the parent chain first. The root word comes from the carbon count." }],
    successMessage: `${root} + ane gives ${targetName}.`,
    successKind,
    explanation: `${targetName} has ${carbonCount} carbon${carbonCount === 1 ? "" : "s"} in the parent chain and only single bonds, so the suffix is ane.`,
    previewAssetRole: "level_1_visual_reference",
  };
}

function methylLevel(
  number: number,
  targetName: string,
  formula: string,
  root: string,
  mainCount: number,
  methylPositions: number[],
  locant: string,
  learningGoal: string,
): HydrocarbonLevel {
  const id = `level_${String(number).padStart(3, "0")}_${targetName.toLowerCase().replaceAll(/[^a-z0-9]+/g, "_")}`;
  const sequence = Array.from({ length: mainCount }, (_, index) => `c${index + 1}`);
  const needsNumberingChoice = methylPositions[0] === 2 && mainCount >= 4;
  return {
    id,
    moduleId: "cousin_branches",
    title: targetName === "2-Methylpentane" ? "Ranking the Cousin" : "Cousin Branches",
    subtitle: learningGoal,
    targetName,
    formula,
    difficulty: "beginner-plus",
    status: "playable",
    xp: 125,
    learningGoal,
    molecule: methylBranchedMolecule(id, mainCount, methylPositions),
    tasks: [
      { type: "trace_main_chain", correctSequence: sequence, wrongHint: "Do not let the side cousin distract you. Find the longest main chain." },
      ...(needsNumberingChoice
        ? [{ type: "choose_numbering_direction" as const, correctDirection: "left_to_right" as const, wrongHint: "The methyl branch should get the lowest possible number." }]
        : []),
      { type: "assemble_name", availableBlocks: [locant, "Methyl", root, "ane"], correctBlocks: [locant, "Methyl", root, "ane"] },
    ],
    correctChainSequence: sequence,
    chainCompleteMessage: `${mainCount} carbons form the parent chain. The middle name is ${root}.`,
    wrongPathHint: "Arre, do not let the side cousin distract you. Find the longest main family line.",
    numberingOptions: needsNumberingChoice
      ? [
          { id: "left", label: "Count from branch side", branchPosition: methylPositions[0], correct: true },
          { id: "right", label: "Count from far side", branchPosition: mainCount - methylPositions[0] + 1, correct: false },
        ]
      : undefined,
    availableBlocks: [
      { id: locant.replaceAll(/[,-]/g, ""), label: locant, kind: "rank" },
      { id: "wronglocant", label: methylPositions[0] === 2 ? "4-" : "2-", kind: "distractor" },
      { id: "methyl", label: "Methyl", kind: "prefix" },
      { id: "ethyl", label: "Ethyl", kind: "distractor" },
      ...rootBlocks,
      ...suffixBlocks,
    ],
    slots: [
      { id: "rank", label: "Rank / Position", helper: "Where is the methyl branch?" },
      { id: "prefix", label: "First Name / Prefix", helper: "Name the side branch." },
      rootSlot,
      suffixSlot,
    ],
    correctSlotSolution: { rank: locant.replaceAll(/[,-]/g, ""), prefix: "methyl", root: root.toLowerCase(), suffix: "ane" },
    dialogue: [{ speaker: "Aparna", pose: "warning", text: "The branch is the first name, but the parent chain still comes first." }],
    successMessage: `${targetName} is correct. The methyl cousin has the right family rank.`,
    successKind: "chain",
    explanation: `The longest chain has ${mainCount} carbons, so the root is ${root}. The methyl branch is at ${locant.replace("-", "")}, and all bonds are single, so the suffix is ane.`,
    previewAssetRole: "level_2_visual_reference",
  };
}

function dimethylLevel(
  number: number,
  targetName: string,
  formula: string,
  root: string,
  mainCount: number,
  methylPositions: number[],
  locant: string,
  learningGoal: string,
): HydrocarbonLevel {
  const level = methylLevel(number, targetName, formula, root, mainCount, methylPositions, locant, learningGoal);
  return {
    ...level,
    availableBlocks: [
      { id: locant.replaceAll(/[,-]/g, ""), label: locant, kind: "rank" },
      { id: "dimethyl", label: "Dimethyl", kind: "prefix" },
      { id: "methyl", label: "Methyl", kind: "distractor" },
      ...rootBlocks,
      ...suffixBlocks,
    ],
    correctSlotSolution: { rank: locant.replaceAll(/[,-]/g, ""), prefix: "dimethyl", root: root.toLowerCase(), suffix: "ane" },
    explanation: `${targetName} has two methyl groups, so the prefix becomes dimethyl. The parent chain root is ${root}, and single bonds give ane.`,
  };
}

function alkeneLevel(number: number, targetName: string, formula: string, root: string, carbonCount: number, doubleBondStart: number, learningGoal: string): HydrocarbonLevel {
  const id = `level_${String(number).padStart(3, "0")}_${targetName.toLowerCase().replaceAll(/[^a-z0-9]+/g, "_")}`;
  const sequence = Array.from({ length: carbonCount }, (_, index) => `c${index + 1}`);
  return {
    id,
    moduleId: "vip_double_bonds",
    title: targetName === "But-1-ene" ? "Serving the VIP Guest" : "VIP Double Bonds",
    subtitle: learningGoal,
    targetName,
    formula,
    difficulty: "intermediate",
    status: "playable",
    xp: 150,
    learningGoal,
    molecule: alkeneMolecule(id, carbonCount, doubleBondStart),
    tasks: [
      { type: "trace_main_chain", correctSequence: sequence, wrongHint: "Stay on the carbon chain that contains the double bond." },
      { type: "choose_numbering_direction", correctDirection: "left_to_right", wrongHint: "The double bond must get the lowest possible number." },
      { type: "assemble_name", availableBlocks: [root, String(doubleBondStart), "ene"], correctBlocks: [root, String(doubleBondStart), "ene"] },
    ],
    correctChainSequence: sequence,
    chainCompleteMessage: `${carbonCount} carbons give ${root}. Now serve the double bond first.`,
    numberingOptions: [
      { id: "left", label: "Count from double-bond side", doubleBondPosition: doubleBondStart, correct: true },
      { id: "right", label: "Count from far end", doubleBondPosition: carbonCount - doubleBondStart, correct: false },
    ],
    availableBlocks: [
      { id: "one", label: "1", kind: "rank" },
      { id: "two", label: "2", kind: "rank" },
      ...rootBlocks,
      ...suffixBlocks,
    ],
    slots: [
      rootSlot,
      { id: "rank", label: "Double Bond Seat", helper: "Where does the double bond begin?" },
      suffixSlot,
    ],
    correctSlotSolution: { root: root.toLowerCase(), rank: String(doubleBondStart) === "1" ? "one" : "two", suffix: "ene" },
    dialogue: [{ speaker: "Aparna", pose: "pointing", text: "The double bond is our VIP guest. It must get the lowest seat number." }],
    successMessage: `${targetName} is correct. The VIP double bond got the right seat.`,
    successKind: "badge",
    explanation: `${targetName} has ${carbonCount} carbons and a double bond starting at carbon ${doubleBondStart}, so the suffix is ene.`,
    previewAssetRole: "level_3_visual_reference",
  };
}

function lockedAlkene(number: number, targetName: string, formula: string, root: string, carbonCount: number, doubleBondStart: number): HydrocarbonLevel {
  return { ...alkeneLevel(number, targetName, formula, root, carbonCount, doubleBondStart, "Locked alkene practice."), status: "locked", xp: 175 };
}

function alkyneLevel(number: number, targetName: string, formula: string, root: string, carbonCount: number, tripleBondStart: number, learningGoal: string): HydrocarbonLevel {
  const id = `level_${String(number).padStart(3, "0")}_${targetName.toLowerCase().replaceAll(/[^a-z0-9]+/g, "_")}`;
  const sequence = Array.from({ length: carbonCount }, (_, index) => `c${index + 1}`);
  return {
    id,
    moduleId: "triple_bond_trails",
    title: "Triple Bond Trails",
    subtitle: learningGoal,
    targetName,
    formula,
    difficulty: "intermediate",
    status: "playable",
    xp: 175,
    learningGoal,
    molecule: alkyneMolecule(id, carbonCount, tripleBondStart),
    tasks: [
      { type: "trace_main_chain", correctSequence: sequence, wrongHint: "Stay on the carbon chain that contains the triple bond." },
      { type: "assemble_name", availableBlocks: [root, "yne"], correctBlocks: [root, "yne"] },
    ],
    correctChainSequence: sequence,
    chainCompleteMessage: `${carbonCount} carbons give ${root}. A triple bond gives the surname yne.`,
    availableBlocks: [...rootBlocks, ...suffixBlocks],
    slots: [rootSlot, suffixSlot],
    correctSlotSolution: { root: root.toLowerCase(), suffix: "yne" },
    dialogue: [{ speaker: "Aparna", pose: "pointing", text: "The triple bond makes this molecule linear, like a straight glowing trail." }],
    successMessage: `${root} + yne gives ${targetName}.`,
    successKind: "badge",
    explanation: `${targetName} has ${carbonCount} carbons and a triple bond, so the suffix is yne. The triple-bond carbons are linear.`,
    previewAssetRole: "game_board_background_futuristic",
  };
}

function lockedAlkyne(number: number, targetName: string, formula: string, root: string, carbonCount: number, tripleBondStart: number): HydrocarbonLevel {
  const base = lockedAlkene(number, targetName, formula, root, carbonCount, tripleBondStart);
  return {
    ...base,
    moduleId: "triple_bond_trails",
    molecule: alkyneMolecule(base.id, carbonCount, tripleBondStart),
    correctSlotSolution: { root: root.toLowerCase(), rank: tripleBondStart === 1 ? "one" : "two", suffix: "yne" },
    explanation: `${targetName} has a triple bond, so the suffix is yne.`,
    previewAssetRole: "game_board_background_futuristic",
  };
}

function placeholderLevel(number: number, moduleId: HydrocarbonModuleId, targetName: string, learningGoal: string): HydrocarbonLevel {
  const id = `level_${String(number).padStart(3, "0")}_${targetName.toLowerCase().replaceAll(/[^a-z0-9]+/g, "_")}`;
  return {
    id,
    moduleId,
    title: targetName,
    subtitle: learningGoal,
    targetName,
    formula: "Coming soon",
    difficulty: "senior-secondary",
    status: "locked",
    xp: 200,
    learningGoal,
    molecule: straightChainMolecule(id, 4),
    tasks: [],
    correctChainSequence: ["c1", "c2", "c3", "c4"],
    chainCompleteMessage: "Locked challenge preview.",
    availableBlocks: [...rootBlocks, ...suffixBlocks],
    slots: [rootSlot, suffixSlot],
    correctSlotSolution: { root: "but", suffix: "ane" },
    dialogue: [{ speaker: "Aparna", pose: "thinking", text: "This senior-secondary challenge will unlock after the foundations are strong." }],
    successMessage: "Challenge complete.",
    successKind: "badge",
    explanation: learningGoal,
    previewAssetRole: "game_board_background_futuristic",
  };
}
