"use client";

import { HYDROCARBON_COLORS } from "@/components/labs/hydrocarbon-quest/3d/moleculeGeometryConstants";

export function MoleculeLegend({ compact = false }: { compact?: boolean }) {
  const items = [
    ["Main chain", HYDROCARBON_COLORS.main],
    ["Methyl", HYDROCARBON_COLORS.methyl],
    ["Hydrogen", HYDROCARBON_COLORS.hydrogen],
    ["C=C", HYDROCARBON_COLORS.doubleBondB],
    ["C≡C", HYDROCARBON_COLORS.tripleBond],
  ];
  return (
    <div className={`flex flex-wrap gap-2 ${compact ? "text-[10px]" : "text-xs"}`}>
      {items.map(([label, color]) => (
        <span key={label} className="inline-flex items-center gap-1 rounded-full border border-white/70 bg-white/78 px-2 py-1 font-black text-slate-700 shadow-sm backdrop-blur">
          <span className="h-2.5 w-2.5 rounded-full border border-slate-900/10" style={{ backgroundColor: color }} />
          {label}
        </span>
      ))}
    </div>
  );
}
