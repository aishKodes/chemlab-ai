import type { ChemistryModule, SimulationMeta } from "@/types";

export const chemistryModules: ChemistryModule[] = [
  {
    slug: "atomic-structure",
    title: "Atomic Structure",
    summary:
      "Build atoms from protons, neutrons, and electrons while connecting subatomic particles to isotopes, ions, shell models, and periodic identity.",
    difficulty: "Foundation",
    estimatedMinutes: 65,
    learningOutcomes: [
      "Identify an element from its proton count",
      "Calculate mass number and ionic charge",
      "Distinguish isotopes from ions using particle counts",
      "Draw basic shell configurations for the first 20 elements",
    ],
    prerequisites: ["Matter and particles", "Positive and negative charge", "Whole-number arithmetic"],
    visualNotes: [
      "Atomic number is locked to protons; changing neutrons does not change the element.",
      "Mass number is protons plus neutrons; it names the isotope.",
      "Charge is protons minus electrons; a positive value means a cation.",
    ],
    simulations: ["atomic-builder", "periodic-table"],
    tools: ["mole-calculator"],
    quizSlug: "atomic-structure",
  },
  {
    slug: "periodic-table",
    title: "Periodic Table",
    summary:
      "Read the periodic table as a map of electron structure, element families, reactivity, and useful trends rather than a list to memorize.",
    difficulty: "Foundation",
    estimatedMinutes: 70,
    learningOutcomes: [
      "Locate periods, groups, and element families",
      "Explain why valence electrons drive chemical behavior",
      "Compare metals, nonmetals, metalloids, halogens, and noble gases",
      "Use trends to predict relative size, reactivity, and electronegativity",
    ],
    prerequisites: ["Atomic number", "Shell model", "Basic element symbols"],
    visualNotes: [
      "Elements in a group often share valence electron patterns.",
      "Periods show the number of occupied electron shells in a simple model.",
      "Noble gases are stable because their outer shell is filled.",
    ],
    simulations: ["periodic-table", "atomic-builder"],
    tools: ["molecular-mass-calculator"],
    quizSlug: "periodic-table",
  },
  {
    slug: "chemical-bonding",
    title: "Chemical Bonding",
    summary:
      "Model how atoms transfer or share electrons to form ionic and covalent substances, then connect bonding to formulas and properties.",
    difficulty: "Intermediate",
    estimatedMinutes: 85,
    learningOutcomes: [
      "Predict ionic bonding between metals and nonmetals",
      "Predict covalent bonding between nonmetals",
      "Use valence electrons to explain simple formulas",
      "Compare properties of ionic and molecular substances",
    ],
    prerequisites: ["Periodic groups", "Valence electrons", "Ion charge"],
    visualNotes: [
      "Ionic bonds form through electrostatic attraction after electron transfer.",
      "Covalent bonds form when atoms share electron pairs.",
      "Formula ratios keep total charge neutral in ionic compounds.",
    ],
    simulations: ["bonding-lab", "periodic-table"],
    tools: ["molecular-mass-calculator"],
    quizSlug: "chemical-bonding",
  },
  {
    slug: "mole-concept",
    title: "Mole Concept",
    summary:
      "Translate between grams, moles, and particles so chemical equations become measurable laboratory recipes.",
    difficulty: "Intermediate",
    estimatedMinutes: 90,
    learningOutcomes: [
      "Convert between mass and moles using molar mass",
      "Convert between moles and particles using Avogadro's number",
      "Interpret coefficients as mole ratios",
      "Estimate particle counts at meaningful scales",
    ],
    prerequisites: ["Scientific notation", "Atomic mass", "Chemical formulas"],
    visualNotes: [
      "One mole always means 6.022 x 10^23 particles.",
      "Molar mass links microscopic particles to measurable grams.",
      "Equation coefficients compare moles, not grams directly.",
    ],
    simulations: ["mole-visualizer", "equation-balancer"],
    tools: ["mole-calculator", "molecular-mass-calculator"],
    quizSlug: "mole-concept",
  },
  {
    slug: "chemical-reactions",
    title: "Chemical Reactions",
    summary:
      "Use conservation of atoms to read, check, and eventually balance equations for reaction patterns students meet in exams and labs.",
    difficulty: "Intermediate",
    estimatedMinutes: 80,
    learningOutcomes: [
      "Count atoms on both sides of a chemical equation",
      "Explain conservation of mass using balanced equations",
      "Recognize synthesis, decomposition, single replacement, and combustion examples",
      "Spot common coefficient and subscript mistakes",
    ],
    prerequisites: ["Chemical formulas", "Mole ratios", "Basic arithmetic"],
    visualNotes: [
      "Coefficients multiply every atom in the formula that follows them.",
      "Subscripts are part of the formula and should not be changed while balancing.",
      "A balanced equation has equal atom counts for every element on both sides.",
    ],
    simulations: ["equation-balancer", "mole-visualizer"],
    tools: ["equation-balancer", "mole-calculator"],
    quizSlug: "chemical-reactions",
  },
];

export const simulations: SimulationMeta[] = [
  {
    slug: "atomic-builder",
    title: "Atomic Builder",
    description:
      "Adjust protons, neutrons, and electrons to see identity, isotope, ion charge, and shell structure change instantly.",
    chapterSlug: "atomic-structure",
    difficulty: "Foundation",
    componentKey: "AtomicBuilder",
  },
  {
    slug: "periodic-table",
    title: "Periodic Table Explorer",
    description:
      "Search, filter, and inspect the first 30 elements with trend explanations and electron-structure cues.",
    chapterSlug: "periodic-table",
    difficulty: "Foundation",
    componentKey: "PeriodicTableExplorer",
  },
  {
    slug: "equation-balancer",
    title: "Equation Balance Checker",
    description:
      "Type or select a reaction, count atoms on each side, and verify whether conservation of mass is satisfied.",
    chapterSlug: "chemical-reactions",
    difficulty: "Intermediate",
    componentKey: "EquationBalancer",
  },
  {
    slug: "mole-visualizer",
    title: "Mole Concept Visualizer",
    description:
      "Convert mass to moles and particles while seeing the scale of Avogadro's number through visual particle fields.",
    chapterSlug: "mole-concept",
    difficulty: "Intermediate",
    componentKey: "MoleVisualizer",
  },
  {
    slug: "bonding-lab",
    title: "Chemical Bonding Lab",
    description:
      "Compare ionic and covalent examples using valence electron patterns and formula-level reasoning.",
    chapterSlug: "chemical-bonding",
    difficulty: "Intermediate",
    componentKey: "BondingLab",
  },
];

export function getModuleBySlug(slug: string) {
  return chemistryModules.find((module) => module.slug === slug);
}

export function getSimulationBySlug(slug: string) {
  return simulations.find((simulation) => simulation.slug === slug);
}
