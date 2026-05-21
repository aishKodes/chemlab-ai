import { Beaker, CheckCircle2, FlaskConical, MessageCircle, Sparkles, WandSparkles } from "lucide-react";
import Image from "next/image";
import { labSceneAssets } from "@/components/labs/labAssets";
import { MasterAlchemBubble } from "@/components/master-alchem/MasterAlchemBubble";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";

const featuredLabs = [
  {
    title: "Cinematic Lab Shell",
    status: "Phase 1 demo",
    progress: 100,
    scenes: ["story intro", "lab stage", "challenge check", "reward loop"],
    reward: "+80 XP",
    href: "/labs/demo-cinematic-shell",
    image: labSceneAssets.magicalLabBackground,
    icon: <WandSparkles className="h-7 w-7" aria-hidden="true" />,
  },
  {
    title: "Neutralization Studio",
    status: "Featured prototype",
    progress: 62,
    scenes: ["acid added", "indicator clue", "base added", "salt reveal"],
    reward: "+160 XP",
    href: "/labs/neutralization-studio",
    image: labSceneAssets.virtualLabBench,
    icon: <FlaskConical className="h-7 w-7" aria-hidden="true" />,
  },
];

const prototypeLabs = [
  {
    title: "Cinematic Salt Lab",
    status: "Prototype",
    progress: 35,
    scenes: ["safe mixing", "pH clue", "evaporation", "salt crystal reveal"],
    reward: "+120 XP",
    href: "/labs/cinematic-salt-lab",
    image: labSceneAssets.magicalLabBackground,
    icon: <FlaskConical className="h-7 w-7" aria-hidden="true" />,
  },
  {
    title: "Reaction Rescue: Balance the Lab Door",
    status: "Practice",
    progress: 15,
    scenes: ["locked lab", "atom inventory", "coefficient puzzle", "conservation reveal", "escape quiz"],
    reward: "+180 XP",
    href: "/simulations/equation-balancer",
    image: labSceneAssets.classroom,
    icon: <FlaskConical className="h-7 w-7" aria-hidden="true" />,
  },
];

const comingSoon = [
  "Daniell Cell Studio",
  "Acid-Base Titration Studio",
  "Qualitative Analysis Quest",
];

export function StoryLabPreview() {
  return (
    <div className="space-y-6">
      <MasterAlchemBubble
        mood="celebrating"
        eyebrow="Story Lab Academy"
        message="A story lab is not just a worksheet. You enter a scene, make predictions, take lab actions, collect evidence, and explain what happened like a scientist."
        actionLabel="Open the shell demo"
        actionHref="/labs/demo-cinematic-shell"
      />

      <LabSection title="Featured Labs" labs={featuredLabs} />
      <LabSection
        title="Prototype Labs"
        description="These early labs are useful for practice, and we are improving them into richer experiments one by one."
        labs={prototypeLabs}
      />

      <Card className="bg-gradient-to-br from-white via-violet-50 to-blue-100">
        <Badge tone="slate">Coming Soon</Badge>
        <h2 className="mt-3 text-2xl font-black text-slate-950">Next labs to build in Phase 2</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {comingSoon.map((lab) => (
            <div key={lab} className="rounded-3xl border border-white bg-white/75 p-4 text-sm font-black text-slate-700 shadow-sm">
              {lab}
            </div>
          ))}
        </div>
      </Card>

      <Card className="bg-gradient-to-br from-violet-100 via-white to-blue-100">
        <div className="grid gap-5 md:grid-cols-[auto_1fr_auto] md:items-center">
          <span className="grid h-16 w-16 place-items-center rounded-[1.4rem] bg-white text-violet-600 shadow-lg">
            <MessageCircle className="h-8 w-8" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-2xl font-black text-slate-950">How story labs feel</h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">
              Every practical begins with a mystery, gives you safe choices, shows evidence, then asks you to explain what happened.
            </p>
          </div>
          <Button href="/learn/chemistry" variant="secondary">
            Choose a world
          </Button>
        </div>
      </Card>
    </div>
  );
}

function LabSection({
  title,
  description,
  labs,
}: {
  title: string;
  description?: string;
  labs: typeof featuredLabs;
}) {
  return (
    <section aria-labelledby={title.toLowerCase().replaceAll(" ", "-")}>
      <div className="mb-4">
        <Badge tone={title.includes("Prototype") ? "amber" : "green"}>{title}</Badge>
        {description ? <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-slate-700">{description}</p> : null}
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        {labs.map((lab) => (
          <Card key={lab.title} className="relative overflow-hidden bg-gradient-to-br from-white via-cyan-50 to-amber-50 p-0">
            <div className="relative h-44 overflow-hidden">
              <Image
                src={lab.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
              <span className="absolute left-4 top-4 grid h-14 w-14 place-items-center rounded-3xl border-2 border-white bg-gradient-to-br from-cyan-400 to-blue-500 text-white shadow-lg">
                {lab.icon}
              </span>
              <Badge tone="amber" className="absolute right-4 top-4">
                {lab.status}
              </Badge>
            </div>
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-300/35 blur-2xl" />
            <div className="relative p-5">
              <h3 className="text-2xl font-black text-slate-950">{lab.title}</h3>
              <p className="mt-3 text-sm font-semibold leading-6 text-slate-700">
                Guided practical with dialogue, lab actions, visible evidence, a success scene, and a short boss check.
              </p>
              <div className="mt-5">
                <Progress value={lab.progress} label="Build depth" />
              </div>
              <div className="mt-5 space-y-2">
                {lab.scenes.map((scene) => (
                  <div key={scene} className="flex items-center gap-2 rounded-2xl bg-white/75 px-3 py-2 text-sm font-bold text-slate-700 shadow-sm">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                    {scene}
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-1 rounded-full bg-lime-100 px-3 py-1 text-xs font-black text-lime-800">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  {lab.reward}
                </span>
                <Button href={lab.href} size="sm" variant="ghost" icon={<Beaker className="h-4 w-4" aria-hidden="true" />}>
                  Open
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
