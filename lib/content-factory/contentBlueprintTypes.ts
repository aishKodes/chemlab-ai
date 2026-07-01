export type ClassLevel = "9" | "10" | "11" | "12";
export type SubjectName = "Science" | "Chemistry";
export type ContentStatus = "draft" | "needs_review" | "verified" | "published";
export type TopicDifficulty = "beginner" | "intermediate" | "advanced";

export type TopicBlueprint = {
  title: string;
  slug: string;
  order: number;
  difficulty: TopicDifficulty;
  learningGoal: string;
  commonMisconceptions: string[];
};

export type ResourcePlanItem = {
  title: string;
  slug: string;
  type:
    | "explanation"
    | "visualization"
    | "simulation"
    | "story_lab"
    | "memory_deck"
    | "quick_drill"
    | "concept_map"
    | "teacher_quiz"
    | "public_quiz";
  topicSlug?: string;
  status: ContentStatus;
  routeUrl?: string;
  sourceReference: string;
};

export type SimulationPlanItem = {
  title: string;
  slug: string;
  type: "visualization" | "story_lab" | "interactive_game" | "calculator_lab" | "3d_model" | "virtual_practical";
  priority: "must_build" | "should_build" | "optional";
  wowFactor: string;
  learningOutcome: string;
  routeUrl?: string;
};

export type MemoryDeckPlanItem = {
  title: string;
  slug: string;
  topicSlugs: string[];
  status: ContentStatus;
  minimumCards: number;
};

export type QuizPlanItem = {
  title: string;
  slug: string;
  audience: "student" | "teacher" | "public";
  topicSlugs: string[];
  status: ContentStatus;
  minimumQuestions: number;
};

export type ConceptMapPlanItem = {
  title: string;
  slug: string;
  topicSlugs: string[];
  status: ContentStatus;
};

export type MistakePatternPlanItem = {
  title: string;
  mistakeKey: string;
  topicSlug: string;
  severity: "low" | "medium" | "high";
};

export type ExplanationCard = {
  title: string;
  body: string;
  visualHint: string;
};

export type MemoryCardSeed = {
  front: string;
  back: string;
  hint: string;
  explanation: string;
  cardType: "concept" | "formula" | "definition" | "mistake" | "application";
  difficulty: TopicDifficulty;
  mistakeKey?: string;
};

export type QuickDrillQuestionSeed = {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  hint: string;
  difficulty: TopicDifficulty;
  mistakeKey: string;
};

export type MistakePatternSeed = {
  mistakeKey: string;
  title: string;
  description: string;
  correction: string;
  example: string;
  severity: "low" | "medium" | "high";
};

export type TopicContentPack = TopicBlueprint & {
  explanationCards: ExplanationCard[];
  memoryCards: MemoryCardSeed[];
  quickDrills: QuickDrillQuestionSeed[];
  mistakePatterns: MistakePatternSeed[];
  chemShastriContextNote: string;
  analyticsKeys: {
    resourceViewed: string;
    drillAttempted: string;
    mistakePrefix: string;
  };
};

export type ChapterContentBlueprint = {
  classLevel: ClassLevel;
  subject: SubjectName;
  chapterTitle: string;
  chapterSlug: string;
  sourceReference: string;
  status: ContentStatus;
  learningGoals: string[];
  topics: TopicBlueprint[];
  resourcePlan: ResourcePlanItem[];
  simulationPlan: SimulationPlanItem[];
  memoryDeckPlan: MemoryDeckPlanItem[];
  quizPlan: QuizPlanItem[];
  conceptMapPlan: ConceptMapPlanItem[];
  mistakePatternPlan: MistakePatternPlanItem[];
};

export type ChapterContentPack = {
  blueprint: ChapterContentBlueprint;
  topicPacks: TopicContentPack[];
};

export type CoverageRow = {
  topicSlug: string;
  topicTitle: string;
  explanationCount: number;
  memoryCardCount: number;
  quickDrillCount: number;
  conceptMapCount: number;
  simulationCount: number;
  mistakePatternCount: number;
  status: ContentStatus;
  coverageScore: number;
};
