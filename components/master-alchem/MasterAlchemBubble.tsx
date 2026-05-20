"use client";

import { Sparkles } from "lucide-react";
import { MasterAlchem } from "@/components/master-alchem/MasterAlchem";
import type { MasterAlchemMood } from "@/components/master-alchem/MasterAlchemMood";
import { masterAlchemMoodLabels } from "@/components/master-alchem/MasterAlchemMood";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

type MasterAlchemBubbleProps = {
  mood?: MasterAlchemMood;
  eyebrow?: string;
  message: string;
  actionLabel?: string;
  actionHref?: string;
  compact?: boolean;
  className?: string;
};

export function MasterAlchemBubble({
  mood = "speaking",
  eyebrow,
  message,
  actionLabel,
  actionHref,
  compact,
  className,
}: MasterAlchemBubbleProps) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden bg-gradient-to-br from-white via-cyan-50 to-violet-100",
        compact ? "p-4" : "p-5",
        className,
      )}
    >
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-cyan-300/40 blur-2xl" />
      <div className="relative flex items-center gap-4">
        <MasterAlchem mood={mood} size={compact ? "sm" : "md"} />
        <div className="min-w-0 flex-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-black text-violet-700 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" aria-hidden="true" />
            {eyebrow ?? masterAlchemMoodLabels[mood]}
          </div>
          <p className="mt-3 text-sm font-bold leading-6 text-slate-700 sm:text-base">{message}</p>
          {actionLabel && actionHref ? (
            <Button href={actionHref} size="sm" variant="secondary" className="mt-4">
              {actionLabel}
            </Button>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
