"use client";

import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, MousePointer2 } from "lucide-react";
import { Molecule3DStage } from "@/components/labs/hydrocarbon-quest/3d/Molecule3DStage";
import { GameBoardShell } from "@/components/labs/hydrocarbon-quest/GameBoardShell";
import type { HydrocarbonLevel, NumberingOption } from "@/components/labs/hydrocarbon-quest/hydrocarbonQuestTypes";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function MoleculeBoard({
  level,
  selectedAtoms,
  wrongAtoms,
  numberingOption,
  chainComplete,
  canChooseNumbering,
  onAtomClick,
  onNumberingSelect,
}: {
  level: HydrocarbonLevel;
  selectedAtoms: string[];
  wrongAtoms: string[];
  numberingOption?: NumberingOption;
  chainComplete: boolean;
  canChooseNumbering: boolean;
  onAtomClick: (atomId: string) => void;
  onNumberingSelect: (option: NumberingOption) => void;
}) {
  return (
    <GameBoardShell>
      <div className="relative flex flex-wrap items-center justify-between gap-3">
        <div>
          <Badge tone={chainComplete ? "green" : "blue"}>{chainComplete ? "Main chain found" : "Trace carbon family"}</Badge>
          <h2 className="mt-2 text-2xl font-black text-slate-950">{level.targetName}</h2>
          <p className="mt-1 text-xs font-black uppercase tracking-[0.14em] text-blue-700">{level.formula}</p>
        </div>
        <div className="max-w-xs rounded-2xl border border-cyan-100 bg-slate-950 px-4 py-2 text-sm font-black text-white shadow-lg">
          <span className="block">Chain lock: {selectedAtoms.length}/{level.correctChainSequence.length}</span>
          <span className="mt-1 flex items-center gap-1 text-[11px] font-bold text-cyan-100">
            <MousePointer2 className="h-3 w-3" aria-hidden="true" />
            {getStageInstruction(level, chainComplete, numberingOption)}
          </span>
        </div>
      </div>

      <div className="relative min-h-[28rem] flex-1">
        <Molecule3DStage
          level={level}
          selectedAtoms={selectedAtoms}
          wrongAtoms={wrongAtoms}
          numberingOption={numberingOption}
          glowing={chainComplete}
          onAtomClick={onAtomClick}
        />
      </div>

      <div className="relative flex flex-wrap items-center justify-end gap-3">
        {canChooseNumbering ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-2 rounded-[1.2rem] border border-white bg-white/90 p-2 shadow-lg"
          >
            {level.numberingOptions?.map((option) => (
              <Button
                key={option.id}
                size="sm"
                variant={numberingOption?.id === option.id ? (option.correct ? "primary" : "danger") : "secondary"}
                onClick={() => onNumberingSelect(option)}
                icon={<ArrowRight className={cn("h-4 w-4", option.id === "right" && "rotate-180")} aria-hidden="true" />}
              >
                {option.label}
              </Button>
            ))}
          </motion.div>
        ) : chainComplete && !level.numberingOptions ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-[1.2rem] bg-lime-100 px-4 py-3 text-sm font-black text-lime-800 shadow-sm"
          >
            <BadgeCheck className="h-5 w-5" aria-hidden="true" />
            Naming blocks unlocked
          </motion.div>
        ) : null}
      </div>
    </GameBoardShell>
  );
}

function getStageInstruction(level: HydrocarbonLevel, chainComplete: boolean, numberingOption?: NumberingOption) {
  if (!chainComplete) {
    if (level.moduleId === "senior_secondary_boss") return "Trace the parent chain. Ignore branches for a moment, but keep multiple bonds in view.";
    if (level.moduleId === "cousin_branches") return "Click the parent family line. The hanging carbon is a side cousin, not the main chain.";
    return "Click each carbon in order so the family line lights up.";
  }
  if ((level.moduleId === "senior_secondary_boss" || level.moduleId === "vip_double_bonds") && level.numberingOptions && !numberingOption?.correct) {
    return "This is the boss rule: the double bond must receive the lowest possible number before branches are named.";
  }
  if (level.moduleId === "cousin_branches" && level.numberingOptions && !numberingOption?.correct) {
    return "Choose the direction that gives the methyl branch the lowest possible number.";
  }
  if (level.moduleId === "vip_double_bonds" && !numberingOption?.correct) {
    return "The double bond is the VIP guest. Give it seat number 1.";
  }
  return level.chainCompleteMessage;
}
