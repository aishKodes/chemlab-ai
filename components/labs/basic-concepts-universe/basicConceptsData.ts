import type { Checkpoint, MatterSample, SubstanceCard, UniverseZone } from "@/components/labs/basic-concepts-universe/basicConceptsTypes";

export const universeZones: UniverseZone[] = [
  {
    id: "matter-world",
    title: "Matter World",
    subtitle: "Particles, states, and classification",
    objective: "Change particle motion, classify samples, and prove that matter has structure.",
    status: "playable",
    badge: "Matter Mapper",
    xp: 120,
  },
  {
    id: "measurement-lab",
    title: "Measurement Lab",
    subtitle: "Units, notation, significant figures",
    objective: "Turn messy measurements into clean chemistry numbers.",
    status: "playable",
    badge: "Measurement Pilot",
    xp: 140,
  },
  {
    id: "chemical-laws-court",
    title: "Law Court",
    subtitle: "Chemical combination laws",
    objective: "Use evidence to identify conservation, fixed ratios, and gas volume patterns.",
    status: "preview",
    badge: "Law Keeper",
    xp: 160,
  },
  {
    id: "mole-portal",
    title: "Mole Portal",
    subtitle: "Mass to moles to particles",
    objective: "Connect grams, moles, and invisible particle counts.",
    status: "playable",
    badge: "Mole Walker",
    xp: 170,
  },
  {
    id: "formula-detective",
    title: "Formula Detective",
    subtitle: "Empirical and molecular formula",
    objective: "Use percent clues to unlock formulas.",
    status: "preview",
    badge: "Formula Detective",
    xp: 180,
  },
  {
    id: "stoichiometry-factory",
    title: "Stoichiometry Factory",
    subtitle: "Balanced equations and limiting reagent",
    objective: "Feed reactants into a balanced-equation machine and find the limiting reagent.",
    status: "playable",
    badge: "Stoichiometry Operator",
    xp: 200,
  },
];

export const matterSamples: MatterSample[] = [
  { name: "Copper wire", correctCategory: "element", clue: "Only copper atoms are present." },
  { name: "Pure water", correctCategory: "compound", clue: "Hydrogen and oxygen are chemically combined in a fixed ratio." },
  { name: "Air", correctCategory: "homogeneous mixture", clue: "Several gases are mixed uniformly." },
  { name: "Soil", correctCategory: "heterogeneous mixture", clue: "Different particles are visible or unevenly distributed." },
];

export const substances: SubstanceCard[] = [
  { formula: "H2O", name: "Water", molarMass: 18.02, atoms: { H: 2, O: 1 } },
  { formula: "CO2", name: "Carbon dioxide", molarMass: 44.01, atoms: { C: 1, O: 2 } },
  { formula: "CH4", name: "Methane", molarMass: 16.04, atoms: { C: 1, H: 4 } },
  { formula: "Na2SO4", name: "Sodium sulphate", molarMass: 142.04, atoms: { Na: 2, S: 1, O: 4 } },
];

export const matterCheckpoints: Checkpoint[] = [
  {
    question: "Which sample is a compound?",
    options: ["Pure water", "Air", "Copper wire"],
    answer: "Pure water",
    explanation: "Water has hydrogen and oxygen chemically combined in a fixed ratio.",
  },
  {
    question: "What changes most when a liquid becomes gas?",
    options: ["Particle spacing and motion", "Element identity", "Atomic mass"],
    answer: "Particle spacing and motion",
    explanation: "The substance can remain the same while particle arrangement changes.",
  },
  {
    question: "Which category fits soil best?",
    options: ["Heterogeneous mixture", "Element", "Compound"],
    answer: "Heterogeneous mixture",
    explanation: "Soil has visibly different components and uneven composition.",
  },
];

export const measurementCheckpoints: Checkpoint[] = [
  {
    question: "How many significant figures are in 2.50?",
    options: ["3", "2", "1"],
    answer: "3",
    explanation: "The trailing zero after the decimal is measured.",
  },
  {
    question: "250 mL equals how many litres?",
    options: ["0.250 L", "2.50 L", "250000 L"],
    answer: "0.250 L",
    explanation: "Divide millilitres by 1000 to get litres.",
  },
  {
    question: "Tight arrows away from the bullseye are...",
    options: ["Precise but not accurate", "Accurate but not precise", "Neither measured nor useful"],
    answer: "Precise but not accurate",
    explanation: "Precision is closeness among readings; accuracy is closeness to true value.",
  },
];

export const moleCheckpoints: Checkpoint[] = [
  {
    question: "What connects moles to particles?",
    options: ["Avogadro constant", "Boiling point", "Density only"],
    answer: "Avogadro constant",
    explanation: "One mole contains about 6.022 x 10^23 entities.",
  },
  {
    question: "Which formula gives moles?",
    options: ["mass / molar mass", "molar mass / mass", "mass x Avogadro constant"],
    answer: "mass / molar mass",
    explanation: "Moles = given mass divided by molar mass.",
  },
  {
    question: "18 g of water is closest to...",
    options: ["1 mole", "18 moles", "0.018 mole"],
    answer: "1 mole",
    explanation: "Water has molar mass about 18 g mol^-1.",
  },
];

export const stoichiometryCheckpoints: Checkpoint[] = [
  {
    question: "For N2 + 3H2 -> 2NH3, one mole N2 needs...",
    options: ["3 moles H2", "1 mole H2", "2 moles H2"],
    answer: "3 moles H2",
    explanation: "The coefficient 3 before H2 gives the mole ratio.",
  },
  {
    question: "The limiting reagent is...",
    options: ["the reactant that runs out first", "always the heavier reactant", "always the product"],
    answer: "the reactant that runs out first",
    explanation: "The limiting reagent controls maximum product formed.",
  },
  {
    question: "Why balance before calculating?",
    options: ["Coefficients give mole ratios", "It makes names shorter", "It removes units"],
    answer: "Coefficients give mole ratios",
    explanation: "Stoichiometry uses the balanced equation as the recipe.",
  },
];
