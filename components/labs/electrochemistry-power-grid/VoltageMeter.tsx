import { Zap } from "lucide-react";
import { formatCellPotential } from "./electrochemistryCalculations";

export function VoltageMeter({ voltage, active }: { voltage: number; active: boolean }) {
  return (
    <div className={`rounded-3xl border p-4 text-center shadow-xl ${active ? "border-emerald-300 bg-emerald-950 text-emerald-100" : "border-slate-200 bg-slate-950 text-slate-300"}`}>
      <div className="flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.18em]">
        <Zap className="h-4 w-4 text-amber-300" aria-hidden="true" />
        Voltmeter
      </div>
      <p className="mt-2 font-mono text-4xl font-black">{active ? formatCellPotential(voltage) : "0.00 V"}</p>
      <p className="mt-1 text-xs font-bold opacity-80">School-level Daniell cell model</p>
    </div>
  );
}
