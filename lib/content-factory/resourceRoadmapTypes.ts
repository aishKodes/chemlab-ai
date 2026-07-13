export type RoadmapPriority = "low" | "medium" | "high" | "flagship";
export type RoadmapStatus = "missing" | "planned" | "in_progress" | "needs_review" | "demo_ready" | "published";
export type BuildApproach = "build_ourselves" | "link_open_resource" | "adapt_open_source_repo" | "simple_visualization" | "full_story_simulation";
export type ResourceNeed = "simulation" | "visualization" | "memory_deck" | "quick_drill" | "concept_map" | "teacher_quiz" | "public_quiz" | "chem_shastri_context";

export type NcertRoadmapItem = {
  id: string;
  classLevel: "9" | "10" | "11" | "12";
  subject: "Science" | "Chemistry";
  chapter: string;
  topic: string;
  priority: RoadmapPriority;
  resourceNeeds: ResourceNeed[];
  buildApproach: BuildApproach;
  status: RoadmapStatus;
  wowPotential: "low" | "medium" | "high" | "flagship";
  accuracyRisk: "low" | "medium" | "high";
  estimatedBuildEffort: "small" | "medium" | "large";
  recommendedExperience: string;
  routeUrl?: string;
  openResourceCandidateSlug?: string;
};

export type RoadmapSummary = {
  total: number;
  demoReady: number;
  published: number;
  missing: number;
  coveragePercent: number;
  buildNext: NcertRoadmapItem[];
};
