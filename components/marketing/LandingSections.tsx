import {
  BarChart3,
  BookOpen,
  BrainCircuit,
  Calculator,
  ClipboardCheck,
  GraduationCap,
} from "lucide-react";
import { chemistryModules, simulations } from "@/data/chemistry-modules";
import { tools } from "@/components/chemistry/ToolCard";
import { ModuleCard } from "@/components/chemistry/ModuleCard";
import { SimulationCard } from "@/components/chemistry/SimulationCard";
import { ToolCard } from "@/components/chemistry/ToolCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function LandingSections() {
  return (
    <>
      <section className="py-14">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Interactive simulations"
              title="Particle-level models that make abstract chemistry inspectable."
              description="Start with focused simulations that explain what changes, what stays conserved, and how symbolic chemistry maps to atoms and molecules."
            />
          </Reveal>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {simulations.slice(0, 3).map((simulation, index) => (
              <Reveal key={simulation.slug} delay={index * 0.04}>
                <SimulationCard simulation={simulation} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-14">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <Reveal>
              <Card className="glass-panel-strong">
                <Badge tone="green">AI tutor</Badge>
                <h2 className="mt-4 text-3xl font-semibold leading-tight text-white">
                  A chemistry tutor that teaches reasoning before answers.
                </h2>
                <p className="mt-4 text-base leading-7 text-slate-300">
                  The server-side AI adapter supports mock, Gemini, and OpenAI-compatible
                  providers. Students can request hints, step-by-step work, quiz prompts,
                  answer checks, or exam-mode explanations.
                </p>
                <Button
                  href="/ai-tutor"
                  className="mt-6"
                  icon={<BrainCircuit className="h-4 w-4" aria-hidden="true" />}
                >
                  Open AI tutor
                </Button>
              </Card>
            </Reveal>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ["Known values", "Formula", "Substitution", "Final unit"],
                ["Analogy", "Scientific explanation", "Common mistake", "Next step"],
              ].map((items, index) => (
                <Reveal key={items.join("-")} delay={index * 0.06}>
                  <Card className="h-full">
                    <p className="text-sm font-semibold text-cyan-100">
                      {index === 0 ? "Numerical reasoning" : "Conceptual doubts"}
                    </p>
                    <ul className="mt-4 space-y-3 text-sm text-slate-300">
                      {items.map((item) => (
                        <li key={item} className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-cyan-200" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </Card>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-14">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Featured modules"
              title="A curriculum spine built around chemistry concepts, not generic course pages."
              description="Each chapter joins outcomes, prerequisites, visual notes, simulations, tools, quizzes, and AI tutor prompts."
            />
          </Reveal>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {chemistryModules.slice(0, 3).map((module, index) => (
              <Reveal key={module.slug} delay={index * 0.04}>
                <ModuleCard module={module} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-14">
        <Container>
          <div className="grid gap-4 lg:grid-cols-3">
            {[
              {
                title: "Chemistry tools",
                description:
                  "Molar mass, mole conversion, and atom-count checking help students audit every symbolic step.",
                icon: <Calculator className="h-6 w-6" aria-hidden="true" />,
              },
              {
                title: "Mastery quizzes",
                description:
                  "Local sample quizzes work immediately, with Supabase-backed attempts ready for authenticated users.",
                icon: <ClipboardCheck className="h-6 w-6" aria-hidden="true" />,
              },
              {
                title: "Student dashboard",
                description:
                  "Progress cards, mistake notebook previews, AI usage signals, and recommended next actions.",
                icon: <BarChart3 className="h-6 w-6" aria-hidden="true" />,
              },
            ].map((feature, index) => (
              <Reveal key={feature.title} delay={index * 0.05}>
                <FeatureCard {...feature} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-14">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Tools preview"
              title="Precise utilities for the calculations students repeat constantly."
              description="Every tool is designed to expose the method, not just output a number."
            />
          </Reveal>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {tools.map((tool, index) => (
              <Reveal key={tool.slug} delay={index * 0.04}>
                <ToolCard tool={tool} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-14">
        <Container>
          <Reveal>
            <Card className="glass-panel-strong overflow-hidden p-8 sm:p-10">
              <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr]">
                <div>
                  <Badge tone="blue">Academic mission</Badge>
                  <h2 className="mt-4 text-3xl font-semibold leading-tight text-white">
                    Build the habits of a careful chemist.
                  </h2>
                  <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
                    ChemLab AI treats simulations, explanations, quizzes, and
                    notes as one learning system. The aim is not to gamify away
                    rigor, but to make rigorous chemistry easier to see and practice.
                  </p>
                  <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                    <Button href="/learn/chemistry" icon={<BookOpen className="h-4 w-4" aria-hidden="true" />}>
                      Start learning
                    </Button>
                    <Button href="/about" variant="secondary" icon={<GraduationCap className="h-4 w-4" aria-hidden="true" />}>
                      Read mission
                    </Button>
                  </div>
                </div>
                <div className="grid content-center gap-3">
                  {[
                    ["Simulate", "Atoms, bonds, equations, and mole-scale quantities"],
                    ["Practice", "Quizzes with explanations and mistakes surfaced"],
                    ["Reflect", "Visual notes, progress, and AI tutor follow-up"],
                  ].map(([title, text]) => (
                    <div key={title} className="rounded-lg border border-white/10 bg-white/[0.05] p-4">
                      <p className="font-semibold text-white">{title}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-300">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
