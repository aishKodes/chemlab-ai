"use client";

import { FlaskConical, Sparkles, Trophy } from "lucide-react";
import type { HydrocarbonLevel } from "@/components/labs/hydrocarbon-quest/hydrocarbonQuestTypes";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";

export function LevelHUD({
  level,
  levelNumber,
  totalLevels,
  xp,
  chainProgress,
}: {
  level: HydrocarbonLevel;
  levelNumber: number;
  totalLevels: number;
  xp: number;
  chainProgress: number;
}) {
  return (
    <header className="relative z-20 grid gap-3 rounded-[1.6rem] border-2 border-white bg-white/86 p-3 shadow-xl backdrop-blur-md lg:grid-cols-[1fr_auto] lg:items-center">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="cyan">Level {levelNumber} / {totalLevels}</Badge>
          <Badge tone="amber">{level.formula}</Badge>
        </div>
        <h1 className="mt-2 truncate text-xl font-black text-slate-950 sm:text-2xl">{level.title}</h1>
        <p className="mt-1 text-sm font-bold leading-5 text-slate-700">{level.subtitle}</p>
      </div>
      <div className="grid min-w-[15rem] gap-2 rounded-3xl bg-gradient-to-br from-blue-50 to-lime-50 p-3">
        <div className="flex items-center justify-between gap-3 text-xs font-black uppercase tracking-[0.14em] text-slate-600">
          <span className="inline-flex items-center gap-1">
            <FlaskConical className="h-4 w-4 text-cyan-600" aria-hidden="true" />
            Chain
          </span>
          <span className="inline-flex items-center gap-1 text-amber-700">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            {xp} XP
          </span>
        </div>
        <Progress value={chainProgress} label="Carbon family traced" />
        <div className="flex items-center gap-2 text-xs font-black text-violet-700">
          <Trophy className="h-4 w-4" aria-hidden="true" />
          Target: {level.targetName}
        </div>
      </div>
    </header>
  );
}
