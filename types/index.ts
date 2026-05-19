export type Difficulty = "Foundation" | "Intermediate" | "Advanced";

export type ElementCategory =
  | "alkali metal"
  | "alkaline earth metal"
  | "transition metal"
  | "post-transition metal"
  | "metalloid"
  | "reactive nonmetal"
  | "noble gas"
  | "halogen";

export type PeriodicElement = {
  atomicNumber: number;
  symbol: string;
  name: string;
  atomicMass: number;
  group: number;
  period: number;
  category: ElementCategory;
  electronegativity?: number;
  electronConfiguration: string;
  commonOxidationStates: number[];
};

export type ChemistryModule = {
  slug: string;
  title: string;
  summary: string;
  difficulty: Difficulty;
  estimatedMinutes: number;
  learningOutcomes: string[];
  prerequisites: string[];
  visualNotes: string[];
  simulations: string[];
  tools: string[];
  quizSlug: string;
};

export type SimulationMeta = {
  slug: string;
  title: string;
  description: string;
  chapterSlug: string;
  difficulty: Difficulty;
  componentKey: string;
};

export type QuestionType = "multiple_choice" | "numeric" | "true_false";

export type QuizQuestion = {
  id: string;
  chapterSlug: string;
  type: QuestionType;
  difficulty: Difficulty;
  questionText: string;
  options?: string[];
  correctAnswer: string | number | boolean;
  explanation: string;
  tags: string[];
};
