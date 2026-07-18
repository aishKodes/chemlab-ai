import type { ElectrochemistryLevel } from "./electrochemistryTypes";
import { Badge } from "@/components/ui/Badge";

export function ElectrochemistryHUD({ level, index, total, xp }: { level: ElectrochemistryLevel; index: number; total: number; xp: number }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-white/60 bg-white/80 p-3 shadow-lg backdrop-blur">
      <div>
        <Badge tone="blue">Level {index + 1}/{total}</Badge>
        <h2 className="mt-2 text-xl font-black text-slate-950">{level.title}</h2>
      </div>
      <div className="text-right">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Grid XP</p>
        <p className="text-3xl font-black text-blue-700">{xp}</p>
      </div>
    </div>
  );
}
