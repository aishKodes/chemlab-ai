import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, BrainCircuit, CheckCircle2, FlaskConical, Wrench } from "lucide-react";
import Link from "next/link";
import { chemistryModules, getModuleBySlug, simulations } from "@/data/chemistry-modules";
import { tools } from "@/components/chemistry/ToolCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";

type PageProps = {
  params: Promise<{ chapterSlug: string }>;
};

export function generateStaticParams() {
  return chemistryModules.map((module) => ({ chapterSlug: module.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { chapterSlug } = await params;
  const chemistryModule = getModuleBySlug(chapterSlug);
  return {
    title: chemistryModule ? chemistryModule.title : "Chemistry Module",
    description: chemistryModule?.summary ?? "ChemLab AI chemistry module.",
  };
}

export default async function ChapterPage({ params }: PageProps) {
  const { chapterSlug } = await params;
  const chemistryModule = getModuleBySlug(chapterSlug);

  if (!chemistryModule) notFound();

  const relatedSimulations = simulations.filter((simulation) =>
    chemistryModule.simulations.includes(simulation.slug),
  );
  const relatedTools = tools.filter((tool) => chemistryModule.tools.includes(tool.slug));

  return (
    <>
      <PageHeader
        eyebrow={chemistryModule.difficulty}
        title={chemistryModule.title}
        description={chemistryModule.summary}
      />
      <Container className="pb-16">
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="space-y-6">
            <Card>
              <h2 className="text-xl font-semibold text-white">Learning outcomes</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {chemistryModule.learningOutcomes.map((outcome) => (
                  <li key={outcome} className="flex gap-3 text-sm leading-6 text-slate-300">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" aria-hidden="true" />
                    {outcome}
                  </li>
                ))}
              </ul>
            </Card>

            <Card>
              <h2 className="text-xl font-semibold text-white">Visual notes</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {chemistryModule.visualNotes.map((note) => (
                  <div key={note} className="rounded-lg border border-white/10 bg-white/[0.05] p-4 text-sm leading-6 text-slate-300">
                    {note}
                  </div>
                ))}
              </div>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <div className="flex items-center gap-3">
                  <FlaskConical className="h-5 w-5 text-cyan-200" aria-hidden="true" />
                  <h2 className="text-xl font-semibold text-white">Related simulations</h2>
                </div>
                <div className="mt-4 space-y-3">
                  {relatedSimulations.map((simulation) => (
                    <Link
                      key={simulation.slug}
                      href={`/simulations/${simulation.slug}`}
                      className="focus-ring flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.04] p-3 text-sm text-slate-200 transition hover:bg-white/[0.08]"
                    >
                      {simulation.title}
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  ))}
                </div>
              </Card>

              <Card>
                <div className="flex items-center gap-3">
                  <Wrench className="h-5 w-5 text-blue-200" aria-hidden="true" />
                  <h2 className="text-xl font-semibold text-white">Related tools</h2>
                </div>
                <div className="mt-4 space-y-3">
                  {relatedTools.map((tool) => (
                    <Link
                      key={tool.slug}
                      href={`/tools/${tool.slug}`}
                      className="focus-ring flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.04] p-3 text-sm text-slate-200 transition hover:bg-white/[0.08]"
                    >
                      {tool.title}
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          <aside className="space-y-5">
            <Card className="glass-panel-strong">
              <Badge tone="cyan">{chemistryModule.estimatedMinutes} minutes</Badge>
              <h2 className="mt-4 text-xl font-semibold text-white">Prerequisites</h2>
              <ul className="mt-4 space-y-2 text-sm text-slate-300">
                {chemistryModule.prerequisites.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Card>
            <Card>
              <h2 className="text-xl font-semibold text-white">AI tutor CTA</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Ask the tutor to explain this chapter using visual reasoning,
                hints, or exam-mode answer structure.
              </p>
              <Button
                href="/ai-tutor"
                className="mt-5 w-full"
                icon={<BrainCircuit className="h-4 w-4" aria-hidden="true" />}
              >
                Ask about {chemistryModule.title}
              </Button>
            </Card>
            <Card>
              <h2 className="text-xl font-semibold text-white">Related quiz</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Test whether the concepts can survive application, not just recognition.
              </p>
              <Button href={`/quiz/${chemistryModule.quizSlug}`} variant="secondary" className="mt-5 w-full">
                Start quiz
              </Button>
            </Card>
          </aside>
        </div>
      </Container>
    </>
  );
}
