import type { Metadata } from "next";
import { ArrowUpRight, Target } from "lucide-react";
import { ncertChemistryRoadmap } from "@/data/roadmaps/ncert-chemistry-roadmap";
import { getBuildNextRecommendations, getRoadmapSummary } from "@/lib/content-factory/resourceRoadmapScorer";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Admin Roadmap",
  description: "chemlearning admin roadmap for Class 9-12 chemistry content production.",
};

export default function AdminRoadmapPage() {
  const summary = getRoadmapSummary(ncertChemistryRoadmap);
  const buildNext = getBuildNextRecommendations(ncertChemistryRoadmap, 10);
  const byClass = ["9", "10", "11", "12"].map((classLevel) => ({
    classLevel,
    items: ncertChemistryRoadmap.filter((item) => item.classLevel === classLevel),
  }));

  return (
    <div className="space-y-6 pb-16">
      <section className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-xl shadow-blue-100/40">
        <Badge tone="blue">Class 9-12 roadmap</Badge>
        <h1 className="mt-3 text-3xl font-black text-slate-950">Chemistry production command map</h1>
        <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-600">
          See coverage, missing simulations, high-wow chapters, quick wins, and open-resource candidates in one place.
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-5">
          <Metric label="Total items" value={summary.total} />
          <Metric label="Coverage" value={`${summary.coveragePercent}%`} />
          <Metric label="Demo ready" value={summary.demoReady} />
          <Metric label="Published" value={summary.published} />
          <Metric label="Missing" value={summary.missing} />
        </div>
      </section>

      <Card className="bg-gradient-to-br from-amber-50 via-white to-cyan-50">
        <div className="flex items-center gap-3">
          <Target className="h-6 w-6 text-blue-700" aria-hidden="true" />
          <div>
            <Badge tone="amber">Build next</Badge>
            <h2 className="mt-2 text-2xl font-black text-slate-950">Highest-impact next recommendations</h2>
          </div>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {buildNext.map((item) => (
            <RoadmapCard key={item.id} item={item} />
          ))}
        </div>
      </Card>

      {byClass.map(({ classLevel, items }) => (
        <section key={classLevel}>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <Badge tone="green">Class {classLevel}</Badge>
              <h2 className="mt-2 text-2xl font-black text-slate-950">{classLevel === "9" || classLevel === "10" ? "Science chemistry chapters" : "Chemistry chapters"}</h2>
            </div>
            <Button href={`/classes/${classLevel}`} variant="secondary">Open class page</Button>
          </div>
          <div className="mt-4 grid gap-4 xl:grid-cols-2">
            {items.map((item) => (
              <RoadmapCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-2xl bg-white/80 p-4">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-black text-blue-900">{value}</p>
    </div>
  );
}

function RoadmapCard({ item }: { item: (typeof ncertChemistryRoadmap)[number] }) {
  return (
    <Card className="bg-white/85">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Badge tone={item.status === "demo_ready" || item.status === "published" ? "green" : item.status === "missing" ? "rose" : "amber"}>
            {item.status.replaceAll("_", " ")}
          </Badge>
          <h3 className="mt-3 text-xl font-black text-slate-950">{item.topic}</h3>
          <p className="mt-1 text-sm font-bold text-slate-500">Class {item.classLevel} • {item.chapter}</p>
        </div>
        <Badge tone={item.wowPotential === "flagship" ? "blue" : "slate"}>{item.wowPotential}</Badge>
      </div>
      <p className="mt-3 text-sm font-semibold leading-6 text-slate-700">{item.recommendedExperience}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Badge tone="cyan">{item.buildApproach.replaceAll("_", " ")}</Badge>
        <Badge tone="slate">effort {item.estimatedBuildEffort}</Badge>
        <Badge tone="slate">risk {item.accuracyRisk}</Badge>
      </div>
      {item.routeUrl ? (
        <Button href={item.routeUrl} className="mt-4" size="sm" variant="secondary" icon={<ArrowUpRight className="h-4 w-4" aria-hidden="true" />}>
          Open experience
        </Button>
      ) : null}
    </Card>
  );
}
