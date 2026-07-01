"use client";

import { useMemo, useState } from "react";
import { solveAmmoniaStoichiometry } from "@/components/labs/basic-concepts-universe/basicConceptsCalculations";

export function LimitingReagentGame() {
  const [n2, setN2] = useState(2);
  const [h2, setH2] = useState(3);
  const result = useMemo(() => solveAmmoniaStoichiometry(n2, h2), [n2, h2]);
  return (
    <div className="rounded-[1.8rem] border border-orange-100 bg-orange-50 p-5">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-orange-800">Factory recipe</p>
      <h3 className="mt-2 text-xl font-black text-slate-950">N2 + 3H2 {"->"} 2NH3</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-black text-slate-800">
          N2 moles
          <input
            type="number"
            min={0}
            step={0.1}
            value={n2}
            onChange={(event) => setN2(Number(event.target.value))}
            className="mt-2 h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-900 outline-none focus:border-orange-400"
          />
        </label>
        <label className="block text-sm font-black text-slate-800">
          H2 moles
          <input
            type="number"
            min={0}
            step={0.1}
            value={h2}
            onChange={(event) => setH2(Number(event.target.value))}
            className="mt-2 h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-900 outline-none focus:border-orange-400"
          />
        </label>
      </div>
      <div className="mt-5 rounded-[1.6rem] bg-slate-950 p-4 text-white">
        <div className="grid gap-3 sm:grid-cols-3">
          <FactoryGauge label="NH3 output" value={`${result.ammoniaMoles.toFixed(2)} mol`} tone="green" />
          <FactoryGauge label="Limiting reagent" value={result.limitingReagent} tone="amber" />
          <FactoryGauge label="Leftover" value={`N2 ${result.leftoverN2.toFixed(2)} / H2 ${result.leftoverH2.toFixed(2)}`} tone="cyan" />
        </div>
        <div className="mt-5 flex items-center gap-2 overflow-hidden rounded-2xl bg-white/10 p-3">
          {Array.from({ length: Math.min(18, Math.round(result.ammoniaMoles * 4)) }).map((_, index) => (
            <span key={index} className="h-4 w-8 rounded-full bg-green-300 shadow-[0_0_18px_rgba(134,239,172,0.8)]" />
          ))}
        </div>
      </div>
      <p className="mt-3 text-xs font-bold leading-5 text-slate-600">
        The balanced equation is the factory recipe. The reactant that cannot supply its coefficient ratio is the limiting reagent.
      </p>
    </div>
  );
}

function FactoryGauge({ label, value, tone }: { label: string; value: string; tone: "green" | "amber" | "cyan" }) {
  const toneClass = tone === "green" ? "text-green-200" : tone === "amber" ? "text-amber-200" : "text-cyan-200";
  return (
    <div className="rounded-2xl bg-white/10 p-3">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-300">{label}</p>
      <p className={`mt-1 text-lg font-black ${toneClass}`}>{value}</p>
    </div>
  );
}
