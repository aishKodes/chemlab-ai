import { motion } from "framer-motion";
import { Trophy } from "lucide-react";

export function ElectrochemistryLevelComplete({ title, xp }: { title: string; xp: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-950 shadow-lg"
    >
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-600 text-white">
          <Trophy className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-black">Level complete</p>
          <p className="text-xs font-bold">{title} · +{xp} XP</p>
        </div>
      </div>
    </motion.div>
  );
}
