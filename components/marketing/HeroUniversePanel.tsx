"use client";

import { motion, useReducedMotion } from "framer-motion";
import { BatteryCharging, CheckCircle2, Trophy, Zap } from "lucide-react";
import Image from "next/image";
import { AchievementBadge } from "@/components/gamification/AchievementBadge";
import { LevelBadge } from "@/components/gamification/LevelBadge";
import { labSceneAssets } from "@/components/labs/labAssets";
import { XpBar } from "@/components/gamification/XpBar";
import { MasterAlchem } from "@/components/master-alchem/MasterAlchem";

const bubbles = [
  { text: "H", className: "left-5 top-10 bg-cyan-200 text-cyan-800" },
  { text: "O", className: "right-8 top-16 bg-rose-200 text-rose-800" },
  { text: "Na+", className: "left-14 bottom-20 bg-lime-200 text-lime-800" },
  { text: "Cl-", className: "right-16 bottom-10 bg-violet-200 text-violet-800" },
];

export function HeroUniversePanel() {
  const reduced = useReducedMotion();

  return (
    <div className="relative min-h-[520px] overflow-hidden rounded-[2.5rem] border-4 border-white bg-gradient-to-br from-sky-100 via-white to-fuchsia-100 p-5 shadow-2xl">
      <Image
        src={labSceneAssets.magicalLabBackground}
        alt=""
        fill
        priority
        sizes="(min-width: 1024px) 54vw, 100vw"
        className="object-cover opacity-35"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-sky-100/30 to-fuchsia-100/70" />
      <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-fuchsia-300/55 blur-3xl" />
      <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-lime-300/55 blur-3xl" />

      {bubbles.map((bubble, index) => (
        <motion.div
          key={bubble.text}
          className={`absolute grid h-14 w-14 place-items-center rounded-full border-4 border-white text-lg font-black shadow-lg ${bubble.className}`}
          animate={reduced ? undefined : { y: [0, -12, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 4 + index * 0.4, repeat: Infinity, ease: "easeInOut" }}
        >
          {bubble.text}
        </motion.div>
      ))}

      <div className="relative mx-auto mt-4 grid h-72 w-72 place-items-center sm:h-80 sm:w-80">
        <motion.div
          className="absolute h-64 w-64 rounded-full border-4 border-dashed border-blue-300 sm:h-72 sm:w-72"
          animate={reduced ? undefined : { rotate: 360 }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute h-44 w-44 rounded-full border-4 border-dashed border-violet-300 sm:h-52 sm:w-52"
          animate={reduced ? undefined : { rotate: -360 }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
        />
        <div className="z-10 grid h-44 w-44 place-items-center rounded-[2rem] border-4 border-white bg-white/80 shadow-2xl backdrop-blur-sm sm:h-52 sm:w-52">
          <BatteryCharging className="h-20 w-20 text-blue-600" aria-hidden="true" />
        </div>
        <div className="absolute right-4 top-16 h-5 w-5 rounded-full bg-blue-500 shadow-lg" />
        <div className="absolute bottom-12 left-8 h-4 w-4 rounded-full bg-fuchsia-500 shadow-lg" />
        <div className="absolute left-12 top-8 h-3.5 w-3.5 rounded-full bg-lime-500 shadow-lg" />
      </div>

      <div className="relative mt-2 grid gap-4 md:grid-cols-[1fr_0.9fr]">
        <div className="rounded-[1.5rem] border-2 border-white bg-white/85 p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <MasterAlchem mood="guide" size="xs" showGlow={false} className="shrink-0" />
            <div>
              <p className="text-sm font-black text-violet-700">Chem-Shastri</p>
              <p className="text-sm font-bold text-slate-700">
                “Great prediction. Want a hint, lab guide, or full step?”
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <LevelBadge level={4} title="Atom Explorer" />
          <AchievementBadge
            title="Atom Built!"
            detail="+80 XP unlocked"
            icon={<Trophy className="h-6 w-6 text-amber-500" aria-hidden="true" />}
          />
        </div>
      </div>

      <div className="relative mt-4">
        <XpBar xp={740} nextLevelXp={1000} />
      </div>

      <div className="relative mt-4 flex items-center justify-between rounded-[1.5rem] bg-white/80 p-4 shadow">
        <div className="flex items-center gap-2 text-sm font-black text-slate-700">
          <CheckCircle2 className="h-5 w-5 text-lime-600" aria-hidden="true" />
          Atom Built achievement
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-lime-200 px-3 py-1 text-xs font-black text-lime-800">
          <Zap className="h-3.5 w-3.5 fill-lime-700" aria-hidden="true" />
          Streak saved
        </span>
      </div>
    </div>
  );
}
