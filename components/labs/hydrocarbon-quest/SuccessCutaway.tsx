"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, BadgeCheck, Flame, Sparkles, Trophy } from "lucide-react";
import { CinematicStage } from "@/components/labs/hydrocarbon-quest/CinematicStage";
import { finalBadgeScene, portalScene, puzzleScene, stageAreaStyle } from "@/components/labs/hydrocarbon-quest/sceneLayouts";
import type { HydrocarbonLevel } from "@/components/labs/hydrocarbon-quest/hydrocarbonQuestTypes";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function SuccessCutaway({
  level,
  totalXp,
  finalLevel,
  onContinue,
}: {
  level: HydrocarbonLevel;
  totalXp: number;
  finalLevel: boolean;
  onContinue: () => void;
}) {
  const reduced = useReducedMotion();
  const layout = finalLevel ? finalBadgeScene : level.successKind === "flame" ? portalScene : puzzleScene;
  const resultArea = level.successKind === "flame"
    ? { x: 620, y: 190, width: 700, height: 540 }
    : { x: 560, y: 170, width: 820, height: 560 };

  return (
    <section className="relative min-h-[calc(100svh-5rem)] overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 py-3 text-white">
      <CinematicStage
        layout={layout}
        showCharacters={false}
        kabirPose="success"
        aparnaPose="celebrating"
        activeSpeaker="Aparna"
        particleTone={level.successKind === "flame" ? "gold" : "violet"}
        hud={
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.25rem] border border-white/25 bg-slate-950/45 px-4 py-3 text-white shadow-xl backdrop-blur-md">
            <div>
              <Badge tone="green">Level complete</Badge>
              <h1 className="mt-2 text-xl font-black sm:text-3xl">{level.targetName} locked</h1>
            </div>
            <div className="rounded-full bg-amber-200 px-4 py-2 text-sm font-black text-amber-900 shadow-lg">Total XP {totalXp}</div>
          </div>
        }
        dialogue={
          <div className="rounded-[1.35rem] border-2 border-white bg-white/92 p-4 text-slate-950 shadow-2xl backdrop-blur-md">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-lime-100 text-lime-700">
                  <BadgeCheck className="h-6 w-6" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-black text-slate-950">{finalLevel ? "Hydrocarbon Name Master" : "Ready for the next family?"}</p>
                  <p className="text-xs font-bold text-slate-600">Mistakes became clues. The name is now yours.</p>
                </div>
              </div>
              <Button onClick={onContinue} icon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}>
                {finalLevel ? "See final badge" : "Next level"}
              </Button>
            </div>
          </div>
        }
      >
        <SuccessParticles />
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.96 }}
          animate={reduced ? { opacity: 1, y: 0, scale: 1 } : { opacity: 1, y: 0, scale: 1 }}
          className="absolute z-30 overflow-hidden rounded-[2rem] border-2 border-white bg-white/92 p-5 text-slate-950 shadow-2xl backdrop-blur-md"
          style={stageAreaStyle(resultArea)}
        >
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-cyan-300/45 blur-3xl" />
          {level.successKind === "flame" ? <BlueFlame /> : level.successKind === "badge" ? <FinalBadge /> : <ChainGlow />}
          <div className="relative mt-5">
            <Badge tone={finalLevel ? "amber" : "green"}>{finalLevel ? "Final mastery" : `+${level.xp} XP`}</Badge>
            <h2 className="mt-3 text-2xl font-black text-slate-950">{level.successMessage}</h2>
            <p className="mt-3 text-sm font-bold leading-6 text-slate-700">
              You used the family-name rule: side branch first, main chain in the middle, bond family as the surname.
            </p>
          </div>
        </motion.div>
      </CinematicStage>
    </section>
  );
}

function BlueFlame() {
  return (
    <div className="relative mx-auto grid h-56 w-full max-w-md place-items-end overflow-hidden rounded-[1.7rem] bg-gradient-to-b from-slate-900 via-blue-950 to-slate-950 p-6 shadow-inner">
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-cyan-500/30 to-transparent" />
      <motion.div
        className="relative h-36 w-28 rounded-t-full bg-gradient-to-t from-blue-500 via-cyan-200 to-white shadow-[0_0_60px_rgba(56,189,248,0.95)]"
        animate={{ scaleY: [0.82, 1.08, 0.9, 1.02], scaleX: [0.95, 1.08, 0.9, 1] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div
          className="absolute bottom-0 left-1/2 h-28 w-16 -translate-x-1/2 rounded-t-full bg-gradient-to-t from-violet-500 via-blue-200 to-white"
          animate={{ scaleY: [0.86, 1.18, 0.9], opacity: [0.75, 1, 0.8] }}
          transition={{ duration: 0.62, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
      <div className="mt-4 flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-black text-cyan-50">
        <Flame className="h-4 w-4 text-cyan-200" aria-hidden="true" />
        Butane connects naming to a real cooking flame.
      </div>
    </div>
  );
}

function ChainGlow() {
  return (
    <div className="relative mx-auto flex h-52 max-w-lg items-center justify-center rounded-[1.7rem] bg-gradient-to-br from-lime-100 via-white to-cyan-100 shadow-inner">
      {Array.from({ length: 6 }).map((_, index) => (
        <motion.div
          key={index}
          className={cn("h-14 w-14 rounded-full border-4 border-white bg-gradient-to-br from-lime-300 to-cyan-300 shadow-xl", index === 1 && "bg-gradient-to-br from-violet-300 to-fuchsia-300")}
          animate={{ y: [0, -12, 0], scale: [1, 1.06, 1] }}
          transition={{ duration: 1.8 + index * 0.08, repeat: Infinity, ease: "easeInOut" }}
          style={{ marginLeft: index === 0 ? 0 : -6 }}
        />
      ))}
      <div className="absolute bottom-5 rounded-full bg-white/85 px-4 py-2 text-sm font-black text-lime-800 shadow-lg">
        The longest family line wins.
      </div>
    </div>
  );
}

function FinalBadge() {
  return (
    <div className="relative mx-auto grid h-56 max-w-md place-items-center rounded-[1.7rem] bg-gradient-to-br from-amber-100 via-white to-fuchsia-100 shadow-inner">
      <motion.div
        className="grid h-36 w-36 place-items-center rounded-[2rem] border-4 border-white bg-gradient-to-br from-amber-300 via-yellow-200 to-cyan-300 text-amber-900 shadow-2xl"
        animate={{ rotate: [0, -4, 4, 0], scale: [1, 1.06, 1] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Trophy className="h-16 w-16" aria-hidden="true" />
      </motion.div>
      <div className="absolute bottom-5 rounded-full bg-slate-950 px-4 py-2 text-sm font-black text-white shadow-lg">
        Hydrocarbon Name Master
      </div>
    </div>
  );
}

function SuccessParticles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 26 }).map((_, index) => (
        <motion.span
          key={index}
          className="absolute h-2 w-2 rounded-full bg-amber-200 shadow-[0_0_18px_rgba(250,204,21,0.85)]"
          style={{
            left: `${5 + ((index * 19) % 92)}%`,
            top: `${8 + ((index * 23) % 82)}%`,
          }}
          animate={{ y: [0, -30, 0], opacity: [0.15, 0.9, 0.15], scale: [0.6, 1.5, 0.6] }}
          transition={{ duration: 2.7 + index * 0.06, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
      <Sparkles className="absolute left-[12%] top-[18%] h-9 w-9 text-cyan-200 opacity-80" aria-hidden="true" />
      <Sparkles className="absolute right-[16%] top-[24%] h-7 w-7 text-amber-200 opacity-80" aria-hidden="true" />
    </div>
  );
}
