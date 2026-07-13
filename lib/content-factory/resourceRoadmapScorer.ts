import type { NcertRoadmapItem, RoadmapSummary } from "./resourceRoadmapTypes";

export function getRoadmapSummary(items: NcertRoadmapItem[]): RoadmapSummary {
  const demoReady = items.filter((item) => item.status === "demo_ready").length;
  const published = items.filter((item) => item.status === "published").length;
  const missing = items.filter((item) => item.status === "missing").length;
  const covered = items.filter((item) => ["demo_ready", "published", "needs_review"].includes(item.status)).length;
  return {
    total: items.length,
    demoReady,
    published,
    missing,
    coveragePercent: Math.round((covered / Math.max(items.length, 1)) * 100),
    buildNext: getBuildNextRecommendations(items),
  };
}

export function getBuildNextRecommendations(items: NcertRoadmapItem[], limit = 8) {
  return [...items]
    .filter((item) => ["missing", "planned", "in_progress"].includes(item.status))
    .sort((a, b) => scoreRoadmapItem(b) - scoreRoadmapItem(a))
    .slice(0, limit);
}

export function scoreRoadmapItem(item: NcertRoadmapItem) {
  const priority = { low: 1, medium: 2, high: 3, flagship: 5 }[item.priority];
  const wow = { low: 1, medium: 2, high: 3, flagship: 5 }[item.wowPotential];
  const effort = { small: 3, medium: 2, large: 1 }[item.estimatedBuildEffort];
  const risk = { low: 2, medium: 1, high: 0 }[item.accuracyRisk];
  return priority * 4 + wow * 3 + effort + risk;
}
