"use client";

import { Beaker, BrainCircuit, Sparkles } from "lucide-react";
import { MasterAlchem } from "@/components/master-alchem/MasterAlchem";
import type { MasterAlchemMood } from "@/components/master-alchem/MasterAlchemMood";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

type MasterAlchemDockProps = {
  mood?: MasterAlchemMood;
  title?: string;
  message?: string;
  className?: string;
};

export function MasterAlchemDock({
  mood = "speaking",
  title = "Master Alchem is watching the lab.",
  message = "Ask for a hint, a safer explanation, or a step-by-step path when a concept feels foggy.",
  className,
}: MasterAlchemDockProps) {
  return (
    <Card className={cn("overflow-hidden bg-gradient-to-br from-blue-100 via-white to-violet-100 p-0", className)}>
      <div className="grid gap-4 p-5 sm:grid-cols-[auto_1fr] sm:items-center">
        <MasterAlchem mood={mood} size="md" />
        <div>
          <Badge tone="blue">Master Alchem</Badge>
          <h2 className="mt-3 text-2xl font-black text-slate-950">{title}</h2>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">{message}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button href="/ai-tutor" size="sm" icon={<BrainCircuit className="h-4 w-4" aria-hidden="true" />}>
              Ask Master Alchem
            </Button>
            <Button href="/labs" size="sm" variant="ghost" icon={<Beaker className="h-4 w-4" aria-hidden="true" />}>
              Story labs
            </Button>
          </div>
        </div>
      </div>
      <div className="border-t border-white/70 bg-white/50 px-5 py-3">
        <div className="flex flex-wrap items-center gap-2 text-xs font-black text-violet-700">
          <Sparkles className="h-4 w-4 text-amber-500" aria-hidden="true" />
          Hint mode
          <span className="h-1.5 w-1.5 rounded-full bg-violet-300" />
          Lab Guide Mode
          <span className="h-1.5 w-1.5 rounded-full bg-violet-300" />
          Safe chemistry explanations
        </div>
      </div>
    </Card>
  );
}
