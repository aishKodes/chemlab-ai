import { FlaskConical, Map, MessageCircle, Rocket } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ColourfulGradientBlob } from "@/components/ui/ColourfulGradientBlob";
import { Container } from "@/components/ui/Container";
import { FloatingMoleculeBackground } from "@/components/ui/FloatingMoleculeBackground";
import { Reveal } from "@/components/ui/Reveal";
import { HeroUniversePanel } from "@/components/marketing/HeroUniversePanel";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
      <FloatingMoleculeBackground />
      <ColourfulGradientBlob tone="blue" className="-left-20 top-8 h-72 w-72" />
      <ColourfulGradientBlob tone="pink" className="-right-16 top-20 h-80 w-80" />
      <Container className="relative">
        <div className="grid items-center gap-10 lg:grid-cols-[0.92fr_1.08fr]">
          <Reveal>
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border-2 border-white bg-white/80 px-4 py-2 text-sm font-black text-blue-700 shadow-lg">
                <Rocket className="h-4 w-4" aria-hidden="true" />
                chemlearning
              </div>
              <h1 className="chem-gradient-text mt-7 text-6xl font-black leading-[0.95] sm:text-7xl lg:text-8xl">
                Chemistry, brought to life.
              </h1>
              <p className="mt-6 max-w-2xl text-xl font-semibold leading-9 text-slate-700">
                Enter the world where chemistry becomes visible, playable, and
                unforgettable. Build atoms, run cinematic labs, battle misconceptions,
                and learn with Chem-Shastri step by step.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button href="/learn/chemistry" size="lg" icon={<Map className="h-5 w-5" aria-hidden="true" />}>
                  Start Learning
                </Button>
                <Button
                  href="/labs"
                  size="lg"
                  variant="secondary"
                  icon={<FlaskConical className="h-5 w-5" aria-hidden="true" />}
                >
                  Enter the Lab
                </Button>
                <Button
                  href="/ai-tutor"
                  size="lg"
                  variant="ghost"
                  icon={<MessageCircle className="h-5 w-5" aria-hidden="true" />}
                >
                  Meet Chem-Shastri
                </Button>
              </div>
              <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
                {[
                  ["Worlds", "7 chemistry quests"],
                  ["XP", "+740 earned"],
                  ["Mistakes", "3 monsters left"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-3xl border-2 border-white bg-white/75 p-4 shadow-lg"
                  >
                    <p className="text-xs font-black uppercase text-blue-600">{label}</p>
                    <p className="mt-1 text-lg font-black text-slate-950">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <HeroUniversePanel />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
