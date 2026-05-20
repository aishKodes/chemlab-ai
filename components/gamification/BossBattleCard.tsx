import { Flame, Swords, Trophy } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";

export function BossBattleCard({
  title,
  chapter,
  hp,
  xp,
  href,
}: {
  title: string;
  chapter: string;
  hp: number;
  xp: number;
  href: string;
}) {
  return (
    <Card
      interactive
      className="group overflow-hidden bg-gradient-to-br from-orange-100 via-white to-fuchsia-100 hover:-rotate-1"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="grid h-14 w-14 place-items-center rounded-3xl bg-gradient-to-br from-orange-400 to-rose-500 text-white shadow-lg transition group-hover:scale-110">
          <Swords className="h-7 w-7" aria-hidden="true" />
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-white/85 px-3 py-1 text-xs font-black text-orange-700 shadow">
          <Flame className="h-3.5 w-3.5 fill-orange-400" aria-hidden="true" />
          Boss
        </span>
      </div>
      <p className="mt-5 text-sm font-black uppercase text-blue-700">{chapter}</p>
      <h3 className="mt-1 text-2xl font-black text-slate-950">{title}</h3>
      <div className="mt-5">
        <Progress value={hp} label="Boss health" />
      </div>
      <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl bg-white/70 p-3">
        <span className="inline-flex items-center gap-2 text-sm font-black text-slate-700">
          <Trophy className="h-4 w-4 text-amber-500" aria-hidden="true" />
          Reward
        </span>
        <span className="font-black text-blue-700">+{xp} XP</span>
      </div>
      <Button href={href} className="mt-5 w-full">
        Start battle
      </Button>
    </Card>
  );
}
