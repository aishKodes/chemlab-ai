"use client";

import type { SubstanceCard } from "@/components/labs/basic-concepts-universe/basicConceptsTypes";

const atomicMasses: Record<string, number> = {
  H: 1.008,
  C: 12.01,
  O: 16.0,
  Na: 22.99,
  S: 32.06,
};

export function MolarMassBuilder({ substance }: { substance: SubstanceCard }) {
  const rows = Object.entries(substance.atoms).map(([element, count]) => ({
    element,
    count,
    atomicMass: atomicMasses[element] ?? 0,
    contribution: (atomicMasses[element] ?? 0) * count,
  }));
  return (
    <div className="rounded-[1.6rem] border border-cyan-100 bg-cyan-50 p-4">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-cyan-800">Formula builder</p>
      <h3 className="mt-2 text-lg font-black text-slate-950">{substance.formula} molar mass</h3>
      <div className="mt-4 space-y-2">
        {rows.map((row) => (
          <div key={row.element} className="flex items-center justify-between rounded-2xl bg-white px-3 py-2 text-sm font-black text-slate-800">
            <span>
              {row.count} x {row.element}
            </span>
            <span>{row.contribution.toFixed(2)} g mol^-1</span>
          </div>
        ))}
      </div>
      <p className="mt-3 rounded-2xl bg-slate-950 p-3 text-sm font-black text-white">Total: {substance.molarMass.toFixed(2)} g mol^-1</p>
    </div>
  );
}
