import { electrochemistryFacts } from "./electrochemistryData";

export function CellNotationPanel() {
  return (
    <div className="rounded-3xl bg-blue-50 p-4">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">Cell notation</p>
      <p className="mt-2 font-mono text-lg font-black text-slate-950">{electrochemistryFacts.notation}</p>
      <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">Single line separates phases. Double line is the salt bridge.</p>
    </div>
  );
}
