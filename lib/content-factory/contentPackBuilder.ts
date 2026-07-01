import type { ChapterContentPack, CoverageRow } from "@/lib/content-factory/contentBlueprintTypes";
import { calculateTopicCoverage } from "@/lib/content-factory/resourceQualityRules";

export function buildCoverageRows(pack: ChapterContentPack): CoverageRow[] {
  return pack.topicPacks.map((topic) => {
    const linkedConceptMaps = pack.blueprint.conceptMapPlan.filter((item) => item.topicSlugs.includes(topic.slug)).length;
    const linkedVisuals = pack.blueprint.simulationPlan.filter((item) => item.learningOutcome.toLowerCase().includes(topic.title.toLowerCase())).length;
    return calculateTopicCoverage(topic, linkedVisuals, linkedConceptMaps);
  });
}

export function calculatePackCoverage(pack: ChapterContentPack) {
  const rows = buildCoverageRows(pack);
  if (!rows.length) return 0;
  return Math.round(rows.reduce((sum, row) => sum + row.coverageScore, 0) / rows.length);
}

export function getTopicPack(pack: ChapterContentPack, topicSlug: string) {
  return pack.topicPacks.find((topic) => topic.slug === topicSlug);
}

export function getChapterResourceSummary(pack: ChapterContentPack) {
  return {
    title: pack.blueprint.chapterTitle,
    slug: pack.blueprint.chapterSlug,
    classLevel: pack.blueprint.classLevel,
    sourceReference: pack.blueprint.sourceReference,
    topics: pack.topicPacks.length,
    memoryCards: pack.topicPacks.reduce((sum, topic) => sum + topic.memoryCards.length, 0),
    quickDrills: pack.topicPacks.reduce((sum, topic) => sum + topic.quickDrills.length, 0),
    mistakePatterns: pack.topicPacks.reduce((sum, topic) => sum + topic.mistakePatterns.length, 0),
    coverageScore: calculatePackCoverage(pack),
  };
}
