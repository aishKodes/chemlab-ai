import { ArrowRight, Atom, BrainCircuit, FlaskConical, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { HeroLabScene } from "@/components/marketing/HeroLabScene";

export function Hero() {
  return (
    <section className="relative min-h-[82vh] overflow-hidden border-b border-white/10">
      <HeroLabScene />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,7,19,0.94)_0%,rgba(5,7,19,0.72)_48%,rgba(5,7,19,0.42)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />

      <Container className="relative flex min-h-[82vh] flex-col justify-center py-20">
        <Reveal>
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-lg border border-cyan-200/20 bg-cyan-300/10 px-3 py-2 text-sm font-semibold text-cyan-100 backdrop-blur">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Chemistry-first learning lab
            </div>
            <h1 className="chem-gradient-text mt-7 text-5xl font-semibold leading-[1.05] sm:text-6xl lg:text-7xl">
              See chemistry. Simulate chemistry. Master chemistry.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
              ChemLab AI is an interactive learning lab where students explore
              atoms, reactions, molecules, quizzes, and an AI tutor built for
              deep understanding.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                href="/simulations"
                size="lg"
                icon={<FlaskConical className="h-5 w-5" aria-hidden="true" />}
              >
                Launch simulations
              </Button>
              <Button
                href="/ai-tutor"
                size="lg"
                variant="secondary"
                icon={<BrainCircuit className="h-5 w-5" aria-hidden="true" />}
              >
                Ask AI tutor
              </Button>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.12} className="mt-12 grid gap-3 sm:grid-cols-3 lg:max-w-4xl">
          {[
            ["Atomic Builder", "Carbon-12 neutral atom", <Atom key="atom" className="h-5 w-5" aria-hidden="true" />],
            ["Equation checker", "2H2 + O2 -> 2H2O", <FlaskConical key="flask" className="h-5 w-5" aria-hidden="true" />],
            ["Mastery signal", "72% atomic structure", <ArrowRight key="arrow" className="h-5 w-5" aria-hidden="true" />],
          ].map(([label, value, icon]) => (
            <div
              key={String(label)}
              className="rounded-lg border border-white/12 bg-white/[0.07] p-4 backdrop-blur"
            >
              <div className="flex items-center gap-2 text-cyan-100">{icon}</div>
              <p className="mt-3 text-sm text-slate-400">{label}</p>
              <p className="mt-1 font-semibold text-white">{value}</p>
            </div>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
