import type { Metadata } from "next";
import { FlaskConical, Sparkles } from "lucide-react";
import { ncertChemistryRoadmap } from "@/data/roadmaps/ncert-chemistry-roadmap";
import { getRoadmapSummary } from "@/lib/content-factory/resourceRoadmapScorer";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "Chemistry Roadmap",
  description: "chemlearning class-wise chemistry roadmap for Class 9 to 12.",
};

export default function ChemistryRoadmapPage() {
  const summary = getRoadmapSummary(ncertChemistryRoadmap);
  const liveItems = ncertChemistryRoadmap.filter((item) => item.routeUrl && ["demo_ready", "published", "needs_review"].includes(item.status));
  const classRows = ["9", "10", "11", "12"].map((classLevel) => ({
    classLevel,
    items: ncertChemistryRoadmap.filter((item) => item.classLevel === classLevel),
  }));

  return (
    <>
      <PageHeader
        eyebrow="Roadmap"
        title="chemlearning chemistry worlds are growing."
        description="A serious Class 9-12 map for simulations, memory cards, quick drills, concept maps, teacher quizzes, and Chem-Shastri context."
      />
      <Container className="space-y-8 pb-16">
        <Card className="bg-gradient-to-br from-blue-950 via-violet-950 to-slate-950 text-white">
          <Badge tone="green">Production coverage</Badge>
          <h2 className="mt-3 text-3xl font-black">Coverage score: {summary.coveragePercent}%</h2>
          <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-blue-100">
            {summary.demoReady} demo-ready experiences, {summary.published} published items, and {summary.missing} missing experiences mapped for future builds.
          </p>
        </Card>

        <div className="grid gap-5 md:grid-cols-2">
          {classRows.map((row) => (
            <Card key={row.classLevel} interactive className="bg-gradient-to-br from-white via-cyan-50 to-amber-50">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Badge tone="blue">Class {row.classLevel}</Badge>
                  <h2 className="mt-3 text-2xl font-black text-slate-950">{row.classLevel === "9" || row.classLevel === "10" ? "Science chemistry path" : "Chemistry path"}</h2>
                  <p className="mt-2 text-sm font-semibold text-slate-600">{row.items.length} priority roadmap items</p>
                </div>
                <Sparkles className="h-8 w-8 text-blue-700" aria-hidden="true" />
              </div>
              <div className="mt-5 space-y-2">
                {Array.from(new Set(row.items.map((item) => item.chapter))).slice(0, 5).map((chapter) => (
                  <div key={chapter} className="rounded-2xl bg-white/80 p-3 text-sm font-black text-slate-700 shadow-sm">
                    {chapter}
                  </div>
                ))}
              </div>
              <Button href={`/classes/${row.classLevel}`} className="mt-5" variant="secondary">
                Open class
              </Button>
            </Card>
          ))}
        </div>

        <section>
          <Badge tone="green">Demo-ready experiences</Badge>
          <h2 className="mt-3 text-3xl font-black text-slate-950">Strongest real product moments</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {liveItems.slice(0, 9).map((item) => (
              <a
                key={item.id}
                href={item.routeUrl}
                className="focus-ring rounded-[1.5rem] border border-white/70 bg-white/80 p-5 shadow-lg shadow-blue-100/40 transition hover:-translate-y-1"
              >
                <FlaskConical className="mb-3 h-6 w-6 text-blue-700" aria-hidden="true" />
                <span className="block text-lg font-black text-slate-950">{item.recommendedExperience}</span>
                <span className="mt-2 block text-sm font-semibold leading-6 text-slate-600">Class {item.classLevel} • {item.topic}</span>
              </a>
            ))}
          </div>
        </section>
      </Container>
    </>
  );
}
