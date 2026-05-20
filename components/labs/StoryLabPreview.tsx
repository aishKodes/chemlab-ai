import { Beaker, CheckCircle2, FlaskConical, MessageCircle, Sparkles } from "lucide-react";
import Image from "next/image";
import { labSceneAssets } from "@/components/labs/labAssets";
import { MasterAlchemBubble } from "@/components/master-alchem/MasterAlchemBubble";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";

const storyLabs = [
  {
    title: "Acid-Base Titration: The Color Shift",
    status: "Featured",
    progress: 45,
    scenes: ["briefing", "indicator choice", "drop-by-drop titration", "endpoint evidence", "boss check"],
    reward: "+220 XP",
    href: "/labs/neutralization-studio",
    image: labSceneAssets.virtualLabBench,
  },
  {
    title: "Salt Quest: Identify the Hidden Ion",
    status: "Next quest",
    progress: 25,
    scenes: ["mystery sample", "flame clue", "precipitate test", "evidence board", "final claim"],
    reward: "+260 XP",
    href: "/labs/neutralization-studio",
    image: labSceneAssets.magicalLabBackground,
  },
  {
    title: "Reaction Rescue: Balance the Lab Door",
    status: "Practice",
    progress: 15,
    scenes: ["locked lab", "atom inventory", "coefficient puzzle", "conservation reveal", "escape quiz"],
    reward: "+180 XP",
    href: "/simulations/equation-balancer",
    image: labSceneAssets.classroom,
  },
];

export function StoryLabPreview() {
  return (
    <div className="space-y-6">
      <MasterAlchemBubble
        mood="excited"
        eyebrow="Story Lab Academy"
        message="A story lab is not just a worksheet. You enter a scene, make predictions, take lab actions, collect evidence, and explain what happened like a scientist."
        actionLabel="Ask for lab guidance"
        actionHref="/ai-tutor"
      />

      <div className="grid gap-5 lg:grid-cols-3">
        {storyLabs.map((lab) => (
          <Card key={lab.title} className="relative overflow-hidden bg-gradient-to-br from-white via-cyan-50 to-amber-50 p-0">
            <div className="relative h-44 overflow-hidden">
              <Image
                src={lab.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 33vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
              <span className="absolute left-4 top-4 grid h-14 w-14 place-items-center rounded-3xl border-2 border-white bg-gradient-to-br from-cyan-400 to-blue-500 text-white shadow-lg">
                <FlaskConical className="h-7 w-7" aria-hidden="true" />
              </span>
              <Badge tone="amber" className="absolute right-4 top-4">
                {lab.status}
              </Badge>
            </div>
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-300/35 blur-2xl" />
            <div className="relative p-5">
              <h2 className="text-2xl font-black text-slate-950">{lab.title}</h2>
              <p className="mt-3 text-sm font-semibold leading-6 text-slate-700">
                Cinematic practical with dialogue, lab actions, reaction logic, success scene, and a short quiz scene.
              </p>
              <div className="mt-5">
                <Progress value={lab.progress} label="Prototype depth" />
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
