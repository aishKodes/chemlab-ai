"use client";

import { motion } from "framer-motion";
import type { HydrocarbonLevel } from "@/components/labs/hydrocarbon-quest/hydrocarbonQuestTypes";
import { cn } from "@/lib/utils";

export function AlkeneTraceRail({
  level,
  selectedAtoms,
  wrongAtoms,
  onAtomClick,
}: {
  level: HydrocarbonLevel;
  selectedAtoms: string[];
  wrongAtoms: string[];
  onAtomClick: (atomId: string) => void;
}) {
  const doubleBond = level.molecule.bonds.find((bond) => bond.type === "double");

  return (
    <div className="relative z-20 mx-auto w-full max-w-xl rounded-2xl border border-cyan-200/70 bg-slate-950/88 px-3 py-2 shadow-xl backdrop-blur-md">
      <div className="mb-2 flex items-center justify-between gap-3 text-[11px] font-black text-cyan-50">
        <span>Touch-safe carbon path</span>
        <span className="text-amber-200">Gold bond = C=C VIP</span>
      </div>
      <div className="flex items-center justify-center">
        {level.correctChainSequence.map((atomId, index) => {
          const selectedOrder = selectedAtoms.indexOf(atomId);
          const selected = selectedOrder >= 0;
          const wrong = wrongAtoms.includes(atomId);
          const nextAtomId = level.correctChainSequence[index + 1];
          const isDouble = Boolean(nextAtomId && doubleBond && [doubleBond.from, doubleBond.to].includes(atomId) && [doubleBond.from, doubleBond.to].includes(nextAtomId));
          return (
            <div key={atomId} className="flex min-w-0 flex-1 items-center last:flex-none">
              <motion.button
                type="button"
                whileTap={{ scale: 0.9 }}
                onClick={() => onAtomClick(atomId)}
                aria-label={`Select carbon ${index + 1} in the displayed chain`}
                className={cn(
                  "focus-ring relative grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 text-sm font-black shadow-lg transition sm:h-12 sm:w-12",
                  selected && "border-lime-200 bg-lime-400 text-lime-950",
                  wrong && "border-rose-200 bg-rose-500 text-white",
                  !selected && !wrong && "border-cyan-200 bg-cyan-700 text-white hover:bg-cyan-600",
                )}
              >
                C
                {selected ? <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-white text-[10px] text-lime-800">{selectedOrder + 1}</span> : null}
              </motion.button>
              {nextAtomId ? (
                <span className={cn("relative h-2 min-w-4 flex-1 bg-cyan-300/60", isDouble && "h-3 bg-amber-300 shadow-[0_0_16px_rgba(251,191,36,0.8)]")}>
                  {isDouble ? <span className="absolute inset-x-0 top-[-5px] h-1 bg-amber-200" /> : null}
                </span>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
