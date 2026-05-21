"use client";

import { Calculator, Sigma } from "lucide-react";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { MasterAlchemPointer } from "@/components/master-alchem/MasterAlchemPointer";
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
      <Card className="bg-gradient-to-br from-amber-100 via-white to-lime-100">
        <h2 className="text-3xl font-black text-slate-950">Mass -&gt; moles -&gt; particles</h2>
        <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
          Convert a measurable mass into moles and representative particles.
        </p>
        <div className="mt-6 grid gap-4">
          <label>
            <span className="text-sm font-black text-slate-700">Mass in grams</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={mass}
              onChange={(event) => setMass(Number(event.target.value))}
              className="focus-ring mt-2 h-11 w-full rounded-2xl border border-amber-100 bg-white/90 px-3 font-bold text-slate-800"
            />
          </label>
          <label>
            <span className="text-sm font-black text-slate-700">Molar mass in g/mol</span>
            <input
              type="number"
              min="0.001"
              step="0.001"
              value={molarMass}
              onChange={(event) => setMolarMass(Number(event.target.value))}
              className="focus-ring mt-2 h-11 w-full rounded-2xl border border-amber-100 bg-white/90 px-3 font-bold text-slate-800"
            />
          </label>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {examples.map((example) => (
            <button
              key={example.label}
              className="focus-ring rounded-2xl border border-orange-100 bg-white/80 px-3 py-2 text-sm font-black text-orange-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
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
          <div className="relative h-80 rounded-[2rem] border-4 border-white bg-gradient-to-br from-sky-100 via-white to-violet-100">
            {particlePositions.map((particle, index) => (
              <span
                key={index}
                className="absolute h-3 w-3 rounded-full border-2 border-white bg-blue-500 shadow-lg"
                style={particle}
              />
            ))}
            <div className="absolute inset-x-6 bottom-6 rounded-3xl border border-blue-100 bg-white/85 p-4 shadow-lg backdrop-blur">
              <p className="text-sm font-black text-slate-950">Scale checkpoint</p>
              <p className="mt-1 text-sm font-medium leading-6 text-slate-600">
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
              <p className="font-mono text-sm font-black text-blue-700">{formula}</p>
              <p className="mt-2 text-sm font-medium leading-6 text-slate-600">{note}</p>
            </Card>
          ))}
        </div>
        <MasterAlchemPointer
          mood="guide"
          title="Master Alchem's scale trick"
          message="A mole is a counting bridge. First move from grams to moles, then from moles to the particle world."
          href="/ai-tutor"
          cta="Ask for another analogy"
        />
      </div>
    </div>
  );
}
