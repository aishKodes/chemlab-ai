"use client";

import { ArrowRightLeft } from "lucide-react";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import {
  formatScientific,
  massToMoles,
  molesToMass,
  molesToParticles,
  particlesToMoles,
} from "@/lib/chemistry/mole";

type Mode = "mass-to-moles" | "moles-to-mass" | "moles-to-particles" | "particles-to-moles";

const modes: Array<{ value: Mode; label: string }> = [
  { value: "mass-to-moles", label: "Mass to moles" },
  { value: "moles-to-mass", label: "Moles to mass" },
  { value: "moles-to-particles", label: "Moles to particles" },
  { value: "particles-to-moles", label: "Particles to moles" },
];

export function MoleCalculator() {
  const [mode, setMode] = useState<Mode>("mass-to-moles");
  const [value, setValue] = useState(18);
  const [molarMass, setMolarMass] = useState(18.015);

  const result = useMemo(() => {
    if (mode === "mass-to-moles") return `${massToMoles(value, molarMass).toFixed(5)} mol`;
    if (mode === "moles-to-mass") return `${molesToMass(value, molarMass).toFixed(3)} g`;
    if (mode === "moles-to-particles") return `${formatScientific(molesToParticles(value))} particles`;
    return `${particlesToMoles(value).toExponential(4)} mol`;
  }, [mode, molarMass, value]);

  return (
    <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
      <Card className="bg-gradient-to-br from-lime-100 via-white to-cyan-100">
        <h2 className="text-3xl font-black text-slate-950">Mole calculator</h2>
        <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
          Convert laboratory quantities using molar mass and Avogadro&apos;s number.
        </p>
        <fieldset className="mt-6">
          <legend className="text-sm font-black text-slate-700">Conversion mode</legend>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {modes.map((item) => (
              <button
                key={item.value}
                className={`focus-ring rounded-lg border px-3 py-2 text-sm transition ${
                  mode === item.value
                    ? "border-cyan-200 bg-cyan-300 text-slate-950"
                    : "border-blue-100 bg-white/80 text-slate-700 hover:bg-white"
                }`}
                onClick={() => setMode(item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </fieldset>
        <label className="mt-5 block">
          <span className="text-sm font-black text-slate-700">Input value</span>
          <input
            type="number"
            min="0"
            value={value}
            onChange={(event) => setValue(Number(event.target.value))}
            className="focus-ring mt-2 h-11 w-full rounded-2xl border border-blue-100 bg-white/90 px-3 font-bold text-slate-800"
          />
        </label>
        {(mode === "mass-to-moles" || mode === "moles-to-mass") && (
          <label className="mt-5 block">
            <span className="text-sm font-black text-slate-700">Molar mass in g/mol</span>
            <input
              type="number"
              min="0.001"
              value={molarMass}
              onChange={(event) => setMolarMass(Number(event.target.value))}
              className="focus-ring mt-2 h-11 w-full rounded-2xl border border-blue-100 bg-white/90 px-3 font-bold text-slate-800"
            />
          </label>
        )}
      </Card>

      <div className="space-y-6">
        <StatCard
          label="Calculated result"
          value={result}
          detail="Use the formula cards below to audit each conversion."
          icon={<ArrowRightLeft className="h-5 w-5" aria-hidden="true" />}
          className="glass-panel-strong"
        />
        <div className="grid gap-4 md:grid-cols-2">
          {[
            ["Mass to moles", "n = m / M"],
            ["Moles to mass", "m = n x M"],
            ["Moles to particles", "N = n x NA"],
            ["Particles to moles", "n = N / NA"],
          ].map(([title, formula]) => (
            <Card key={title}>
              <p className="font-black text-slate-950">{title}</p>
              <p className="mt-2 font-mono text-sm font-black text-blue-700">{formula}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
