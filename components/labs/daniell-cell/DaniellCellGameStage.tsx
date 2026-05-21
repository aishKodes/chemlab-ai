"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BatteryCharging, MoveRight, Waves, Zap } from "lucide-react";
import type { ReactNode } from "react";
import { DaniellCellHUD } from "@/components/labs/daniell-cell/DaniellCellHUD";
import { DaniellCellPixiScene } from "@/components/labs/daniell-cell/DaniellCellPixiScene";
import type { DaniellBuildState, DaniellPhase } from "@/components/labs/daniell-cell/daniellCellTypes";
import { getCellNotation, getOverallReaction, getOxidationHalfReaction, getReductionHalfReaction } from "@/components/labs/daniell-cell/daniellCellLogic";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

export function DaniellCellGameStage({
  phase,
  buildState,
  reactionProgress,
  voltage,
  xp,
  showHud = true,
}: {
  phase: DaniellPhase;
  buildState: DaniellBuildState;
  reactionProgress: number;
  voltage: number;
  xp: number;
  showHud?: boolean;
}) {
  const reducedMotion = Boolean(useReducedMotion());
  const active = buildState.cellStarted;
  const showAnode = active || phase === "challenge" || phase === "explanation" || phase === "reward";
  const showFinal = phase === "explanation" || phase === "reward";

  return (
    <section
      className="relative h-full min-h-[25rem] overflow-hidden rounded-[2rem] bg-slate-950"
      aria-label="Animated Daniell cell lab scene"
    >
      <DaniellCellPixiScene
        snapshot={{
          phase,
          buildState,
          reactionProgress,
          voltage,
          reducedMotion,
        }}
      />
      {showHud ? <DaniellCellHUD phase={phase} buildState={buildState} voltage={voltage} xp={xp} /> : null}

      <div className="pointer-events-none absolute inset-x-4 bottom-4 z-20 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <StageNote />
        <AnimatePresence>
          {showFinal ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              className="rounded-[1.4rem] border border-white/30 bg-white/92 p-4 text-slate-950 shadow-2xl backdrop-blur-md lg:max-w-md"
            >
              <Badge tone="green">Cell Summary</Badge>
              <div className="mt-3 grid gap-2 text-sm font-black">
                <Fact label="Overall reaction" value={getOverallReaction()} />
                <Fact label="Cell notation" value={getCellNotation()} />
                <Fact label="Voltage" value="about 1.10 V" />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showAnode ? (
          <>
            <StageLabel
              className="left-[7%] top-[44%]"
              tone="blue"
              icon={<Zap className="h-4 w-4" aria-hidden="true" />}
              title="Oxidation at anode"
              detail={getOxidationHalfReaction()}
            />
            <StageLabel
              className="right-[7%] top-[44%]"
              tone="amber"
              icon={<BatteryCharging className="h-4 w-4" aria-hidden="true" />}
              title="Reduction at cathode"
              detail={getReductionHalfReaction()}
            />
            <StageLabel
              className="left-1/2 top-[31%] -translate-x-1/2"
              tone="cyan"
              icon={<MoveRight className="h-4 w-4" aria-hidden="true" />}
              title="Electron flow"
              detail="Zinc → Copper"
            />
          </>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {buildState.saltBridgeAdded ? (
          <StageLabel
            className="left-1/2 top-[55%] -translate-x-1/2"
            tone="lime"
            icon={<Waves className="h-4 w-4" aria-hidden="true" />}
            title="Salt bridge"
            detail="Ions balance charge"
          />
        ) : null}
      </AnimatePresence>
    </section>
  );
}

function StageNote() {
  return (
    <div className="rounded-full border border-white/25 bg-slate-950/50 px-4 py-2 text-xs font-black text-cyan-50 shadow-lg backdrop-blur-md">
      Model view: particles are enlarged so you can see the process.
    </div>
  );
}

function StageLabel({
  className,
  title,
  detail,
  icon,
  tone,
}: {
  className: string;
  title: string;
  detail: string;
  icon: ReactNode;
  tone: "blue" | "amber" | "cyan" | "lime";
}) {
  const toneClass = {
    blue: "border-blue-200/70 bg-blue-950/72 text-blue-50",
    amber: "border-amber-200/70 bg-amber-950/72 text-amber-50",
    cyan: "border-cyan-200/70 bg-cyan-950/72 text-cyan-50",
    lime: "border-lime-200/70 bg-lime-950/72 text-lime-50",
  }[tone];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.98 }}
      className={cn("pointer-events-none absolute z-30 hidden rounded-[1rem] border px-3 py-2 shadow-xl backdrop-blur-md md:block", toneClass, className)}
    >
      <div className="flex items-center gap-2">
        {icon}
        <p className="text-xs font-black">{title}</p>
      </div>
      <p className="mt-1 text-[0.7rem] font-bold opacity-90">{detail}</p>
    </motion.div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 px-3 py-2">
      <span className="text-slate-500">{label}</span>
      <span className="text-right text-slate-950">{value}</span>
    </div>
  );
}
