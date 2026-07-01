"use client";

import { Lock } from "lucide-react";
import { GasVolumePuzzle } from "@/components/labs/basic-concepts-universe/GasVolumePuzzle";
import { LawBalanceScale } from "@/components/labs/basic-concepts-universe/LawBalanceScale";

export function ChemicalLawsCourt() {
  return (
    <section className="rounded-[2.2rem] border border-white/60 bg-white/75 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.12)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-amber-700">Preview zone</p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">Law Court of Chemical Combinations</h2>
          <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-slate-600">
            This zone will become a courtroom where mass balance, fixed recipes, and gas volume ratios testify as evidence.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-2xl bg-amber-100 px-4 py-3 text-sm font-black text-amber-900">
          <Lock className="h-4 w-4" aria-hidden="true" />
          Build queue
        </span>
      </div>
      <LawBalanceScale />
      <GasVolumePuzzle />
    </section>
  );
}
