"use client";

import { CheckCircle2, HelpCircle } from "lucide-react";
import type { LabChallenge } from "@/components/lab-engine/labTypes";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function ChallengePanel({
  challenge,
  selectedOptionId,
  onAnswer,
  onContinue,
}: {
  challenge: LabChallenge;
  selectedOptionId?: string;
  onAnswer: (optionId: string) => void;
  onContinue?: () => void;
}) {
  const selected = challenge.options.find((option) => option.id === selectedOptionId);
  const correct = selectedOptionId === challenge.correctOptionId;

  return (
    <section className="rounded-[1.4rem] border border-white/65 bg-white/92 p-4 shadow-2xl backdrop-blur-md">
      <Badge tone="amber">Challenge</Badge>
      <h2 className="mt-3 text-xl font-black text-slate-950">{challenge.question}</h2>
      <div className="mt-4 grid gap-2">
        {challenge.options.map((option) => {
          const active = selectedOptionId === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onAnswer(option.id)}
              className={cn(
                "focus-ring rounded-2xl border-2 bg-white px-3 py-3 text-left text-sm font-black text-slate-700 transition hover:border-cyan-300 hover:bg-cyan-50",
                active && correct && "border-lime-300 bg-lime-50 text-lime-900",
                active && !correct && "border-amber-300 bg-amber-50 text-amber-900",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      <p className={cn("mt-3 rounded-2xl p-3 text-sm font-bold leading-5", selected ? (correct ? "bg-lime-100 text-lime-900" : "bg-amber-100 text-amber-900") : "bg-blue-50 text-blue-800")}>
        <span className="flex gap-2">
          {selected ? correct ? <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" /> : <HelpCircle className="h-4 w-4 shrink-0" aria-hidden="true" /> : <HelpCircle className="h-4 w-4 shrink-0" aria-hidden="true" />}
          {selected?.feedback ?? challenge.hint}
        </span>
      </p>
      {correct && onContinue ? (
        <Button onClick={onContinue} className="mt-4 w-full" size="sm">
          Continue
        </Button>
      ) : null}
    </section>
  );
}
