import type { Metadata } from "next";
import { CheckCircle2, FlaskConical, ListChecks, PencilRuler } from "lucide-react";
import { class11SomeBasicConceptsContentPack } from "@/data/content-packs/class-11/some-basic-concepts-of-chemistry";
import { buildCoverageRows, calculatePackCoverage, getChapterResourceSummary } from "@/lib/content-factory/contentPackBuilder";
import { validateContentPack } from "@/lib/content-factory/contentPackValidator";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "Content Factory",
  description: "Plan and review Chemlab chapter packs before publishing.",
};

export default function ContentFactoryPage() {
  const pack = class11SomeBasicConceptsContentPack;
  const summary = getChapterResourceSummary(pack);
  const coverageRows = buildCoverageRows(pack);
  const validationIssues = validateContentPack(pack);
  const coverage = calculatePackCoverage(pack);

  return (
    <>
      <PageHeader
        eyebrow="Admin"
        title="Content Factory"
        description="Plan chapter packs, check coverage, and move resources into review without building every page by hand."
      />
      <Container className="space-y-6 pb-16">
        <Card className="bg-gradient-to-br from-blue-950 via-violet-950 to-slate-950 text-white">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div>
              <Badge tone="blue">Class {summary.classLevel} Chemistry</Badge>
              <h2 className="mt-4 text-3xl font-black">{summary.title}</h2>
              <p className="mt-3 max-w-3xl text-sm font-semibold leading-6 text-blue-100">
                Source backbone: {summary.sourceReference}. Public content stays original and reviewable.
              </p>
            </div>
            <div className="rounded-[1.6rem] bg-white/10 p-5 text-center">
              <p className="text-5xl font-black">{coverage}%</p>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-cyan-100">coverage</p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button href="/resources/some-basic-concepts-of-chemistry" icon={<ListChecks className="h-4 w-4" aria-hidden="true" />}>
              View public resource
            </Button>
            <Button href="/labs/basic-concepts-chemistry-universe" variant="secondary" icon={<FlaskConical className="h-4 w-4" aria-hidden="true" />}>
              Open lab
            </Button>
          </div>
        </Card>

        <div className="grid gap-5 md:grid-cols-4">
          <MetricCard label="Topics" value={String(summary.topics)} />
          <MetricCard label="Memory cards" value={String(summary.memoryCards)} />
          <MetricCard label="Drill questions" value={String(summary.quickDrills)} />
          <MetricCard label="Mistake patterns" value={String(summary.mistakePatterns)} />
        </div>

        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <Badge tone="green">Coverage grid</Badge>
              <h2 className="mt-3 text-2xl font-black text-slate-950">Class 11 Unit 1 production status</h2>
            </div>
            <Badge tone={validationIssues.some((issue) => issue.severity === "error") ? "amber" : "green"}>
              {validationIssues.length ? `${validationIssues.length} review notes` : "Pack valid"}
            </Badge>
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-[920px] w-full border-separate border-spacing-y-2 text-left text-sm">
              <thead className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                <tr>
                  <th className="px-3 py-2">Topic</th>
                  <th className="px-3 py-2">Explanation</th>
                  <th className="px-3 py-2">Cards</th>
                  <th className="px-3 py-2">Drills</th>
                  <th className="px-3 py-2">Mistakes</th>
                  <th className="px-3 py-2">Coverage</th>
                  <th className="px-3 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {coverageRows.map((row) => (
                  <tr key={row.topicSlug} className="bg-slate-50">
                    <td className="rounded-l-2xl px-3 py-3 font-black text-slate-950">{row.topicTitle}</td>
                    <td className="px-3 py-3 font-bold text-slate-700">{row.explanationCount}</td>
                    <td className="px-3 py-3 font-bold text-slate-700">{row.memoryCardCount}</td>
                    <td className="px-3 py-3 font-bold text-slate-700">{row.quickDrillCount}</td>
                    <td className="px-3 py-3 font-bold text-slate-700">{row.mistakePatternCount}</td>
                    <td className="px-3 py-3">
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-blue-800">{row.coverageScore}%</span>
                    </td>
                    <td className="rounded-r-2xl px-3 py-3">
                      <Badge tone={row.status === "needs_review" ? "amber" : "slate"}>{row.status.replaceAll("_", " ")}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-white via-amber-50 to-cyan-50">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-amber-500 text-white">
              <PencilRuler className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-2xl font-black text-slate-950">Stage 8 workflow</h2>
              <p className="mt-1 text-sm font-semibold text-slate-700">
                Content Factory {"->"} generate or curate chapter pack {"->"} admin review {"->"} publish.
              </p>
            </div>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {["Create missing resource", "Mark for review", "Attach simulation"].map((action) => (
              <div key={action} className="flex items-center gap-2 rounded-2xl bg-white/80 p-4 text-sm font-black text-slate-800 shadow-sm">
                <CheckCircle2 className="h-4 w-4 text-green-600" aria-hidden="true" />
                {action}
              </div>
            ))}
          </div>
        </Card>
      </Container>
    </>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-700">{label}</p>
      <p className="mt-2 text-4xl font-black text-slate-950">{value}</p>
    </Card>
  );
}
