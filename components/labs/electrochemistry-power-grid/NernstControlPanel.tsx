import type { ConcentrationState } from "./electrochemistryTypes";
import { calculateDaniellCellVoltage, calculateReactionQuotient, formatCellPotential } from "./electrochemistryCalculations";

export function NernstControlPanel({
  concentrations,
  onChange,
  onReset,
}: {
  concentrations: ConcentrationState;
  onChange: (next: ConcentrationState) => void;
  onReset: () => void;
}) {
  const voltage = calculateDaniellCellVoltage(concentrations);
  const quotient = calculateReactionQuotient(concentrations);
  return (
    <div className="rounded-3xl border border-blue-100 bg-white/85 p-4">
      <h3 className="text-lg font-black text-slate-950">Nernst Voltage Lab</h3>
      <p className="mt-1 text-xs font-bold text-slate-500">School-level model at 298 K.</p>
      <div className="mt-4 grid gap-4">
        <Slider label="[Zn2+]" value={concentrations.zn2Concentration} onChange={(value) => onChange({ ...concentrations, zn2Concentration: value })} />
        <Slider label="[Cu2+]" value={concentrations.cu2Concentration} onChange={(value) => onChange({ ...concentrations, cu2Concentration: value })} />
      </div>
      <div className="mt-4 rounded-2xl bg-slate-950 p-3 text-sm font-black text-cyan-100">
        Ecell = {formatCellPotential(voltage)} · Q = {quotient.toFixed(2)}
      </div>
      <p className="mt-3 text-sm font-semibold leading-6 text-slate-700">
        Increasing Cu2+ lowers Q and raises voltage. Increasing Zn2+ raises Q and lowers voltage.
      </p>
      <button type="button" onClick={onReset} className="mt-3 rounded-full bg-blue-600 px-4 py-2 text-xs font-black text-white">
        Reset standard state
      </button>
    </div>
  );
}

function Slider({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="block text-sm font-black text-slate-700">
      <span className="flex justify-between">
        {label}
        <span>{value.toFixed(2)} M</span>
      </span>
      <input
        type="range"
        min="0.1"
        max="3"
        step="0.1"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-2 w-full"
      />
    </label>
  );
}
