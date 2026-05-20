import type { ReactNode } from "react";
import { ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const monsterGradients = {
  coral: "from-rose-100 via-orange-100 to-amber-100",
  violet: "from-violet-100 via-fuchsia-100 to-pink-100",
  cyan: "from-cyan-100 via-sky-100 to-blue-100",
  lime: "from-lime-100 via-emerald-100 to-teal-100",
};

type MonsterTone = keyof typeof monsterGradients;

export function MistakeMonsterCard({
  name,
  concept,
  weakness,
  hp,
  icon,
  tone = "violet",
}: {
  name: string;
  concept: string;
  weakness: string;
  hp: number;
  icon?: ReactNode;
  tone?: MonsterTone;
}) {
  return (
    <Card
      interactive
      className={`relative overflow-hidden bg-gradient-to-br ${monsterGradients[tone]}`}
    >
      <div className="absolute right-4 top-4 rounded-full bg-white/75 px-3 py-1 text-xs font-black text-rose-700">
        HP {hp}
      </div>
      <div className="grid h-20 w-20 place-items-center rounded-[1.6rem] border-4 border-white bg-gradient-to-br from-white to-yellow-100 text-4xl shadow-lg">
        {icon ?? <Sparkles className="h-10 w-10 text-fuchsia-500" aria-hidden="true" />}
      </div>
      <h3 className="mt-5 text-2xl font-black text-slate-950">{name}</h3>
      <p className="mt-2 text-sm font-black text-blue-700">{concept}</p>
      <p className="mt-3 text-sm font-medium leading-6 text-slate-700">{weakness}</p>
      <Button
        href="/ai-tutor"
        variant="secondary"
        className="mt-5"
        icon={<ShieldCheck className="h-4 w-4" aria-hidden="true" />}
      >
        Defeat with practice
      </Button>
    </Card>
  );
}
