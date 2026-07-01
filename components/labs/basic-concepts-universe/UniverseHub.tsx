"use client";

import { FlaskConical } from "lucide-react";
import type { UniverseZone, UniverseZoneId } from "@/components/labs/basic-concepts-universe/basicConceptsTypes";

export function UniverseHub({
  zones,
  onSelect,
}: {
  zones: UniverseZone[];
  onSelect: (zoneId: UniverseZoneId) => void;
}) {
  return (
    <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-[2.2rem] border border-white/60 bg-gradient-to-br from-blue-950 via-violet-950 to-slate-950 p-7 text-white shadow-[0_28px_90px_rgba(15,23,42,0.28)]">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-200">Class 11 Unit 1</p>
        <h2 className="mt-3 text-4xl font-black leading-tight md:text-5xl">From atoms to stoichiometry, see chemistry as a world.</h2>
        <p className="mt-4 max-w-2xl text-sm font-semibold leading-7 text-blue-100">
          Start in Matter World, sharpen measurement skills, walk through the Mole Portal, then run a stoichiometry factory. Each zone teaches by action, not by wall-of-text.
        </p>
        <button
          type="button"
          onClick={() => onSelect("matter-world")}
          className="focus-ring mt-7 inline-flex h-12 items-center gap-2 rounded-2xl bg-amber-300 px-5 text-sm font-black text-slate-950 shadow-[0_10px_0_rgba(251,191,36,0.28)] transition hover:-translate-y-0.5"
        >
          <FlaskConical className="h-4 w-4" aria-hidden="true" />
          Enter Matter World
        </button>
      </div>
      <div className="grid gap-3">
        {zones.map((zone) => (
          <button
            key={zone.id}
            type="button"
            onClick={() => onSelect(zone.id)}
            className="focus-ring rounded-[1.6rem] border border-white/70 bg-white/80 p-4 text-left shadow-sm transition hover:-translate-y-0.5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-700">{zone.status === "playable" ? "Playable zone" : "Preview zone"}</p>
                <h3 className="mt-2 text-lg font-black text-slate-950">{zone.title}</h3>
                <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">{zone.objective}</p>
              </div>
              <span className="rounded-2xl bg-amber-100 px-3 py-2 text-xs font-black text-amber-900">{zone.xp} XP</span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
