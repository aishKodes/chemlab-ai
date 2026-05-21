export type LabStatus = "featured" | "prototype" | "comingSoon";

export type LabCatalogEntry = {
  slug: string;
  title: string;
  description: string;
  classLevel: string;
  topic: string;
  status: LabStatus;
  route: string;
  xp: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedMinutes: number;
  concepts: string[];
  thumbnailType: "electrochem" | "molecule" | "acid-base" | "practice" | "future";
};

export const labCatalog: LabCatalogEntry[] = [
  {
    slug: "daniell-cell-studio",
    title: "Daniell Cell Studio",
    description: "Build a galvanic cell and watch electrons create voltage.",
    classLevel: "Class 12",
    topic: "Electrochemistry",
    status: "featured",
    route: "/labs/daniell-cell-studio",
    xp: 240,
    difficulty: "Advanced",
    estimatedMinutes: 12,
    concepts: ["anode", "cathode", "oxidation", "reduction", "salt bridge", "voltage"],
    thumbnailType: "electrochem",
  },
  {
    slug: "molecule-explorer",
    title: "Molecule Explorer",
    description: "Rotate molecules, compare shapes, and see why chemistry is 3D.",
    classLevel: "Class 11-12",
    topic: "Molecular geometry",
    status: "featured",
    route: "/simulations/molecule-explorer",
    xp: 140,
    difficulty: "Intermediate",
    estimatedMinutes: 8,
    concepts: ["geometry", "bond angle", "lone pair", "VSEPR", "ionic lattice"],
    thumbnailType: "molecule",
  },
  {
    slug: "neutralization-studio",
    title: "Neutralization Studio",
    description: "Mix acid and base, find neutral pH, and reveal salt crystals.",
    classLevel: "Class 10-12",
    topic: "Acids, bases, and salts",
    status: "prototype",
    route: "/labs/neutralization-studio",
    xp: 160,
    difficulty: "Intermediate",
    estimatedMinutes: 10,
    concepts: ["pH", "indicator", "neutralization", "salt formation"],
    thumbnailType: "acid-base",
  },
  {
    slug: "cinematic-salt-lab",
    title: "Cinematic Salt Lab",
    description: "An early story lab for safe mixing and pH clues.",
    classLevel: "Class 10-12",
    topic: "Salt formation",
    status: "prototype",
    route: "/labs/cinematic-salt-lab",
    xp: 120,
    difficulty: "Beginner",
    estimatedMinutes: 8,
    concepts: ["acid", "base", "indicator", "evaporation"],
    thumbnailType: "acid-base",
  },
  {
    slug: "reaction-balancer",
    title: "Reaction Rescue",
    description: "Balance a reaction puzzle and protect conservation of mass.",
    classLevel: "Class 9-11",
    topic: "Chemical reactions",
    status: "prototype",
    route: "/simulations/equation-balancer",
    xp: 120,
    difficulty: "Beginner",
    estimatedMinutes: 7,
    concepts: ["atom count", "coefficient", "conservation of mass"],
    thumbnailType: "practice",
  },
  {
    slug: "titration-studio",
    title: "Titration Studio",
    description: "Find an endpoint drop by drop in a future practical.",
    classLevel: "Class 12",
    topic: "Volumetric analysis",
    status: "comingSoon",
    route: "/labs",
    xp: 220,
    difficulty: "Advanced",
    estimatedMinutes: 14,
    concepts: ["endpoint", "indicator", "standard solution"],
    thumbnailType: "future",
  },
  {
    slug: "electrolysis-studio",
    title: "Electrolysis Studio",
    description: "Drive a reaction using electricity in a future lab.",
    classLevel: "Class 12",
    topic: "Electrochemistry",
    status: "comingSoon",
    route: "/labs",
    xp: 240,
    difficulty: "Advanced",
    estimatedMinutes: 14,
    concepts: ["electrolysis", "ions", "electrodes"],
    thumbnailType: "future",
  },
  {
    slug: "equilibrium-lab",
    title: "Equilibrium Lab",
    description: "Shift a reversible reaction and explain the evidence.",
    classLevel: "Class 11-12",
    topic: "Equilibrium",
    status: "comingSoon",
    route: "/labs",
    xp: 220,
    difficulty: "Advanced",
    estimatedMinutes: 13,
    concepts: ["dynamic equilibrium", "stress", "shift"],
    thumbnailType: "future",
  },
  {
    slug: "organic-mechanism-lab",
    title: "Organic Mechanism Lab",
    description: "Follow electron movement through a future organic reaction.",
    classLevel: "Class 12",
    topic: "Organic chemistry",
    status: "comingSoon",
    route: "/labs",
    xp: 260,
    difficulty: "Advanced",
    estimatedMinutes: 15,
    concepts: ["mechanism", "nucleophile", "leaving group"],
    thumbnailType: "future",
  },
];

export function getLabsByStatus(status: LabStatus) {
  return labCatalog.filter((lab) => lab.status === status);
}
