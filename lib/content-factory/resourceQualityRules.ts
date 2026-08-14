import type { CoverageRow, TopicContentPack } from "@/lib/content-factory/contentBlueprintTypes";

export const topicCompletionRules = {
  minimumExplanationCards: 1,
  minimumMemoryCards: 5,
  minimumQuickDrillQuestions: 5,
  minimumMistakePatterns: 1,
  minimumConceptMaps: 1,
  minimumVisualResourcesForSuitableTopics: 1,
};

export function calculateTopicCoverage(topic: TopicContentPack, linkedVisualCount = 0, linkedConceptMapCount = 0): CoverageRow {
  const checks = [
    topic.explanationCards.length >= topicCompletionRules.minimumExplanationCards,
    topic.memoryCards.length >= topicCompletionRules.minimumMemoryCards,
    topic.quickDrills.length >= topicCompletionRules.minimumQuickDrillQuestions,
    topic.mistakePatterns.length >= topicCompletionRules.minimumMistakePatterns,
    linkedConceptMapCount >= topicCompletionRules.minimumConceptMaps,
    linkedVisualCount >= topicCompletionRules.minimumVisualResourcesForSuitableTopics || topic.difficulty === "beginner",
  ];
  const coverageScore = Math.round((checks.filter(Boolean).length / checks.length) * 100);

  return {
    topicSlug: topic.slug,
    topicTitle: topic.title,
    explanationCount: topic.explanationCards.length,
    memoryCardCount: topic.memoryCards.length,
    quickDrillCount: topic.quickDrills.length,
    conceptMapCount: linkedConceptMapCount,
    simulationCount: linkedVisualCount,
    mistakePatternCount: topic.mistakePatterns.length,
    status: coverageScore >= 100 ? "needs_review" : "draft",
    coverageScore,
  };
}

export function getCoverageLabel(score: number) {
  if (score >= 100) return "Ready for review";
  if (score >= 70) return "Nearly ready";
  if (score >= 40) return "Needs build";
  return "Missing core pieces";
}

export const resourceQualityChecklist = [
  "Scientifically accurate and NCERT-aligned",
  "Original chemlearning explanation, not copied textbook text",
  "One clear learning goal per screen",
  "Mobile usable with readable labels",
  "Wrong answers explain the misconception",
  "Source reference and review status present",
  "Chem-Shastri context note attached",
  "Analytics keys attached for views, mistakes, and completion",
];
