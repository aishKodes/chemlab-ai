import {
  Atom,
  BatteryCharging,
  Beaker,
  BrainCircuit,
  CheckCircle2,
  Compass,
  Crown,
  Flame,
  Ghost,
  GraduationCap,
  MessageCircle,
  Microscope,
  Rocket,
  Shield,
  Trophy,
  WandSparkles,
  Waves,
} from "lucide-react";
import { BossBattleCard } from "@/components/gamification/BossBattleCard";
import { DailyQuestCard } from "@/components/gamification/DailyQuestCard";
import { LevelBadge } from "@/components/gamification/LevelBadge";
import { MistakeMonsterCard } from "@/components/gamification/MistakeMonsterCard";
import { QuestMap } from "@/components/gamification/QuestMap";
import { XpBar } from "@/components/gamification/XpBar";
import { MasterAlchemDock } from "@/components/master-alchem/MasterAlchemDock";
import { MasterAlchemPointer } from "@/components/master-alchem/MasterAlchemPointer";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Progress } from "@/components/ui/Progress";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const differentiators = [
  {
    title: "Cinematic chemistry worlds",
    description: "Concepts unfold as places to explore, not pages to memorize.",
    icon: <Compass className="h-6 w-6 text-blue-600" aria-hidden="true" />,
  },
  {
    title: "Chem-Shastri guidance",
    description: "Get a hint, try the next step, and recover when a question feels stuck.",
    icon: <WandSparkles className="h-6 w-6 text-violet-600" aria-hidden="true" />,
  },
  {
    title: "Touch-first simulations",
    description: "Students change variables and see atoms, charge, moles, and reactions respond.",
    icon: <Microscope className="h-6 w-6 text-cyan-600" aria-hidden="true" />,
  },
  {
    title: "Mastery loops",
    description: "Earn XP by understanding ideas, fixing mistakes, and beating chapter battles.",
    icon: <Trophy className="h-6 w-6 text-amber-600" aria-hidden="true" />,
  },
];

const storySteps = [
  ["Scene dialogue", "A practical begins with a mystery and Chem-Shastri's briefing."],
  ["Lab action", "Students choose variables, tools, observations, and predictions."],
  ["Evidence check", "Chemlab connects the visual result to the chemistry principle."],
  ["Boss moment", "A short challenge locks in the concept before the next scene."],
];

const featuredLabs = [
  {
    title: "Hydrocarbon Naming Quest",
    description: "Trace carbon families, rank branches, and serve the double-bond VIP.",
    href: "/labs/hydrocarbon-naming-quest",
    icon: <WandSparkles className="h-6 w-6 text-violet-700" aria-hidden="true" />,
  },
  {
    title: "Daniell Cell Studio",
    description: "Build a galvanic cell and watch a reaction become electricity.",
    href: "/labs/daniell-cell-studio",
    icon: <BatteryCharging className="h-6 w-6 text-cyan-700" aria-hidden="true" />,
  },
  {
    title: "Neutralization Studio",
    description: "Mix acid and base, find pH 7, then reveal salt crystals.",
    href: "/labs/neutralization-studio",
    icon: <Waves className="h-6 w-6 text-cyan-700" aria-hidden="true" />,
  },
  {
    title: "Molecule Explorer",
    description: "Rotate real 3D molecules and understand shape by seeing it.",
    href: "/simulations/molecule-explorer",
    icon: <Atom className="h-6 w-6 text-violet-700" aria-hidden="true" />,
  },
];

export function LandingSections() {
  return (
    <>
      <section className="py-12">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Why Chemlab is different"
              title="A learning universe you can actually explore."
              description="Pick a mission, make a prediction, test it in a virtual lab, and let Chem-Shastri help you understand what changed."
            />
          </Reveal>
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {differentiators.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.04}>
                <Card className="h-full bg-white/82">
                  <span className="grid h-14 w-14 place-items-center rounded-3xl bg-gradient-to-br from-white to-cyan-100 shadow-lg">
                    {item.icon}
                  </span>
                  <h3 className="mt-5 text-xl font-black text-slate-950">{item.title}</h3>
                  <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">{item.description}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Virtual Labs"
              title="Start with labs that feel alive."
              description="Predict, change something, watch the result, then explain what happened with Chem-Shastri beside you."
            />
          </Reveal>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {featuredLabs.map((lab, index) => (
              <Reveal key={lab.title} delay={index * 0.04}>
                <Card interactive className="h-full bg-gradient-to-br from-white via-cyan-50 to-lime-50">
                  <span className="grid h-14 w-14 place-items-center rounded-3xl border-2 border-white bg-white shadow-lg">
                    {lab.icon}
                  </span>
                  <h3 className="mt-5 text-2xl font-black text-slate-950">{lab.title}</h3>
                  <p className="mt-3 text-sm font-semibold leading-6 text-slate-700">{lab.description}</p>
                  <Button href={lab.href} className="mt-5" size="sm">
                    Open lab
                  </Button>
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <Reveal>
            <MasterAlchemDock
              mood="guide"
              title="Meet Chem-Shastri, your magical chemistry mentor."
              message="He explains without judgment, gives hints before answers, guides safe lab thinking, and celebrates the exact moment a concept clicks."
            />
          </Reveal>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Chemistry Worlds"
              title="Every chapter is a world. Every concept is alive."
              description="Choose a world, enter a mission, run a simulation, ask Chem-Shastri, fight a boss quiz, and unlock the next level."
            />
          </Reveal>
          <Reveal delay={0.08} className="mt-8">
            <QuestMap />
          </Reveal>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Battle Arena"
              title="Quizzes become boss battles students want to beat."
              description="Health bars, streaks, XP, badges, and explanations turn practice into a motivating mastery loop."
            />
          </Reveal>
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <BossBattleCard title="Atomic Identity Boss" chapter="Atom Island" hp={78} xp={180} href="/quiz/atomic-structure" />
            <BossBattleCard title="Valency Gatekeeper" chapter="Bonding Forest" hp={64} xp={220} href="/quiz/chemical-bonding" />
            <BossBattleCard title="Reaction Arena Champion" chapter="Reaction Arena" hp={86} xp={260} href="/quiz/chemical-reactions" />
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              ["Streak", "4 days glowing", <Flame key="flame" className="h-5 w-5 text-orange-500" />],
              ["Badges", "12 unlocked", <Trophy key="trophy" className="h-5 w-5 text-amber-500" />],
              ["Shield", "Hints used wisely", <Shield key="shield" className="h-5 w-5 text-blue-500" />],
            ].map(([label, value, icon]) => (
              <Card key={String(label)} className="bg-white/80">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white shadow">{icon}</span>
                  <div>
                    <p className="text-sm font-black text-slate-500">{label}</p>
                    <p className="text-lg font-black text-slate-950">{value}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Story Practicals"
              title="Labs become scenes with choices, evidence, and consequences."
              description="Each practical begins with a mystery, lets students act safely, then asks them to explain the evidence."
            />
          </Reveal>
          <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_1.1fr]">
            <Reveal>
              <MasterAlchemPointer
                mood="thinking"
                title="The Color Shift practical"
                message="Predict the endpoint, add reagent slowly, and explain why the indicator changed."
                href="/labs"
                cta="Open Story Labs"
              />
            </Reveal>
            <Reveal delay={0.08}>
              <Card className="bg-gradient-to-br from-white via-amber-50 to-cyan-100">
                <div className="grid gap-3 sm:grid-cols-2">
                  {storySteps.map(([title, description]) => (
                    <div key={title} className="rounded-3xl bg-white/75 p-4 shadow-sm">
                      <div className="flex items-center gap-2 text-sm font-black text-blue-700">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                        {title}
                      </div>
                      <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">{description}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Mistake Lab"
              title="Wrong answers become targeted review objects."
              description="Mistakes get names, weaknesses, retry prompts, and Chem-Shastri rescue guidance so students improve without shame."
            />
          </Reveal>
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <MistakeMonsterCard name="Mass Number Goblin" concept="Atomic structure" weakness="Protons + neutrons, not electrons." hp={35} tone="lime" icon={<Ghost className="h-10 w-10 text-lime-600" aria-hidden="true" />} />
            <MistakeMonsterCard name="Mole Ratio Phantom" concept="Mole concept" weakness="Convert grams to moles before coefficients." hp={52} tone="cyan" icon={<BrainCircuit className="h-10 w-10 text-cyan-600" aria-hidden="true" />} />
            <MistakeMonsterCard name="Valency Dragon" concept="Chemical bonding" weakness="Total ionic charge must be zero." hp={68} tone="coral" icon={<Flame className="h-10 w-10 text-orange-600" aria-hidden="true" />} />
            <MistakeMonsterCard name="Equilibrium Trickster" concept="Future world" weakness="Track stress and shift direction." hp={80} tone="violet" icon={<Crown className="h-10 w-10 text-violet-600" aria-hidden="true" />} />
          </div>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <Reveal>
              <DailyQuestCard />
            </Reveal>
            <Reveal delay={0.08}>
              <Card className="bg-gradient-to-br from-white via-sky-50 to-violet-100">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <Badge tone="blue">Progress and mastery</Badge>
                    <h2 className="mt-4 text-3xl font-black text-slate-950">Progress Galaxy</h2>
                    <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-slate-700">
                      Daily quest, XP, streak, chapter mastery, labs completed, mistake objects,
                      and Chem-Shastri activity all live in one cheerful command center.
                    </p>
                  </div>
                  <LevelBadge level={4} title="Reaction Rookie" />
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <XpBar xp={740} nextLevelXp={1000} />
                  <div className="rounded-[1.5rem] bg-white/80 p-4 shadow">
                    <div className="flex items-center gap-3">
                      <MessageCircle className="h-7 w-7 text-violet-600" aria-hidden="true" />
                      <div>
                        <p className="text-sm font-black text-slate-500">Chem-Shastri activity</p>
                        <p className="text-2xl font-black text-slate-950">18 hints</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  <Progress value={72} label="Atom Island" />
                  <Progress value={58} label="Periodic Kingdom" />
                  <Progress value={41} label="Bonding Forest" />
                </div>
              </Card>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <Reveal>
            <Card className="relative overflow-hidden bg-gradient-to-br from-violet-100 via-white to-cyan-100 p-8 sm:p-10">
              <div className="absolute -right-12 -top-16 h-44 w-44 rounded-full bg-cyan-300/50 blur-3xl" />
              <div className="relative grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
                <div>
                  <Badge tone="cyan">Future of learning</Badge>
                  <h2 className="mt-5 text-4xl font-black text-slate-950">
                    Chemlab grows with every quest students unlock.
                  </h2>
                  <p className="mt-4 max-w-2xl text-base font-semibold leading-7 text-slate-700">
                    More worlds, practicals, teacher-guided missions, and challenge paths are coming.
                    The goal stays simple: make chemistry feel visible, safe, joyful, and serious.
                  </p>
                </div>
                <div className="grid gap-3">
                  {[
                    ["Personal quest paths", <Rocket key="rocket" className="h-5 w-5 text-blue-600" />],
                    ["Teacher-guided missions", <GraduationCap key="grad" className="h-5 w-5 text-emerald-600" />],
                    ["More cinematic labs", <Beaker key="beaker" className="h-5 w-5 text-violet-600" />],
                  ].map(([label, icon]) => (
                    <div key={String(label)} className="flex items-center gap-3 rounded-3xl bg-white/75 p-4 font-black text-slate-800 shadow-sm">
                      {icon}
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </Reveal>
        </Container>
      </section>

      <section className="py-14">
        <Container>
          <Reveal>
            <Card className="space-lab relative overflow-hidden p-8 text-white sm:p-10">
              <div className="absolute right-8 top-8 h-28 w-28 rounded-full bg-white/20 blur-2xl" />
              <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-black">
                    <Atom className="h-4 w-4" aria-hidden="true" />
                    Ready to enter Chemlab?
                  </div>
                  <h2 className="mt-5 text-4xl font-black text-white">
                    Start a quest. Meet Chem-Shastri. Make chemistry visible.
                  </h2>
                  <p className="mt-4 max-w-2xl text-base font-semibold leading-7 text-blue-50">
                    Chemlab turns chemistry into a colourful interactive world where students learn by
                    playing, simulating, experimenting, explaining, and trying again.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                  <Button href="/learn/chemistry" variant="secondary">
                    Start Learning
                  </Button>
                  <Button href="/ai-tutor" variant="secondary">
                    Meet Chem-Shastri
                  </Button>
                </div>
              </div>
            </Card>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
