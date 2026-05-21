"use client";

import { ArrowRight } from "lucide-react";
import type { LabAction } from "@/components/lab-engine/labTypes";
import { Button } from "@/components/ui/Button";

export function StepActionBar({
  actions = [],
  onAction,
}: {
  actions?: LabAction[];
  onAction?: (actionId: string) => void;
}) {
  if (actions.length === 0) return null;

  return (
    <footer className="pointer-events-auto rounded-[1.4rem] border border-white/65 bg-white/92 p-3 shadow-2xl backdrop-blur-md">
      <div className="flex gap-3 overflow-x-auto pb-1">
        {actions.slice(0, 4).map((action, index) => (
          <div key={action.id} className="min-w-[15rem] flex-1 rounded-[1.15rem] bg-white/70 p-2">
            <p className="text-xs font-black text-slate-950">{action.label}</p>
            {action.helper ? <p className="mt-1 line-clamp-2 text-xs font-semibold leading-4 text-slate-600">{action.helper}</p> : null}
            <Button
              className="mt-2 w-full"
              size="sm"
              variant={action.tone ?? (index === 0 ? "primary" : "secondary")}
              disabled={action.disabled}
              onClick={() => onAction?.(action.id)}
              icon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
            >
              {action.label}
            </Button>
          </div>
        ))}
      </div>
    </footer>
  );
}
