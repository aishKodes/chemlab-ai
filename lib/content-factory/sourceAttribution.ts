export type SourceAttribution = {
  sourceReference: string;
  sourceUrl?: string;
  licenseType?: string;
  attributionText?: string;
  usageType: "original_ncert_aligned" | "link_only" | "embed_allowed" | "adapted_open_license";
  accuracyReviewStatus: "draft" | "needs_review" | "verified";
};

export const ncertClass11Unit1Source: SourceAttribution = {
  sourceReference: "NCERT Class 11 Chemistry Unit 1, Some Basic Concepts of Chemistry",
  usageType: "original_ncert_aligned",
  accuracyReviewStatus: "needs_review",
};

export function isExternalResourcePublishable(source: SourceAttribution) {
  if (source.usageType === "original_ncert_aligned") return true;
  return Boolean(
    source.sourceUrl &&
      source.licenseType &&
      source.attributionText &&
      (source.accuracyReviewStatus === "needs_review" || source.accuracyReviewStatus === "verified"),
  );
}

export function buildSourceNote(source: SourceAttribution) {
  if (source.usageType === "original_ncert_aligned") {
    return `${source.sourceReference}. chemlearning content is original and should be reviewed for accuracy before publishing.`;
  }
  return `${source.attributionText ?? "Attribution required"} Source: ${source.sourceUrl ?? "pending"}. License: ${source.licenseType ?? "pending"}.`;
}
