import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, FlaskConical, Wrench } from "lucide-react";
import Link from "next/link";
import { chemistryModules, getModuleBySlug, simulations } from "@/data/chemistry-modules";
import { tools } from "@/components/chemistry/ToolCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { MasterAlchemBubble } from "@/components/master-alchem/MasterAlchemBubble";
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
    description: chemistryModule?.summary ?? "Chemlab chemistry module.",
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
              <h2 className="text-xl font-black text-slate-950">Learning outcomes</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {chemistryModule.learningOutcomes.map((outcome) => (
                  <li key={outcome} className="flex gap-3 text-sm font-medium leading-6 text-slate-600">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" aria-hidden="true" />
                    {outcome}
                  </li>
                ))}
              </ul>
            </Card>

            <Card>
              <h2 className="text-xl font-black text-slate-950">Visual notes</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {chemistryModule.visualNotes.map((note) => (
                  <div key={note} className="rounded-3xl border border-blue-100 bg-white/75 p-4 text-sm font-medium leading-6 text-slate-600 shadow-sm">
                    {note}
                  </div>
                ))}
              </div>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <div className="flex items-center gap-3">
                  <FlaskConical className="h-5 w-5 text-cyan-200" aria-hidden="true" />
                  <h2 className="text-xl font-black text-slate-950">Related simulations</h2>
                </div>
                <div className="mt-4 space-y-3">
                  {relatedSimulations.map((simulation) => (
                    <Link
                      key={simulation.slug}
                      href={`/simulations/${simulation.slug}`}
                      className="focus-ring flex items-center justify-between rounded-2xl border border-blue-100 bg-white/75 p-3 text-sm font-bold text-slate-700 transition hover:-translate-y-0.5 hover:bg-white"
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
                  <h2 className="text-xl font-black text-slate-950">Related tools</h2>
                </div>
                <div className="mt-4 space-y-3">
                  {relatedTools.map((tool) => (
                    <Link
                      key={tool.slug}
                      href={`/tools/${tool.slug}`}
                      className="focus-ring flex items-center justify-between rounded-2xl border border-blue-100 bg-white/75 p-3 text-sm font-bold text-slate-700 transition hover:-translate-y-0.5 hover:bg-white"
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
              <h2 className="mt-4 text-xl font-black text-slate-950">Prerequisites</h2>
              <ul className="mt-4 space-y-2 text-sm font-medium text-slate-600">
                {chemistryModule.prerequisites.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Card>
            <MasterAlchemBubble
              compact
              mood="speaking"
              eyebrow="Master Alchem"
              message={`Ask me to explain ${chemistryModule.title} using visual reasoning, hints, exam structure, or lab guide mode.`}
              actionLabel={`Ask about ${chemistryModule.title}`}
              actionHref="/ai-tutor"
            />
            <Card>
              <h2 className="text-xl font-black text-slate-950">Boss battle</h2>
              <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
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
