"use client";

import { Gauge, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";

export function LabHUD({
  title,
  phase,
  progress,
  xp,
  badge,
  voltage,
}: {
  title: string;
  phase: string;
  progress: number;
  xp: number;
  badge?: string;
  voltage?: string;
}) {
  return (
    <header className="grid min-h-16 gap-3 rounded-[1.4rem] border border-white/55 bg-slate-950/64 p-3 text-white shadow-xl backdrop-blur-md lg:grid-cols-[1fr_auto_auto] lg:items-center">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="cyan" className="border-cyan-200 bg-cyan-100 text-cyan-900">
            {badge ?? title}
          </Badge>
          <span className="rounded-full bg-white/12 px-3 py-1 text-xs font-black text-cyan-50">{phase}</span>
        </div>
        <div className="mt-2 max-w-xl">
          <Progress value={progress} label="Lab progress" />
        </div>
      </div>
      {voltage ? <HudPill icon={<Gauge className="h-4 w-4" aria-hidden="true" />} label="Voltage" value={voltage} /> : null}
      <HudPill icon={<Sparkles className="h-4 w-4" aria-hidden="true" />} label="XP" value={`${xp}`} />
    </header>
  );
}

function HudPill({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex min-w-32 items-center gap-3 rounded-2xl border border-white/20 bg-white/12 px-3 py-2 shadow-lg">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/16 text-white">{icon}</span>
      <div>
        <p className="text-[0.65rem] font-black uppercase tracking-[0.18em] text-white/60">{label}</p>
        <p className="text-base font-black text-white">{value}</p>
      </div>
    </div>
  );
}
