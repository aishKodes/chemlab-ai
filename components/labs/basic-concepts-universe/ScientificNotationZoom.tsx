"use client";

import { useMemo, useState } from "react";
import { formatScientific } from "@/components/labs/basic-concepts-universe/basicConceptsCalculations";

export function ScientificNotationZoom() {
  const [exponent, setExponent] = useState(23);
  const value = useMemo(() => 6.022 * 10 ** exponent, [exponent]);
  return (
    <div className="rounded-[1.6rem] border border-blue-100 bg-blue-50 p-4">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-800">Scale universe</p>
      <h3 className="mt-2 text-lg font-black text-slate-950">Scientific notation zoom</h3>
      <p className="mt-2 text-sm font-semibold text-slate-600">Slide from tiny to huge and keep the number readable.</p>
      <input
        aria-label="Power of ten"
        type="range"
        min={-24}
        max={24}
        value={exponent}
        onChange={(event) => setExponent(Number(event.target.value))}
        className="mt-4 w-full accent-blue-700"
      />
      <div className="mt-4 rounded-2xl bg-slate-950 p-4 text-white">
        <p className="text-xs font-bold text-blue-100">Value</p>
        <p className="mt-1 text-xl font-black">{formatScientific(value, 3)}</p>
        <p className="mt-1 text-xs font-bold text-slate-300">Power: 10^{exponent}</p>
      </div>
    </div>
  );
}
