import { Zap } from "lucide-react";
import { Progress } from "@/components/ui/Progress";

export function XpBar({
  xp,
  nextLevelXp,
}: {
  xp: number;
  nextLevelXp: number;
}) {
  const value = Math.round((xp / nextLevelXp) * 100);

  return (
    <div className="rounded-3xl border border-blue-100 bg-white/80 p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-black text-slate-800">
          <span className="grid h-8 w-8 place-items-center rounded-2xl bg-lime-200 text-lime-800">
            <Zap className="h-4 w-4 fill-lime-600" aria-hidden="true" />
          </span>
          Chemistry XP
        </div>
        <span className="text-sm font-black text-blue-700">
          {xp}/{nextLevelXp}
        </span>
      </div>
      <Progress value={value} />
    </div>
  );
}
