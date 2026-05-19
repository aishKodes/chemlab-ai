"use client";

import { Calculator, Sigma } from "lucide-react";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { formatScientific, massToMoles, molesToParticles } from "@/lib/chemistry/mole";

const examples = [
  { label: "Water sample", mass: 18, molarMass: 18.015 },
  { label: "Carbon dioxide", mass: 44, molarMass: 44.01 },
  { label: "Calcium carbonate", mass: 100, molarMass: 100.09 },
];

const particlePositions = Array.from({ length: 40 }).map((_, index) => ({
  left: `${8 + ((index * 19) % 84)}%`,
  top: `${10 + ((index * 29) % 78)}%`,
  opacity: 0.32 + (index % 5) * 0.13,
}));

export function MoleVisualizer() {
  const [mass, setMass] = useState(18);
  const [molarMass, setMolarMass] = useState(18.015);
  const moles = useMemo(() => massToMoles(mass, molarMass), [mass, molarMass]);
  const particles = useMemo(() => molesToParticles(moles), [moles]);

  return (
    <div className="grid gap-6 lg:grid-cols-[0.86fr_1.14fr]">
      <Card>
        <h2 className="text-2xl font-semibold text-white">Mole concept visualizer</h2>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          Convert a measurable mass into moles and representative particles.
        </p>
        <div className="mt-6 grid gap-4">
          <label>
            <span className="text-sm font-medium text-slate-200">Mass in grams</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={mass}
              onChange={(event) => setMass(Number(event.target.value))}
              className="focus-ring mt-2 h-11 w-full rounded-lg border border-white/12 bg-slate-950/70 px-3 text-white"
            />
          </label>
          <label>
            <span className="text-sm font-medium text-slate-200">Molar mass in g/mol</span>
            <input
              type="number"
              min="0.001"
              step="0.001"
              value={molarMass}
              onChange={(event) => setMolarMass(Number(event.target.value))}
              className="focus-ring mt-2 h-11 w-full rounded-lg border border-white/12 bg-slate-950/70 px-3 text-white"
            />
          </label>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {examples.map((example) => (
            <button
              key={example.label}
              className="focus-ring rounded-lg border border-white/12 bg-white/8 px-3 py-2 text-sm text-slate-200 transition hover:bg-white/12"
              onClick={() => {
                setMass(example.mass);
                setMolarMass(example.molarMass);
              }}
            >
              {example.label}
            </button>
          ))}
        </div>
      </Card>

      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <StatCard
            label="Moles"
            value={moles.toFixed(4)}
            detail="mass divided by molar mass"
            icon={<Sigma className="h-5 w-5" aria-hidden="true" />}
          />
          <StatCard
            label="Particles"
            value={formatScientific(particles)}
            detail="moles multiplied by Avogadro's number"
            icon={<Calculator className="h-5 w-5" aria-hidden="true" />}
          />
        </div>

        <Card className="glass-panel-strong overflow-hidden">
          <div className="relative h-80 rounded-lg border border-white/10 bg-slate-950/55">
            {particlePositions.map((particle, index) => (
              <span
                key={index}
                className="absolute h-2.5 w-2.5 rounded-full bg-cyan-200 shadow-[0_0_18px_rgba(103,232,249,0.75)]"
                style={particle}
              />
            ))}
            <div className="absolute inset-x-6 bottom-6 rounded-lg border border-white/10 bg-slate-950/75 p-4 backdrop-blur">
              <p className="text-sm font-semibold text-white">Scale checkpoint</p>
              <p className="mt-1 text-sm leading-6 text-slate-300">
                The dots are symbolic: even a tiny mole-scale sample contains
                particle counts so large they must be handled with scientific notation.
              </p>
            </div>
          </div>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["moles = mass / molar mass", "Use when grams are known."],
            ["mass = moles x molar mass", "Use when preparing a measured sample."],
            ["particles = moles x 6.022 x 10^23", "Use for atoms, molecules, ions, or formula units."],
          ].map(([formula, note]) => (
            <Card key={formula}>
              <p className="font-mono text-sm text-cyan-100">{formula}</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">{note}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
