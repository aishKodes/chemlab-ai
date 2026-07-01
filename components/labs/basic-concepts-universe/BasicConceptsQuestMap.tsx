"use client";

import { Lock, Sparkles } from "lucide-react";
import type { UniverseZone, UniverseZoneId } from "@/components/labs/basic-concepts-universe/basicConceptsTypes";

export function BasicConceptsQuestMap({
  zones,
  activeZoneId,
  completed,
  onSelect,
}: {
  zones: UniverseZone[];
  activeZoneId: UniverseZoneId;
  completed: UniverseZoneId[];
  onSelect: (zoneId: UniverseZoneId) => void;
}) {
  return (
    <nav aria-label="Chemistry universe zones" className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
      {zones.map((zone) => {
        const isActive = zone.id === activeZoneId;
        const isComplete = completed.includes(zone.id);
        return (
          <button
            key={zone.id}
            type="button"
            onClick={() => onSelect(zone.id)}
            className={`focus-ring rounded-[1.4rem] border p-4 text-left shadow-sm transition hover:-translate-y-0.5 ${
              isActive
                ? "border-blue-300 bg-blue-950 text-white shadow-[0_16px_45px_rgba(37,99,235,0.26)]"
                : "border-white/70 bg-white/75 text-slate-800"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-black uppercase tracking-[0.16em] opacity-75">{zone.status === "playable" ? "Playable" : "Preview"}</span>
              {zone.status === "preview" ? <Lock className="h-4 w-4" aria-hidden="true" /> : <Sparkles className="h-4 w-4" aria-hidden="true" />}
            </div>
            <p className="mt-3 text-sm font-black">{zone.title}</p>
            <p className="mt-1 text-xs font-bold opacity-75">{isComplete ? "Badge earned" : `${zone.xp} XP`}</p>
          </button>
        );
      })}
    </nav>
  );
}
