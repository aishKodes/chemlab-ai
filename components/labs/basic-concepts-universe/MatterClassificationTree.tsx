"use client";

import type { MatterSample } from "@/components/labs/basic-concepts-universe/basicConceptsTypes";

const categories: MatterSample["correctCategory"][] = ["element", "compound", "homogeneous mixture", "heterogeneous mixture"];

export function MatterClassificationTree({
  sample,
  selectedCategory,
  onSelect,
}: {
  sample: MatterSample;
  selectedCategory: MatterSample["correctCategory"] | null;
  onSelect: (category: MatterSample["correctCategory"]) => void;
}) {
  return (
    <div className="rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-700">Classification mission</p>
      <h3 className="mt-2 text-xl font-black text-slate-950">Sort: {sample.name}</h3>
      <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">{sample.clue}</p>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {categories.map((category) => {
          const isSelected = selectedCategory === category;
          const isCorrect = isSelected && category === sample.correctCategory;
          const isWrong = isSelected && category !== sample.correctCategory;
          return (
            <button
              key={category}
              type="button"
              onClick={() => onSelect(category)}
              className={`focus-ring rounded-2xl border px-4 py-3 text-left text-sm font-black transition hover:-translate-y-0.5 ${
                isCorrect
                  ? "border-green-300 bg-green-100 text-green-900"
                  : isWrong
                    ? "border-red-300 bg-red-100 text-red-900"
                    : "border-slate-200 bg-white text-slate-700"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>
      <div className="mt-4 rounded-2xl bg-slate-950 p-4 text-xs font-bold leading-5 text-white">
        Matter {"->"} pure substance / mixture {"->"} element / compound / mixture type
      </div>
    </div>
  );
}
