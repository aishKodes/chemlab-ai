import { electrochemistryFacts } from "./electrochemistryData";

export function HalfReactionPanel() {
  return (
    <div className="grid gap-3">
      <div className="rounded-3xl bg-orange-50 p-4">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-700">Anode oxidation</p>
        <p className="mt-2 font-mono text-sm font-black text-slate-950">{electrochemistryFacts.anode}</p>
      </div>
      <div className="rounded-3xl bg-emerald-50 p-4">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">Cathode reduction</p>
        <p className="mt-2 font-mono text-sm font-black text-slate-950">{electrochemistryFacts.cathode}</p>
      </div>
    </div>
  );
}
