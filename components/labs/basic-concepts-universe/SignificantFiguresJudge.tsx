"use client";

import { useState } from "react";
import { countSignificantFigures } from "@/components/labs/basic-concepts-universe/basicConceptsCalculations";

const examples = ["2.50", "0.00450", "1000", "1000.", "6.022"];

export function SignificantFiguresJudge() {
  const [value, setValue] = useState("2.50");
  const sigFigs = countSignificantFigures(value);
  return (
    <div className="rounded-[1.6rem] border border-amber-100 bg-amber-50 p-4">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-amber-800">Judge station</p>
      <h3 className="mt-2 text-lg font-black text-slate-950">Significant figures judge</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {examples.map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => setValue(example)}
            className={`focus-ring rounded-2xl px-3 py-2 text-xs font-black ${value === example ? "bg-amber-500 text-white" : "bg-white text-slate-700"}`}
          >
            {example}
          </button>
        ))}
      </div>
      <label className="mt-4 block text-sm font-black text-slate-800" htmlFor="sigfig-input">
        Measurement
      </label>
      <input
        id="sigfig-input"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className="mt-2 h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-900 outline-none focus:border-amber-400"
      />
      <p className="mt-3 rounded-2xl bg-white p-3 text-sm font-black text-slate-900">{sigFigs} significant figure{sigFigs === 1 ? "" : "s"}</p>
    </div>
  );
}
