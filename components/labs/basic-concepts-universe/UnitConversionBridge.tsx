"use client";

import { useState } from "react";
import { convertMlToLitres } from "@/components/labs/basic-concepts-universe/basicConceptsCalculations";

export function UnitConversionBridge() {
  const [ml, setMl] = useState(250);
  const litres = convertMlToLitres(ml);
  return (
    <div className="rounded-[1.6rem] border border-green-100 bg-green-50 p-4">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-green-800">Factor-label bridge</p>
      <h3 className="mt-2 text-lg font-black text-slate-950">Unit conversion bridge</h3>
      <label className="mt-4 block text-sm font-black text-slate-800" htmlFor="ml-input">
        Volume in mL
      </label>
      <input
        id="ml-input"
        type="number"
        min={0}
        value={ml}
        onChange={(event) => setMl(Number(event.target.value))}
        className="mt-2 h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-900 outline-none focus:border-green-400"
      />
      <div className="mt-4 rounded-2xl bg-white p-4 text-sm font-black text-slate-900">
        {ml || 0} mL x 1 L / 1000 mL = {litres.toFixed(3)} L
      </div>
      <p className="mt-3 text-xs font-bold leading-5 text-slate-600">The mL unit cancels, so the answer is in litres.</p>
    </div>
  );
}
