import { BatteryCharging, Beaker, CheckCircle2, FlaskConical, MessageCircle, Sparkles, WandSparkles } from "lucide-react";
import Image from "next/image";
import type { LabCatalogEntry } from "@/data/labs/labCatalog";
import { getLabsByStatus } from "@/data/labs/labCatalog";
import { labSceneAssets } from "@/components/labs/labAssets";
import { MasterAlchemBubble } from "@/components/master-alchem/MasterAlchemBubble";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";

const featuredLabs = getLabsByStatus("featured");
const prototypeLabs = getLabsByStatus("prototype");
const comingSoon = getLabsByStatus("comingSoon");

export function StoryLabPreview() {
  return (
    <div className="space-y-6">
      <MasterAlchemBubble
        mood="celebrating"
        eyebrow="Story Lab Academy"
        message="Try Hydrocarbon Naming Quest. Trace carbon families, rank branches, and turn IUPAC names into a game."
        actionLabel="Open Hydrocarbon Naming Quest"
        actionHref="/labs/hydrocarbon-naming-quest"
      />

      <LabSection title="Featured Labs" labs={featuredLabs} />
      <Card className="bg-gradient-to-br from-amber-50 via-white to-cyan-50">
        <Badge tone="amber">Classroom Battles</Badge>
        <h2 className="mt-3 text-2xl font-black text-slate-950">Join a live quiz or practice publicly</h2>
        <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">
          Teachers can launch PIN-based rooms, while students can practice Redox and IUPAC quiz battles any time.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button href="/join" variant="secondary">Join with PIN</Button>
          <Button href="/public-quizzes">Open quiz battles</Button>
        </div>
      </Card>
      <LabSection
        title="Prototype Labs"
        description="These early labs are useful for practice, and we are improving them into richer experiments one by one."
        labs={prototypeLabs}
      />

      <Card className="bg-gradient-to-br from-white via-violet-50 to-blue-100">
        <Badge tone="slate">Coming Soon</Badge>
        <h2 className="mt-3 text-2xl font-black text-slate-950">Next labs to unlock</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {comingSoon.map((lab) => (
            <div key={lab.slug} className="rounded-3xl border border-white bg-white/75 p-4 text-sm font-black text-slate-700 shadow-sm">
              {lab.title}
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
  labs: LabCatalogEntry[];
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
                src={lab.thumbnailType === "acid-base" ? labSceneAssets.virtualLabBench : lab.thumbnailType === "practice" ? labSceneAssets.classroom : labSceneAssets.magicalLabBackground}
                alt=""
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
              <span className="absolute left-4 top-4 grid h-14 w-14 place-items-center rounded-3xl border-2 border-white bg-gradient-to-br from-cyan-400 to-blue-500 text-white shadow-lg">
                {getLabIcon(lab)}
              </span>
              <Badge tone="amber" className="absolute right-4 top-4">
                {lab.status === "featured" ? "Featured" : lab.status === "prototype" ? "Prototype" : "Coming soon"}
              </Badge>
            </div>
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-300/35 blur-2xl" />
            <div className="relative p-5">
              <h3 className="text-2xl font-black text-slate-950">{lab.title}</h3>
              <p className="mt-3 text-sm font-semibold leading-6 text-slate-700">
                {lab.description}
              </p>
              <div className="mt-5">
                <Progress value={lab.status === "featured" ? 100 : lab.status === "prototype" ? 45 : 0} label="Lab readiness" />
              </div>
              <div className="mt-5 space-y-2">
                {lab.concepts.slice(0, 4).map((concept) => (
                  <div key={concept} className="flex items-center gap-2 rounded-2xl bg-white/75 px-3 py-2 text-sm font-bold text-slate-700 shadow-sm">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                    {concept}
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-1 rounded-full bg-lime-100 px-3 py-1 text-xs font-black text-lime-800">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  +{lab.xp} XP
                </span>
                <Button href={lab.route} size="sm" variant="ghost" icon={<Beaker className="h-4 w-4" aria-hidden="true" />}>
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

function getLabIcon(lab: LabCatalogEntry) {
  if (lab.thumbnailType === "electrochem") return <BatteryCharging className="h-7 w-7" aria-hidden="true" />;
  if (lab.thumbnailType === "future") return <WandSparkles className="h-7 w-7" aria-hidden="true" />;
  return <FlaskConical className="h-7 w-7" aria-hidden="true" />;
}
