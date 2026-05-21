"use client";

import { BatteryCharging, Gauge, Sparkles, Zap } from "lucide-react";
import type { ReactNode } from "react";
import type { DaniellBuildState, DaniellPhase } from "@/components/labs/daniell-cell/daniellCellTypes";
import { calculateProgressFromSteps, getPhaseStep } from "@/components/labs/daniell-cell/daniellCellLogic";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";

const phaseLabels: Record<DaniellPhase, string> = {
  cinematic_intro: "Mission briefing",
  setup_cell: "Build half-cells",
  connect_circuit: "Connect circuit",
  add_salt_bridge: "Balance charge",
  start_reaction: "Start cell",
  observe_flow: "Observe flow",
  challenge: "Boss check",
  explanation: "Explain evidence",
  reward: "Reward",
};

export function DaniellCellHUD({
  phase,
  buildState,
  voltage,
  xp,
}: {
  phase: DaniellPhase;
  buildState: DaniellBuildState;
  voltage: number;
  xp: number;
}) {
  const step = getPhaseStep(phase, buildState);
  const progress = calculateProgressFromSteps(buildState, phase);

  return (
    <div className="absolute left-3 right-3 top-3 z-20 grid gap-3 rounded-[1.5rem] border border-white/45 bg-slate-950/55 p-3 text-white shadow-2xl backdrop-blur-md lg:grid-cols-[1fr_auto_auto_auto] lg:items-center">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="cyan" className="border-cyan-200 bg-cyan-100/95 text-cyan-900">
            Daniell Cell Studio
          </Badge>
          <span className="rounded-full bg-white/12 px-3 py-1 text-xs font-black text-cyan-50">
            Step {step}/9
          </span>
        </div>
        <p className="mt-2 text-sm font-black text-white">{phaseLabels[phase]}</p>
        <div className="mt-2 max-w-md">
          <Progress value={progress} label="Lab progress" />
        </div>
      </div>

      <HudPill icon={<Gauge className="h-4 w-4" aria-hidden="true" />} label="Voltage" value={`${voltage.toFixed(2)} V`} tone="cyan" />
      <HudPill icon={<Sparkles className="h-4 w-4" aria-hidden="true" />} label="XP" value={`${xp}`} tone="amber" />
      <HudPill icon={<BatteryCharging className="h-4 w-4" aria-hidden="true" />} label="Cell" value={buildState.cellStarted ? "Active" : "Building"} tone="lime" />
    </div>
  );
}

function HudPill({
  icon,
  label,
  value,
  tone,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  tone: "cyan" | "amber" | "lime";
}) {
  const toneClass = {
    cyan: "from-cyan-300/25 to-blue-400/20 text-cyan-50",
    amber: "from-amber-300/25 to-orange-400/20 text-amber-50",
    lime: "from-lime-300/25 to-emerald-400/20 text-lime-50",
  }[tone];

  return (
    <div className={`flex items-center gap-3 rounded-2xl border border-white/20 bg-gradient-to-br px-3 py-2 shadow-lg ${toneClass}`}>
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/16 text-white">
        {icon}
      </span>
      <div>
        <p className="text-[0.65rem] font-black uppercase tracking-[0.18em] text-white/65">{label}</p>
        <p className="text-base font-black text-white">{value}</p>
      </div>
      {tone === "cyan" ? <Zap className="h-4 w-4 text-cyan-200" aria-hidden="true" /> : null}
    </div>
  );
}
