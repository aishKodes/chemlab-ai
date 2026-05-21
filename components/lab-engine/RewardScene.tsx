"use client";

import { motion } from "framer-motion";
import { RotateCcw, Sparkles, Trophy } from "lucide-react";
import type { LabReward } from "@/components/lab-engine/labTypes";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export function RewardScene({ reward, onRestart }: { reward: LabReward; onRestart?: () => void }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="relative overflow-hidden rounded-[1.4rem] border border-white/65 bg-gradient-to-br from-amber-100 via-white to-lime-100 p-4 shadow-2xl"
    >
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-amber-300/45 blur-2xl" />
      <div className="relative">
        <span className="grid h-14 w-14 place-items-center rounded-[1.2rem] bg-amber-300 text-amber-900 shadow-xl">
          <Trophy className="h-7 w-7" aria-hidden="true" />
        </span>
        <Badge tone="green" className="mt-4">{reward.badge ?? "Badge unlocked"}</Badge>
        <h2 className="mt-3 text-2xl font-black text-slate-950">{reward.title}</h2>
        <p className="mt-2 text-sm font-bold leading-6 text-slate-700">{reward.detail}</p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-black text-amber-800 shadow">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          +{reward.xp} XP
        </div>
        {onRestart ? (
          <Button onClick={onRestart} className="mt-4 w-full" variant="secondary" icon={<RotateCcw className="h-4 w-4" aria-hidden="true" />}>
            Run again
          </Button>
        ) : null}
      </div>
    </motion.section>
  );
}
