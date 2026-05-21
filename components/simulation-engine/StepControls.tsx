"use client";

import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import type { SimulationStep } from "@/components/simulation-engine/simulationTypes";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

export function StepControls({
  steps,
  currentIndex,
  canGoBack,
  canGoNext,
  nextLabel,
  onBack,
  onNext,
  onReset,
}: {
  steps: SimulationStep[];
  currentIndex: number;
  canGoBack: boolean;
  canGoNext: boolean;
  nextLabel: string;
  onBack: () => void;
  onNext: () => void;
  onReset: () => void;
}) {
  const current = steps[Math.min(currentIndex, steps.length - 1)];

  return (
    <Card className="border-white/80 bg-white/90 p-4 shadow-xl backdrop-blur">
      <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p className="text-sm font-black uppercase tracking-wide text-blue-700">Current mission step</p>
          <h3 className="mt-1 text-xl font-black text-slate-950">{current?.label}</h3>
          <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">{current?.description}</p>
          <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-6">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={cn(
                  "h-2 rounded-full bg-slate-200",
                  index < currentIndex && "bg-gradient-to-r from-lime-400 to-cyan-400",
                  index === currentIndex && "bg-blue-600",
                )}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-2 lg:justify-end">
          <Button type="button" variant="ghost" disabled={!canGoBack} onClick={onBack} icon={<ArrowLeft className="h-4 w-4" aria-hidden="true" />}>
            Back
          </Button>
          <Button type="button" disabled={!canGoNext} onClick={onNext} icon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}>
            {nextLabel}
          </Button>
          <Button type="button" variant="secondary" onClick={onReset} icon={<RotateCcw className="h-4 w-4" aria-hidden="true" />}>
            Reset
          </Button>
        </div>
      </div>
    </Card>
  );
}
