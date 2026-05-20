"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Beaker, Droplets, Flame, Gauge, RotateCcw, Sparkles } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";
import { useId, useMemo, useState } from "react";
import { AchievementBadge } from "@/components/gamification/AchievementBadge";
import { labSceneAssets } from "@/components/labs/labAssets";
import { MasterAlchem } from "@/components/master-alchem/MasterAlchem";
import type { MasterAlchemMood } from "@/components/master-alchem/MasterAlchemMood";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import { cn } from "@/lib/utils";

type Phase = "intro" | "prepare" | "acid" | "indicator" | "base" | "neutral" | "evaporate" | "check" | "reward";

const missionSteps = [
  "Add acid to the clean beaker.",
  "Add indicator to reveal pH changes.",
  "Add base slowly until the colour turns green.",
  "Evaporate the neutral solution to reveal salt.",
  "Answer the final check to claim the badge.",
];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function formatPH(value: number) {
  return value.toFixed(1);
}

export function NeutralizationStudio() {
  const [acidVolume, setAcidVolume] = useState(0);
  const [baseVolume, setBaseVolume] = useState(0);
  const [indicatorAdded, setIndicatorAdded] = useState(false);
  const [evaporated, setEvaporated] = useState(false);
  const [answered, setAnswered] = useState(false);

  const state = useMemo(() => {
    const hasLiquid = acidVolume > 0 || baseVolume > 0;
    const neutral = acidVolume > 0 && baseVolume > 0 && Math.abs(acidVolume - baseVolume) <= 5;
    const rawPH = !hasLiquid
      ? 7
      : acidVolume > 0 && baseVolume === 0
        ? 2.2
        : baseVolume > 0 && acidVolume === 0
          ? 12
          : 7 + (baseVolume - acidVolume) / 16;
    const ph = neutral ? 7 : clamp(rawPH, 1.5, 12.5);
    const phase: Phase = answered
      ? "reward"
      : evaporated
        ? "check"
        : neutral
          ? "neutral"
          : baseVolume > 0
            ? "base"
            : indicatorAdded
              ? "indicator"
              : acidVolume > 0
                ? "acid"
                : "intro";

    const liquidClass = evaporated
      ? "from-amber-100/50 via-amber-200/30 to-transparent"
      : !indicatorAdded
        ? "from-sky-300/80 via-cyan-300/70 to-blue-300/70"
        : ph < 5
          ? "from-rose-500/85 via-orange-400/80 to-amber-300/70"
          : ph < 6.7
            ? "from-orange-400/80 via-yellow-300/75 to-amber-200/70"
            : ph > 7.3
              ? "from-blue-500/80 via-violet-500/75 to-fuchsia-400/70"
              : "from-emerald-400/90 via-lime-300/85 to-teal-300/80";

    const progressByPhase: Record<Phase, number> = {
      intro: 4,
      prepare: 10,
      acid: 22,
      indicator: 40,
      base: 62,
      neutral: 78,
      evaporate: 88,
      check: 94,
      reward: 100,
    };

    const mood: MasterAlchemMood = answered
      ? "celebrating"
      : baseVolume > acidVolume + 18
        ? "warning"
        : neutral
          ? "thinking"
          : "labGuide";

    const message = answered
      ? "Salt Maker badge unlocked. You found the products of neutralization."
      : evaporated
        ? "The water is gone. The salt remains. What did acid and base produce?"
        : neutral
          ? "That green glow is your neutral point. Now evaporate to reveal the salt."
          : baseVolume > acidVolume + 18
            ? "Slow down. Too much base makes the mixture alkaline again."
            : indicatorAdded
              ? "Add base drop by drop. Watch the pH move toward 7."
              : acidVolume > 0
                ? "Now add the indicator. It will make the invisible pH visible."
                : "Today we'll discover how a salt is born.";

    return {
      neutral,
      phase,
      ph,
      liquidClass,
      progress: progressByPhase[phase],
      mood,
      message,
    };
  }, [acidVolume, answered, baseVolume, evaporated, indicatorAdded]);

  function resetLab() {
    setAcidVolume(0);
    setBaseVolume(0);
    setIndicatorAdded(false);
    setEvaporated(false);
    setAnswered(false);
  }

  return (
    <div className="space-y-6">
      <Card className="relative overflow-hidden bg-gradient-to-br from-cyan-50 via-white to-violet-100 p-0">
        <Image src={labSceneAssets.magicalLabBackground} alt="" fill sizes="100vw" className="object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/88 via-cyan-50/82 to-violet-100/86" />
        <div className="relative grid gap-6 p-5 lg:grid-cols-[1fr_auto] lg:p-7">
          <div>
            <Badge tone="cyan">Featured Lab</Badge>
            <h2 className="mt-4 text-4xl font-black leading-tight text-slate-950 sm:text-5xl">
              Neutralization Studio
            </h2>
            <p className="mt-4 max-w-3xl text-base font-semibold leading-7 text-slate-700">
              Mix acid and base, watch pH shift, find the neutral point, then
              reveal salt crystals from the solution.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
              {missionSteps.map((step, index) => (
                <div
                  key={step}
                  className={cn(
                    "rounded-3xl border-2 border-white bg-white/78 p-3 text-sm font-black leading-5 text-slate-700 shadow-sm",
                    state.progress >= (index + 1) * 18 && "bg-lime-50 text-lime-900",
                  )}
                >
                  <span className="mb-2 inline-grid h-7 w-7 place-items-center rounded-full bg-blue-100 text-blue-700">
                    {index + 1}
                  </span>
                  {step}
                </div>
              ))}
            </div>
          </div>
          <MasterAlchem mood={state.mood} size="lg" showBubble message={state.message} className="mx-auto" />
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="relative min-h-[720px] overflow-hidden bg-slate-950 p-0 text-white">
          <Image src={labSceneAssets.virtualLabBench} alt="" fill sizes="(min-width: 1280px) 62vw, 100vw" className="object-cover opacity-55" />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/60 via-blue-950/35 to-violet-950/55" />
          <div className="relative flex min-h-[720px] flex-col p-5 sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <Badge tone={state.neutral ? "green" : "amber"}>
                  {state.neutral ? "Neutral point found" : "Find pH 7"}
                </Badge>
                <h3 className="mt-3 text-3xl font-black">HCl + NaOH Lab Bench</h3>
                <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-cyan-50/90">
                  The goal is simple: make the mixture neutral, then separate the salt.
                </p>
              </div>
              <div aria-live="polite" className="rounded-3xl border border-white/20 bg-white/15 px-4 py-3 shadow-lg backdrop-blur">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-cyan-100">
                  <Gauge className="h-4 w-4" aria-hidden="true" />
                  pH meter
                </div>
                <p className="text-4xl font-black text-white">{formatPH(state.ph)}</p>
              </div>
            </div>

            <div className="mt-8 grid flex-1 items-end gap-5 lg:grid-cols-[0.75fr_1.28fr_0.75fr]">
              <div className="space-y-5">
                <LabVessel title="Acid beaker" subtitle={`${acidVolume} mL HCl`}>
                  <BeakerIllustration liquid="from-rose-400 to-orange-300" level={acidVolume / 100} />
                </LabVessel>
                <LabVessel title="Indicator" subtitle={indicatorAdded ? "In the beaker" : "Ready"}>
                  <IndicatorBottle />
                </LabVessel>
              </div>

              <div className="relative mx-auto w-full max-w-[33rem]">
                <div className="absolute -left-8 bottom-12 hidden h-14 w-24 rounded-full bg-cyan-200/25 blur-2xl sm:block" />
                <MixingBeaker
                  liquidClass={state.liquidClass}
                  liquidLevel={acidVolume || baseVolume ? 0.62 : 0.04}
                  neutral={state.neutral}
                  evaporated={evaporated}
                />
                <AnimatePresence>
                  {evaporated ? (
                    <motion.div
                      className="absolute bottom-8 left-1/2 -translate-x-1/2"
                      initial={{ opacity: 0, scale: 0.7, y: 24 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.7 }}
                    >
                      <SaltCrystals />
                    </motion.div>
                  ) : null}
                </AnimatePresence>
                <div className="mt-5 rounded-[1.5rem] border border-white/20 bg-white/12 p-4 text-center shadow-lg backdrop-blur">
                  <p className="text-sm font-black text-cyan-100">Reaction unlock</p>
                  <AnimatePresence mode="wait">
                    {state.neutral || evaporated || answered ? (
                      <motion.div
                        key="equation"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                      >
                        <p className="mt-2 text-2xl font-black text-white">HCl + NaOH → NaCl + H₂O</p>
                        <p className="mt-1 text-sm font-bold text-lime-100">Acid + base → salt + water</p>
                      </motion.div>
                    ) : (
                      <motion.p
                        key="hidden"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="mt-2 text-sm font-bold text-white/80"
                      >
                        Reach the neutral point to reveal the reaction.
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="space-y-5">
                <LabVessel title="Base beaker" subtitle={`${baseVolume} mL NaOH`}>
                  <BeakerIllustration liquid="from-sky-400 to-violet-400" level={baseVolume / 120} />
                </LabVessel>
                <LabVessel title="Evaporation dish" subtitle={state.neutral ? "Ready" : "Locked"}>
                  <EvaporationDish active={state.neutral} crystals={evaporated} />
                </LabVessel>
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-white via-lime-50 to-cyan-50">
            <div className="flex items-center justify-between gap-3">
              <div>
                <Badge tone="blue">Your lab actions</Badge>
                <h3 className="mt-3 text-2xl font-black text-slate-950">Run the reaction</h3>
              </div>
              <Button variant="ghost" size="sm" icon={<RotateCcw className="h-4 w-4" aria-hidden="true" />} onClick={resetLab}>
                Reset
              </Button>
            </div>

            <div className="mt-5 grid gap-3">
              <Button icon={<Beaker className="h-4 w-4" aria-hidden="true" />} onClick={() => setAcidVolume((value) => Math.min(value + 50, 100))}>
                Add acid
              </Button>
              <Button
                variant="secondary"
                icon={<Droplets className="h-4 w-4" aria-hidden="true" />}
                disabled={acidVolume === 0 || indicatorAdded}
                onClick={() => setIndicatorAdded(true)}
              >
                Add indicator
              </Button>
              <Button
                variant="secondary"
                icon={<Beaker className="h-4 w-4" aria-hidden="true" />}
                disabled={!indicatorAdded}
                onClick={() => setBaseVolume((value) => Math.min(value + 40, 120))}
              >
                Add base
              </Button>
              <Button
                variant="ghost"
                icon={<Droplets className="h-4 w-4" aria-hidden="true" />}
                disabled={!indicatorAdded}
                onClick={() => setBaseVolume((value) => Math.min(value + 5, 120))}
              >
                Add base dropwise
              </Button>
              <Button
                variant={state.neutral ? "primary" : "ghost"}
                icon={<Flame className="h-4 w-4" aria-hidden="true" />}
                disabled={!state.neutral || evaporated}
                onClick={() => setEvaporated(true)}
              >
                Evaporate
              </Button>
            </div>

            <div className="mt-6">
              <Progress value={state.progress} label="Lab mastery" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-violet-100 via-white to-amber-100">
            <Badge tone={state.neutral ? "green" : "amber"}>Observation notebook</Badge>
            <div className="mt-4 space-y-3 text-sm font-semibold leading-6 text-slate-700">
              <p>Acid: <strong>{acidVolume} mL HCl</strong></p>
              <p>Base: <strong>{baseVolume} mL NaOH</strong></p>
              <p>Indicator: <strong>{indicatorAdded ? "colour evidence active" : "not added yet"}</strong></p>
              <p>
                Claim:{" "}
                <strong>
                  {answered
                    ? "Salt and water are the products."
                    : evaporated
                      ? "Crystals appeared after evaporation."
                      : state.neutral
                        ? "The solution is neutral."
                        : state.ph < 7
                          ? "The solution is acidic."
                          : state.ph > 7
                            ? "The solution is basic."
                            : "The beaker is ready."}
                </strong>
              </p>
            </div>
          </Card>

          {evaporated ? (
            <Card className="bg-gradient-to-br from-white via-emerald-50 to-lime-100">
              <Badge tone="green">Final check</Badge>
              <h3 className="mt-3 text-xl font-black text-slate-950">
                What are the products of neutralization?
              </h3>
              <div className="mt-4 grid gap-3">
                <button
                  className="focus-ring rounded-2xl border-2 border-emerald-200 bg-white px-4 py-3 text-left text-sm font-black text-slate-800 transition hover:-translate-y-0.5 hover:bg-emerald-50"
                  onClick={() => setAnswered(true)}
                >
                  Salt and water
                </button>
                <button className="focus-ring rounded-2xl border-2 border-rose-200 bg-white px-4 py-3 text-left text-sm font-black text-slate-800 transition hover:bg-rose-50">
                  Acid and oxygen
                </button>
              </div>
            </Card>
          ) : null}

          <AnimatePresence>
            {answered ? (
              <motion.div initial={{ opacity: 0, y: 18, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 18, scale: 0.96 }}>
                <AchievementBadge
                  title="Salt Maker"
                  detail="+260 XP, Acid-Base Lagoon unlocked"
                  icon={<Sparkles className="h-6 w-6 text-amber-500" aria-hidden="true" />}
                  className="w-full"
                />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function LabVessel({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="rounded-[1.8rem] border border-white/20 bg-white/15 p-4 text-center shadow-xl backdrop-blur">
      <div className="mx-auto grid h-44 place-items-center">{children}</div>
      <p className="mt-3 text-sm font-black text-white">{title}</p>
      <p className="text-xs font-bold text-cyan-100">{subtitle}</p>
    </div>
  );
}

function BeakerIllustration({ liquid, level }: { liquid: string; level: number }) {
  const safeLevel = clamp(level, 0, 1);
  const clipId = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 150 170" className="h-40 w-36 drop-shadow-2xl" role="img" aria-label="Beaker">
      <path d="M45 13 H105" stroke="white" strokeWidth="7" strokeLinecap="round" opacity="0.9" />
      <path d="M52 18 V48 L27 137 C24 150 34 160 48 160 H102 C116 160 126 150 123 137 L98 48 V18" fill="rgba(255,255,255,0.16)" stroke="white" strokeWidth="6" strokeLinejoin="round" />
      <clipPath id={`beaker-clip-${clipId}`}>
        <path d="M52 48 L29 137 C26 149 35 157 49 157 H101 C115 157 124 149 121 137 L98 48 Z" />
      </clipPath>
      <g clipPath={`url(#beaker-clip-${clipId})`}>
        <rect x="29" y={157 - safeLevel * 96} width="92" height={safeLevel * 96} className={cn("fill-current text-cyan-300")} opacity="0.35" />
        <rect x="29" y={157 - safeLevel * 96} width="92" height={safeLevel * 96} className={cn("fill-current", liquid.includes("rose") ? "text-rose-300" : "text-sky-300")} opacity="0.72" />
        <path d="M31 114 C52 104 72 126 95 115 C111 108 119 112 122 116 V160 H29 V116 Z" className={liquid.includes("rose") ? "fill-rose-300" : "fill-sky-300"} opacity="0.62" />
      </g>
      <path d="M47 80 H64 M43 100 H59 M39 120 H56" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.65" />
    </svg>
  );
}

function IndicatorBottle() {
  return (
    <svg viewBox="0 0 140 170" className="h-40 w-32 drop-shadow-2xl" role="img" aria-label="Indicator bottle">
      <path d="M54 16 H86 V44 H54 Z" fill="#a78bfa" stroke="white" strokeWidth="5" />
      <path d="M44 43 H96 L110 143 C112 156 103 164 90 164 H50 C37 164 28 156 30 143 Z" fill="rgba(255,255,255,0.18)" stroke="white" strokeWidth="6" />
      <path d="M38 112 C55 103 78 122 101 110 L107 145 C109 154 101 160 90 160 H50 C39 160 31 154 33 145 Z" fill="#d946ef" opacity="0.75" />
      <rect x="45" y="74" width="50" height="28" rx="8" fill="white" opacity="0.86" />
      <path d="M55 88 H85" stroke="#7c3aed" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

function MixingBeaker({ liquidClass, liquidLevel, neutral, evaporated }: { liquidClass: string; liquidLevel: number; neutral: boolean; evaporated: boolean }) {
  return (
    <div className="relative mx-auto h-[24rem] w-[22rem] max-w-full">
      <svg viewBox="0 0 360 390" className="h-full w-full drop-shadow-2xl" role="img" aria-label="Mixing beaker">
        <path d="M108 18 H252" stroke="white" strokeWidth="12" strokeLinecap="round" opacity="0.96" />
        <path d="M122 26 V96 L69 312 C63 338 82 360 110 360 H250 C278 360 297 338 291 312 L238 96 V26" fill="rgba(255,255,255,0.16)" stroke="white" strokeWidth="10" strokeLinejoin="round" />
        <clipPath id="mixing-beaker-liquid">
          <path d="M122 96 L72 312 C66 336 84 354 111 354 H249 C276 354 294 336 288 312 L238 96 Z" />
        </clipPath>
        <g clipPath="url(#mixing-beaker-liquid)">
          <foreignObject x="72" y={354 - liquidLevel * 210} width="216" height={liquidLevel * 210}>
            <div className={cn("h-full w-full bg-gradient-to-br", liquidClass)} />
          </foreignObject>
          {neutral ? (
            <circle cx="180" cy="250" r="92" fill="#a3e635" opacity="0.18" />
          ) : null}
          {evaporated ? (
            <g opacity="0.76">
              <path d="M138 166 C118 138 161 128 141 99" stroke="white" strokeWidth="7" strokeLinecap="round" fill="none" />
              <path d="M182 158 C159 126 205 118 184 86" stroke="white" strokeWidth="7" strokeLinecap="round" fill="none" />
              <path d="M222 170 C199 140 243 132 223 102" stroke="white" strokeWidth="7" strokeLinecap="round" fill="none" />
            </g>
          ) : null}
        </g>
        <path d="M119 146 H152 M111 190 H145 M101 234 H136" stroke="white" strokeWidth="5" strokeLinecap="round" opacity="0.7" />
      </svg>
    </div>
  );
}

function EvaporationDish({ active, crystals }: { active: boolean; crystals: boolean }) {
  return (
    <svg viewBox="0 0 170 150" className="h-40 w-40 drop-shadow-2xl" role="img" aria-label="Evaporation dish">
      <ellipse cx="85" cy="80" rx="64" ry="24" fill="rgba(255,255,255,0.25)" stroke="white" strokeWidth="6" />
      <path d="M24 80 C33 124 137 124 146 80" fill="rgba(255,255,255,0.12)" stroke="white" strokeWidth="6" />
      <rect x="38" y="118" width="94" height="15" rx="7" fill={active ? "#facc15" : "#94a3b8"} opacity="0.85" />
      {crystals ? (
        <g fill="#fef3c7" stroke="#f59e0b" strokeWidth="2">
          <path d="M64 76 L76 56 L89 77 Z" />
          <path d="M88 80 L101 57 L115 82 Z" />
          <path d="M75 88 L86 70 L98 90 Z" />
        </g>
      ) : null}
    </svg>
  );
}

function SaltCrystals() {
  return (
    <svg viewBox="0 0 180 130" className="h-32 w-44 drop-shadow-2xl" role="img" aria-label="Salt crystals">
      <g fill="#fefce8" stroke="#f59e0b" strokeWidth="3">
        <path d="M30 102 L55 58 L82 103 Z" />
        <path d="M75 102 L104 42 L136 103 Z" />
        <path d="M112 104 L137 65 L160 104 Z" />
        <path d="M53 110 L73 78 L96 112 Z" />
      </g>
      <path d="M22 112 C58 122 119 123 165 112" stroke="white" strokeWidth="8" strokeLinecap="round" opacity="0.75" />
    </svg>
  );
}
