"use client";

import { Atom, BrainCircuit, Minus, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
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
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
      <div className="flex items-center justify-between gap-3">
        <label className="text-sm font-medium text-slate-200" htmlFor={label}>
          {label}
        </label>
        <div className="flex items-center gap-2">
          <button
            className="focus-ring grid h-8 w-8 place-items-center rounded-lg border border-white/15 bg-white/8 text-slate-200 transition hover:bg-white/12"
            onClick={() => onChange(clamp(value - 1, min, max))}
            aria-label={`Decrease ${label}`}
          >
            <Minus className="h-4 w-4" aria-hidden="true" />
          </button>
          <span className="min-w-8 text-center text-lg font-semibold text-white">{value}</span>
          <button
            className="focus-ring grid h-8 w-8 place-items-center rounded-lg border border-white/15 bg-white/8 text-slate-200 transition hover:bg-white/12"
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
    <div className="relative mx-auto grid aspect-square w-full max-w-[360px] place-items-center rounded-lg border border-white/10 bg-slate-950/50">
      <div className="absolute grid h-20 w-20 place-items-center rounded-full border border-cyan-200/30 bg-cyan-300/10 text-cyan-100">
        <Atom className="h-8 w-8" aria-hidden="true" />
      </div>
      {shells.map((electronCount, shellIndex) => {
        const size = 112 + shellIndex * 58;
        return (
          <div
            key={`${electronCount}-${shellIndex}`}
            className="absolute rounded-full border border-slate-500/35"
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
                  className="absolute h-2.5 w-2.5 rounded-full bg-cyan-200 shadow-[0_0_14px_rgba(103,232,249,0.75)]"
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
      <Card className="space-y-4">
        <ParticleControl label="Protons" min={1} max={30} value={protons} onChange={setProtons} />
        <ParticleControl label="Neutrons" min={0} max={40} value={neutrons} onChange={setNeutrons} />
        <ParticleControl label="Electrons" min={0} max={40} value={electrons} onChange={setElectrons} />
        <Button
          variant="secondary"
          className="w-full"
          icon={<BrainCircuit className="h-4 w-4" aria-hidden="true" />}
        >
          Ask AI to explain this atom
        </Button>
      </Card>

      <div className="space-y-6">
        <Card className="glass-panel-strong">
          <div className="grid gap-6 md:grid-cols-[0.9fr_1.1fr]">
            <ShellVisualization shells={atom.shellConfiguration} />
            <div>
              <p className="text-sm font-semibold uppercase text-cyan-100">
                {atom.element?.symbol ?? "?"}
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-white">
                {atom.element?.name ?? "Unknown element"}
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">{atom.description}</p>
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
              <h3 className="font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
