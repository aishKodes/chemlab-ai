"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, BadgeCheck, MousePointer2 } from "lucide-react";
import { MoleculeGraph } from "@/components/labs/hydrocarbon-quest/MoleculeGraph";
import { hydrocarbonQuestAssets } from "@/components/labs/hydrocarbon-quest/hydrocarbonAssetManifest";
import type { HydrocarbonLevel, NumberingOption } from "@/components/labs/hydrocarbon-quest/hydrocarbonQuestTypes";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function MoleculeGameStage({
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
  const reduced = useReducedMotion();

  return (
    <section className="relative min-h-0 overflow-hidden rounded-[2rem] border-2 border-white bg-gradient-to-br from-sky-100 via-white to-amber-100 shadow-2xl">
      <motion.div
        className="absolute inset-0 bg-cover bg-center opacity-35"
        style={{ backgroundImage: `url(${hydrocarbonQuestAssets.bgPuzzleBoard.webPath})` }}
        animate={reduced ? undefined : { scale: [1.02, 1.045, 1.02], x: [0, -10, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(34,211,238,0.28),transparent_26%),radial-gradient(circle_at_86%_18%,rgba(250,204,21,0.28),transparent_24%)]" />
      <ParticleWash />

      <div className="relative grid min-h-[22rem] grid-rows-[auto_minmax(0,1fr)_auto] gap-2 p-4 sm:min-h-[30rem]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Badge tone={chainComplete ? "green" : "blue"}>{chainComplete ? "Main chain found" : "Trace the carbon family"}</Badge>
            <h2 className="mt-2 text-xl font-black text-slate-950 sm:text-2xl">{level.targetName}</h2>
          </div>
          <div className="rounded-2xl bg-white/78 px-3 py-2 text-sm font-black text-slate-700 shadow-sm">
            {selectedAtoms.length}/{level.correctChainSequence.length} carbons locked
          </div>
        </div>

        <div className="relative min-h-0">
          <MoleculeGraph
            level={level}
            selectedAtoms={selectedAtoms}
            wrongAtoms={wrongAtoms}
            numberingOption={numberingOption}
            glowing={chainComplete}
            onAtomClick={onAtomClick}
          />
        </div>

        <div className="grid gap-3 xl:grid-cols-[1fr_auto] xl:items-end">
          <div className="rounded-[1.3rem] border border-white bg-white/78 px-4 py-3 shadow-sm">
            <div className="flex items-start gap-2">
              <MousePointer2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" aria-hidden="true" />
              <p className="text-sm font-bold leading-6 text-slate-700">{getStageInstruction(level, chainComplete, numberingOption)}</p>
            </div>
          </div>
          {canChooseNumbering ? (
            <div className="flex flex-wrap gap-2 rounded-[1.3rem] border border-white bg-white/82 p-2 shadow-lg">
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
            </div>
          ) : chainComplete && !level.numberingOptions ? (
            <div className="inline-flex items-center gap-2 rounded-[1.3rem] bg-lime-100 px-4 py-3 text-sm font-black text-lime-800 shadow-sm">
              <BadgeCheck className="h-5 w-5" aria-hidden="true" />
              Naming blocks unlocked
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function getStageInstruction(level: HydrocarbonLevel, chainComplete: boolean, numberingOption?: NumberingOption) {
  if (!chainComplete) {
    if (level.id === "methylpentane") return "Click the five-carbon family line. The hanging carbon is a side cousin, not the main chain.";
    return "Click each carbon in order so the family line lights up.";
  }
  if (level.id === "methylpentane" && !numberingOption?.correct) {
    return "Now choose the direction that gives the methyl branch the lowest possible number.";
  }
  if (level.id === "butene" && !numberingOption?.correct) {
    return "The double bond is the VIP guest. Choose the numbering that gives it seat number 1.";
  }
  return level.chainCompleteMessage;
}

function ParticleWash() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 15 }).map((_, index) => (
        <motion.span
          key={index}
          className="absolute h-2 w-2 rounded-full bg-cyan-300/65 shadow-[0_0_14px_rgba(34,211,238,0.8)]"
          style={{
            left: `${6 + ((index * 13) % 88)}%`,
            top: `${12 + ((index * 17) % 74)}%`,
          }}
          animate={{ y: [0, -18, 0], opacity: [0.15, 0.72, 0.15], scale: [0.75, 1.25, 0.75] }}
          transition={{ duration: 3.4 + index * 0.11, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
