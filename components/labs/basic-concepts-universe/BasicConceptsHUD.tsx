"use client";

import { Atom, Sparkles, Trophy } from "lucide-react";
import type { UniverseZone } from "@/components/labs/basic-concepts-universe/basicConceptsTypes";

export function BasicConceptsHUD({
  zone,
  xp,
  completedCount,
  totalCount,
}: {
  zone: UniverseZone;
  xp: number;
  completedCount: number;
  totalCount: number;
}) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 rounded-[2rem] border border-white/40 bg-white/80 p-4 shadow-[0_18px_60px_rgba(15,23,42,0.14)] backdrop-blur">
      <div className="flex items-center gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-lg">
          <Atom className="h-6 w-6" aria-hidden="true" />
        </span>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">Chemistry Scale Universe</p>
          <h1 className="text-lg font-black text-slate-950 md:text-2xl">{zone.title}</h1>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-sm font-black">
        <span className="inline-flex items-center gap-2 rounded-2xl bg-amber-100 px-3 py-2 text-amber-900">
          <Trophy className="h-4 w-4" aria-hidden="true" />
          {xp} XP
        </span>
        <span className="inline-flex items-center gap-2 rounded-2xl bg-cyan-100 px-3 py-2 text-cyan-900">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          {completedCount}/{totalCount} zones
        </span>
      </div>
    </header>
  );
}
