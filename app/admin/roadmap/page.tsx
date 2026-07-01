import type { Metadata } from "next";
import { class11SomeBasicConceptsContentPack } from "@/data/content-packs/class-11/some-basic-concepts-of-chemistry";
import { buildCoverageRows, getChapterResourceSummary } from "@/lib/content-factory/contentPackBuilder";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "Admin Roadmap",
  description: "Chemlab admin roadmap for content production.",
};

export default function AdminRoadmapPage() {
  const summary = getChapterResourceSummary(class11SomeBasicConceptsContentPack);
  const rows = buildCoverageRows(class11SomeBasicConceptsContentPack);
  return (
    <>
      <PageHeader
        eyebrow="Admin Roadmap"
        title="Chemistry production map"
        description="Track what exists, what needs review, and what should become a simulation next."
      />
      <Container className="space-y-6 pb-16">
        <Card className="bg-gradient-to-br from-white via-violet-50 to-cyan-50">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <Badge tone="blue">Class 11</Badge>
              <h2 className="mt-3 text-3xl font-black text-slate-950">{summary.title}</h2>
              <p className="mt-2 text-sm font-semibold text-slate-600">
                {summary.topics} topics, {summary.memoryCards} memory cards, {summary.quickDrills} drill questions, {summary.mistakePatterns} mistake patterns.
              </p>
            </div>
            <Button href="/admin/content-factory">Open Content Factory</Button>
          </div>
        </Card>
        <Card>
          <Badge tone="green">Topic production</Badge>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {rows.map((row) => (
              <div key={row.topicSlug} className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-black text-slate-950">{row.topicTitle}</h3>
                  <Badge tone={row.coverageScore >= 100 ? "green" : "amber"}>{row.coverageScore}%</Badge>
                </div>
                <p className="mt-2 text-xs font-bold text-slate-600">
                  Explanation {row.explanationCount} / Cards {row.memoryCardCount} / Drills {row.quickDrillCount} / Mistakes {row.mistakePatternCount}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </Container>
    </>
  );
}
