"use client";

import { useMemo, useState } from "react";
import { calculateMolesFromMass, calculateParticlesFromMoles, formatScientific } from "@/components/labs/basic-concepts-universe/basicConceptsCalculations";
import type { SubstanceCard } from "@/components/labs/basic-concepts-universe/basicConceptsTypes";

export function MoleParticleCounter({ substance }: { substance: SubstanceCard }) {
  const [mass, setMass] = useState(substance.molarMass);
  const moles = useMemo(() => calculateMolesFromMass(mass, substance.molarMass), [mass, substance.molarMass]);
  const particles = useMemo(() => calculateParticlesFromMoles(moles), [moles]);
  const particleCount = Math.min(32, Math.max(6, Math.round(moles * 12)));

  return (
    <div className="rounded-[1.6rem] border border-violet-100 bg-violet-50 p-4">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-violet-800">Mole portal</p>
      <h3 className="mt-2 text-lg font-black text-slate-950">Mass {"->"} moles {"->"} particles</h3>
      <label className="mt-4 block text-sm font-black text-slate-800" htmlFor="mole-mass">
        Mass of {substance.name} in grams
      </label>
      <input
        id="mole-mass"
        type="number"
        min={0}
        step={0.01}
        value={mass}
        onChange={(event) => setMass(Number(event.target.value))}
        className="mt-2 h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-900 outline-none focus:border-violet-400"
      />
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-white p-4">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Moles</p>
          <p className="mt-1 text-xl font-black text-slate-950">{moles.toFixed(3)} mol</p>
        </div>
        <div className="rounded-2xl bg-white p-4">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Particles</p>
          <p className="mt-1 text-xl font-black text-slate-950">{formatScientific(particles, 3)}</p>
        </div>
      </div>
      <div className="mt-4 min-h-24 rounded-2xl bg-slate-950 p-4">
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: particleCount }).map((_, index) => (
            <span key={index} className="h-3 w-3 rounded-full bg-cyan-200 shadow-[0_0_16px_rgba(103,232,249,0.9)]" />
          ))}
        </div>
      </div>
    </div>
  );
}
