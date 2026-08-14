"use client";

import { formatChemicalFormula } from "@/components/labs/hydrocarbon-quest/3d/labelUtils";

export function ChemicalFormulaLabel({
  formula,
  name,
}: {
  formula: string;
  name: string;
}) {
  return (
    <div className="rounded-2xl border border-cyan-200/70 bg-white/92 px-3 py-2 text-slate-950 shadow-xl backdrop-blur-md">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-cyan-700">3D molecule quest</p>
      <h3 className="text-lg font-black">{name}</h3>
      <p className="text-xs font-bold text-slate-600">
        <span className="font-black text-blue-700">{formatChemicalFormula(formula)}</span> · inspect, trace, and name
      </p>
    </div>
  );
}
