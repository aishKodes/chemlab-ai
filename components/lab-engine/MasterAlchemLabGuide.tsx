"use client";

import { motion } from "framer-motion";
import { MasterAlchem } from "@/components/master-alchem/MasterAlchem";
import type { MasterAlchemMood } from "@/components/master-alchem/MasterAlchemMood";

export function MasterAlchemLabGuide({
  message,
  mood,
}: {
  message: string;
  mood: MasterAlchemMood;
}) {
  return (
    <motion.aside
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="pointer-events-auto rounded-[1.4rem] border border-white/65 bg-white/92 p-3 shadow-2xl backdrop-blur-md"
      aria-live="polite"
    >
      <div className="grid gap-3 sm:grid-cols-[auto_1fr] sm:items-center">
        <MasterAlchem mood={mood} size="xs" showGlow={false} className="mx-auto" />
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-700">Master Alchem</p>
          <p className="mt-1 text-sm font-bold leading-5 text-slate-700">{message}</p>
        </div>
      </div>
    </motion.aside>
  );
}
