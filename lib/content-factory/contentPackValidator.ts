import type { ChapterContentPack } from "@/lib/content-factory/contentBlueprintTypes";

export type ContentPackValidationIssue = {
  severity: "error" | "warning";
  message: string;
  topicSlug?: string;
};

export function validateContentPack(pack: ChapterContentPack): ContentPackValidationIssue[] {
  const issues: ContentPackValidationIssue[] = [];

  if (!pack.blueprint.sourceReference) {
    issues.push({ severity: "error", message: "Chapter source reference is required." });
  }

  const seenTopicSlugs = new Set<string>();
  for (const topic of pack.topicPacks) {
    if (seenTopicSlugs.has(topic.slug)) {
      issues.push({ severity: "error", message: `Duplicate topic slug ${topic.slug}.`, topicSlug: topic.slug });
    }
    seenTopicSlugs.add(topic.slug);

    if (topic.explanationCards.length < 3) {
      issues.push({ severity: "warning", message: "Topic should have at least 3 explanation cards.", topicSlug: topic.slug });
    }
    if (topic.memoryCards.length < 5) {
      issues.push({ severity: "warning", message: "Topic should have at least 5 memory cards.", topicSlug: topic.slug });
    }
    if (topic.quickDrills.length < 5) {
      issues.push({ severity: "warning", message: "Topic should have at least 5 quick drill questions.", topicSlug: topic.slug });
    }
    if (topic.mistakePatterns.length < 2) {
      issues.push({ severity: "warning", message: "Topic should have at least 2 mistake patterns.", topicSlug: topic.slug });
    }
  }

  return issues;
}
