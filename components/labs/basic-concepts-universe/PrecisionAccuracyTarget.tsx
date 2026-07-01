"use client";

import { useState } from "react";

const modes = {
  accuratePrecise: {
    label: "accurate and precise",
    points: [
      [50, 50],
      [52, 49],
      [48, 51],
      [51, 53],
    ],
  },
  preciseNotAccurate: {
    label: "precise but not accurate",
    points: [
      [72, 30],
      [74, 32],
      [70, 31],
      [73, 28],
    ],
  },
  accurateNotPrecise: {
    label: "accurate on average, not precise",
    points: [
      [35, 45],
      [65, 55],
      [48, 32],
      [54, 68],
    ],
  },
} as const;

type ModeKey = keyof typeof modes;

export function PrecisionAccuracyTarget() {
  const [mode, setMode] = useState<ModeKey>("preciseNotAccurate");
  return (
    <div className="rounded-[1.6rem] border border-violet-100 bg-violet-50 p-4">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-violet-800">Target lab</p>
      <h3 className="mt-2 text-lg font-black text-slate-950">Precision vs accuracy</h3>
      <div className="mt-4 flex flex-wrap gap-2">
        {(Object.keys(modes) as ModeKey[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setMode(key)}
            className={`focus-ring rounded-2xl px-3 py-2 text-xs font-black ${mode === key ? "bg-violet-600 text-white" : "bg-white text-slate-700"}`}
          >
            {modes[key].label}
          </button>
        ))}
      </div>
      <div className="relative mx-auto mt-5 aspect-square max-w-[260px] rounded-full border-[10px] border-violet-200 bg-white shadow-inner">
        <div className="absolute inset-[18%] rounded-full border-4 border-violet-100" />
        <div className="absolute inset-[36%] rounded-full border-4 border-amber-200" />
        <div className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]" />
        {modes[mode].points.map(([x, y], index) => (
          <span
            key={`${x}-${y}-${index}`}
            className="absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600 shadow-[0_0_18px_rgba(37,99,235,0.6)]"
            style={{ left: `${x}%`, top: `${y}%` }}
          />
        ))}
      </div>
    </div>
  );
}
