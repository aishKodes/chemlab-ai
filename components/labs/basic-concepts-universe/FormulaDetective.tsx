"use client";

import { Lock } from "lucide-react";
import { EmpiricalFormulaSolver } from "@/components/labs/basic-concepts-universe/EmpiricalFormulaSolver";

export function FormulaDetective() {
  return (
    <section className="rounded-[2.2rem] border border-white/60 bg-white/75 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.12)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-violet-700">Preview zone</p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">Formula Detective</h2>
          <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-slate-600">
            This zone will turn percentage composition and molecular mass into a detective board for empirical and molecular formulae.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-2xl bg-violet-100 px-4 py-3 text-sm font-black text-violet-900">
          <Lock className="h-4 w-4" aria-hidden="true" />
          Preview
        </span>
      </div>
      <EmpiricalFormulaSolver />
    </section>
  );
}
