import type { RagCitation } from "./types";

export function formatAnswerWithCitations(answer: string, citations: RagCitation[]) {
  if (!citations.length) return answer.trim();
  const seen = new Set<string>();
  const labels = citations
    .filter((citation) => {
      const key = citation.label;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 4)
    .map((citation) => `- ${citation.label}${citation.pageStart ? `, p. ${citation.pageStart}` : ""}`);
  return `${answer.trim()}\n\nSources:\n${labels.join("\n")}`;
}
