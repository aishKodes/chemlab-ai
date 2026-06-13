import type { HydrocarbonLevel } from "@/components/labs/hydrocarbon-quest/hydrocarbonQuestTypes";
import { Badge } from "@/components/ui/Badge";

export function LevelIntro({ level }: { level: HydrocarbonLevel }) {
  return (
    <div className="rounded-[1.5rem] border border-white/30 bg-white/90 p-4 text-slate-950 shadow-xl">
      <Badge tone={level.status === "playable" ? "green" : "amber"}>{level.status}</Badge>
      <h2 className="mt-2 text-2xl font-black">{level.targetName}</h2>
      <p className="mt-2 text-sm font-bold text-slate-700">{level.learningGoal}</p>
    </div>
  );
}
