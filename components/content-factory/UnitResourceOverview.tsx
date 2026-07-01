import { FlaskConical, Layers3, Map, Sparkles } from "lucide-react";
import { class11SomeBasicConceptsContentPack } from "@/data/content-packs/class-11/some-basic-concepts-of-chemistry";
import { buildCoverageRows, getChapterResourceSummary } from "@/lib/content-factory/contentPackBuilder";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function UnitResourceOverview() {
  const summary = getChapterResourceSummary(class11SomeBasicConceptsContentPack);
  const rows = buildCoverageRows(class11SomeBasicConceptsContentPack);
  const blueprint = class11SomeBasicConceptsContentPack.blueprint;
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-blue-950 via-violet-950 to-slate-950 text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Badge tone="blue">Class 11 Unit 1</Badge>
            <h2 className="mt-4 text-3xl font-black">Build the base layer of chemistry.</h2>
            <p className="mt-3 max-w-3xl text-sm font-semibold leading-6 text-blue-100">
              This pack turns Some Basic Concepts of Chemistry into explanation cards, memory cards, quick drills, a concept map, teacher quizzes, and the Chemistry Scale Universe lab.
            </p>
          </div>
          <div className="rounded-[1.6rem] bg-white/10 p-4 text-center">
            <p className="text-4xl font-black">{summary.coverageScore}%</p>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-cyan-100">factory coverage</p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href="/labs/basic-concepts-chemistry-universe" icon={<FlaskConical className="h-4 w-4" aria-hidden="true" />}>
            Open Chemistry Scale Universe
          </Button>
          <Button href="/ai-tutor?prompt=Guide%20me%20through%20Class%2011%20Unit%201%20Some%20Basic%20Concepts%20of%20Chemistry" variant="secondary" icon={<Sparkles className="h-4 w-4" aria-hidden="true" />}>
            Ask Chem-Shastri
          </Button>
        </div>
      </Card>

      <div className="grid gap-5 md:grid-cols-3">
        <Card>
          <Layers3 className="h-6 w-6 text-blue-700" aria-hidden="true" />
          <h3 className="mt-3 text-xl font-black text-slate-950">Topics</h3>
          <p className="mt-2 text-sm font-semibold text-slate-600">{summary.topics} topic nodes, each with cards, drills, mistakes, and Chem-Shastri notes.</p>
        </Card>
        <Card>
          <Map className="h-6 w-6 text-violet-700" aria-hidden="true" />
          <h3 className="mt-3 text-xl font-black text-slate-950">Concept map</h3>
          <p className="mt-2 text-sm font-semibold text-slate-600">One Unit 1 map connects matter, units, moles, formulas, and stoichiometry.</p>
        </Card>
        <Card>
          <Sparkles className="h-6 w-6 text-amber-700" aria-hidden="true" />
          <h3 className="mt-3 text-xl font-black text-slate-950">Review status</h3>
          <p className="mt-2 text-sm font-semibold text-slate-600">All seeded content is original, NCERT-aligned, and marked needs_review for teacher/admin approval.</p>
        </Card>
      </div>

      <Card>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <Badge tone="green">Topic coverage</Badge>
            <h3 className="mt-3 text-2xl font-black text-slate-950">What is inside this pack</h3>
          </div>
          <span className="rounded-2xl bg-slate-100 px-3 py-2 text-xs font-black text-slate-700">{summary.memoryCards} cards / {summary.quickDrills} drill questions</span>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {rows.map((row) => (
            <div key={row.topicSlug} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <h4 className="text-sm font-black text-slate-950">{row.topicTitle}</h4>
                <span className="rounded-full bg-white px-2 py-1 text-xs font-black text-blue-800">{row.coverageScore}%</span>
              </div>
              <p className="mt-2 text-xs font-bold leading-5 text-slate-600">
                {row.memoryCardCount} memory cards, {row.quickDrillCount} drills, {row.mistakePatternCount} mistake patterns.
              </p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="bg-gradient-to-br from-white via-amber-50 to-cyan-50">
        <Badge tone="amber">Teacher quiz packs</Badge>
        <h3 className="mt-3 text-2xl font-black text-slate-950">Ready for teacher review</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {blueprint.quizPlan
            .filter((quiz) => quiz.audience === "teacher")
            .map((quiz) => (
              <div key={quiz.slug} className="rounded-2xl bg-white/80 p-4 text-sm font-bold text-slate-700 shadow-sm">
                <p className="font-black text-slate-950">{quiz.title}</p>
                <p className="mt-1">{quiz.minimumQuestions}+ questions planned from Unit 1 drills.</p>
              </div>
            ))}
        </div>
      </Card>
    </div>
  );
}
