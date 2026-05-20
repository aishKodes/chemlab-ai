"use client";

import { Atom, BrainCircuit, Minus, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { MasterAlchemPointer } from "@/components/master-alchem/MasterAlchemPointer";
import {
  calculateAtomicCharge,
  calculateMassNumber,
  describeAtomState,
} from "@/lib/chemistry/atomic";
import { clamp } from "@/lib/utils";

function ParticleControl({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="rounded-3xl border border-blue-100 bg-white/75 p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <label className="text-sm font-black text-slate-700" htmlFor={label}>
          {label}
        </label>
        <div className="flex items-center gap-2">
          <button
            className="focus-ring grid h-9 w-9 place-items-center rounded-2xl border border-blue-100 bg-white text-blue-700 shadow transition hover:-translate-y-0.5"
            onClick={() => onChange(clamp(value - 1, min, max))}
            aria-label={`Decrease ${label}`}
          >
            <Minus className="h-4 w-4" aria-hidden="true" />
          </button>
          <span className="min-w-8 text-center text-lg font-black text-slate-950">{value}</span>
          <button
            className="focus-ring grid h-9 w-9 place-items-center rounded-2xl border border-blue-100 bg-blue-600 text-white shadow transition hover:-translate-y-0.5"
            onClick={() => onChange(clamp(value + 1, min, max))}
            aria-label={`Increase ${label}`}
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
      <input
        id={label}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-4 w-full accent-cyan-300"
      />
    </div>
  );
}

function ShellVisualization({ shells }: { shells: number[] }) {
  return (
    <div className="relative mx-auto grid aspect-square w-full max-w-[360px] place-items-center rounded-[2rem] border-4 border-white bg-gradient-to-br from-sky-100 via-white to-lime-100 shadow-inner">
      <div className="absolute grid h-20 w-20 place-items-center rounded-full border-4 border-white bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-xl">
        <Atom className="h-8 w-8" aria-hidden="true" />
      </div>
      {shells.map((electronCount, shellIndex) => {
        const size = 112 + shellIndex * 58;
        return (
          <div
            key={`${electronCount}-${shellIndex}`}
            className="absolute rounded-full border-2 border-blue-300/60"
            style={{ width: size, height: size }}
            aria-label={`Shell ${shellIndex + 1} with ${electronCount} electrons`}
          >
            {Array.from({ length: electronCount }).map((_, electronIndex) => {
              const angle = (electronIndex / electronCount) * Math.PI * 2;
              const radius = size / 2;
              const left = radius + Math.cos(angle) * radius - 5;
              const top = radius + Math.sin(angle) * radius - 5;
              return (
                <span
                  key={electronIndex}
                  className="absolute h-3 w-3 rounded-full border-2 border-white bg-fuchsia-400 shadow-lg"
                  style={{ left, top }}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export function AtomicBuilder() {
  const [protons, setProtons] = useState(6);
  const [neutrons, setNeutrons] = useState(6);
  const [electrons, setElectrons] = useState(6);
  const atom = useMemo(
    () => describeAtomState(protons, neutrons, electrons),
    [protons, neutrons, electrons],
  );
  const charge = calculateAtomicCharge(protons, electrons);
  const massNumber = calculateMassNumber(protons, neutrons);

  return (
    <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
      <Card className="space-y-4 bg-gradient-to-br from-cyan-100 via-white to-lime-100">
        <ParticleControl label="Protons" min={1} max={30} value={protons} onChange={setProtons} />
        <ParticleControl label="Neutrons" min={0} max={40} value={neutrons} onChange={setNeutrons} />
        <ParticleControl label="Electrons" min={0} max={40} value={electrons} onChange={setElectrons} />
        <Button
          variant="secondary"
          className="w-full"
          icon={<BrainCircuit className="h-4 w-4" aria-hidden="true" />}
        >
          Ask Master Alchem to explain this atom
        </Button>
      </Card>

      <div className="space-y-6">
        <Card className="glass-panel-strong">
          <div className="grid gap-6 md:grid-cols-[0.9fr_1.1fr]">
            <ShellVisualization shells={atom.shellConfiguration} />
            <div>
              <p className="text-sm font-black uppercase text-blue-700">
                {atom.element?.symbol ?? "?"}
              </p>
              <h2 className="mt-2 text-4xl font-black text-slate-950">
                {atom.element?.name ?? "Unknown element"}
              </h2>
              <p className="mt-3 text-sm font-medium leading-6 text-slate-600">{atom.description}</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <StatCard label="Atomic number" value={String(protons)} />
                <StatCard label="Mass number" value={String(massNumber)} />
                <StatCard label="Charge" value={charge === 0 ? "0" : charge > 0 ? `+${charge}` : String(charge)} />
              </div>
            </div>
          </div>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          {[
            ["Atomic number", "The proton count defines the element identity."],
            ["Mass number", "Protons plus neutrons identifies the isotope."],
            ["Isotope", "Same protons, different neutrons. Chemistry is mostly similar; mass changes."],
            ["Ion", "Unequal protons and electrons create charge, changing attraction and reactivity."],
          ].map(([title, description]) => (
            <Card key={title}>
              <h3 className="font-black text-slate-950">{title}</h3>
              <p className="mt-2 text-sm font-medium leading-6 text-slate-600">{description}</p>
            </Card>
          ))}
        </div>
        <Card className="bg-gradient-to-br from-amber-100 via-white to-lime-100">
          <h3 className="text-xl font-black text-slate-950">Mini challenge: build oxygen ion</h3>
          <p className="mt-2 text-sm font-medium leading-6 text-slate-600">
            Set 8 protons, 10 neutrons, and 10 electrons. Can you predict the charge before the panel updates?
          </p>
          <div className="mt-4 rounded-full bg-lime-200 px-4 py-2 text-sm font-black text-lime-800">
            Reward: +75 XP
          </div>
        </Card>
        <MasterAlchemPointer
          mood="thinking"
          title="Master Alchem's lab note"
          message="Identity follows protons. Isotope follows neutrons. Charge follows the difference between protons and electrons."
          href="/ai-tutor"
          cta="Ask for a custom explanation"
        />
      </div>
    </div>
  );
}
