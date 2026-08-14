"use client";

import { Check, ListOrdered, MousePointer2, Puzzle, Search } from "lucide-react";
import type { HydrocarbonLevel } from "@/components/labs/hydrocarbon-quest/hydrocarbonQuestTypes";
import { cn } from "@/lib/utils";

export type QuestActionStep = "trace" | "number" | "build" | "check";

const steps: Array<{ id: QuestActionStep; label: string; icon: typeof Search }> = [
  { id: "trace", label: "Find chain", icon: Search },
  { id: "number", label: "Number", icon: ListOrdered },
  { id: "build", label: "Build name", icon: Puzzle },
  { id: "check", label: "Check", icon: Check },
];

export function QuestActionGuide({ level, currentStep }: { level: HydrocarbonLevel; currentStep: QuestActionStep }) {
  const visibleSteps = level.numberingOptions ? steps : steps.filter((step) => step.id !== "number");
  const currentIndex = visibleSteps.findIndex((step) => step.id === currentStep);

  return (
    <section className="rounded-[1.25rem] border border-cyan-100 bg-gradient-to-br from-cyan-50 to-white p-3" aria-label="Current quest steps">
      <div className="flex items-center gap-2">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-cyan-600 text-white shadow-md">
          <MousePointer2 className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.14em] text-cyan-700">Do this now</p>
          <p className="text-sm font-black leading-5 text-slate-900">{getInstruction(level, currentStep)}</p>
        </div>
      </div>

      <ol className="mt-3 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
        {visibleSteps.map((step, index) => {
          const Icon = step.icon;
          const complete = index < currentIndex;
          const active = step.id === currentStep;
          return (
            <li
              key={step.id}
              className={cn(
                "flex min-h-10 items-center gap-1.5 rounded-xl border px-2 py-1.5 text-[11px] font-black",
                complete && "border-lime-200 bg-lime-100 text-lime-900",
                active && "border-cyan-300 bg-cyan-600 text-white shadow-md",
                !complete && !active && "border-slate-200 bg-white text-slate-500",
              )}
            >
              {complete ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Icon className="h-3.5 w-3.5" aria-hidden="true" />}
              {step.label}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function getInstruction(level: HydrocarbonLevel, step: QuestActionStep) {
  if (step === "trace") {
    if (level.moduleId === "vip_double_bonds") return "Tap connected carbon atoms from either end of the glowing C=C chain.";
    if (level.moduleId === "cousin_branches") return "Tap the longest connected carbon chain. Leave hanging side branches out.";
    return "Tap connected carbon atoms from either end of the parent chain.";
  }
  if (step === "number") return "Choose the direction that gives the double bond or branch the smaller number.";
  if (step === "build") return "Tap the matching name blocks. Each correct block snaps into its slot.";
  return `Your name is assembled. Check whether it makes ${level.targetName}.`;
}
