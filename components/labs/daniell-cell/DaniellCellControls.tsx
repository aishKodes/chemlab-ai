"use client";

import { ArrowRight, RotateCcw } from "lucide-react";
import type { DaniellAction } from "@/components/labs/daniell-cell/daniellCellTypes";
import { Button } from "@/components/ui/Button";

export function DaniellCellControls({
  action,
  onAction,
}: {
  action: DaniellAction | null;
  onAction: (actionId: string) => void;
}) {
  if (!action) return null;

  const isRestart = action.id === "restart";

  return (
    <div className="rounded-[1.75rem] border-2 border-white bg-white/88 p-4 shadow-2xl backdrop-blur-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-black text-slate-950">{action.label}</p>
          <p className="mt-1 text-sm font-semibold leading-5 text-slate-600">{action.helper}</p>
        </div>
        <Button
          onClick={() => onAction(action.id)}
          disabled={action.disabled}
          size="lg"
          className="w-full sm:w-auto"
          icon={isRestart ? <RotateCcw className="h-4 w-4" aria-hidden="true" /> : <ArrowRight className="h-4 w-4" aria-hidden="true" />}
        >
          {action.label}
        </Button>
      </div>
    </div>
  );
}
