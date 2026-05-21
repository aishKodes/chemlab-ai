"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import { ChallengePanel } from "@/components/lab-engine/ChallengePanel";
import { linearMoleculeChallenge, moleculeModels } from "@/components/simulations/molecule-explorer/moleculeData";
import { MoleculeInfoPanel } from "@/components/simulations/molecule-explorer/MoleculeInfoPanel";
import { MoleculeViewer } from "@/components/simulations/molecule-explorer/MoleculeViewer";
import { MasterAlchemBubble } from "@/components/master-alchem/MasterAlchemBubble";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { awardLocalBadge, markLabCompleted, markLabStarted } from "@/lib/progress/labProgress";

export function MoleculeExplorer() {
  const [selectedKey, setSelectedKey] = useState("water");
  const [selectedAnswer, setSelectedAnswer] = useState<string | undefined>();
  const [completed, setCompleted] = useState(false);
  const selected = moleculeModels.find((molecule) => molecule.key === selectedKey) ?? moleculeModels[0];

  function selectMolecule(key: string) {
    markLabStarted("molecule-explorer");
    setSelectedKey(key);
  }

  function answerChallenge(optionId: string) {
    setSelectedAnswer(optionId);
    if (optionId === linearMoleculeChallenge.correctOptionId && !completed) {
      setCompleted(true);
      markLabCompleted("molecule-explorer", 140);
      awardLocalBadge("shape-detective");
    }
  }

  return (
    <div className="space-y-6">
      <MasterAlchemBubble
        mood="guide"
        eyebrow="Molecule Explorer"
        message={selected.masterAlchemHint}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <Card className="relative overflow-hidden bg-gradient-to-br from-white via-cyan-50 to-violet-100 p-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.22),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(168,85,247,0.18),transparent_28%)]" />
          <div className="relative p-5 sm:p-6">
            <Badge tone="blue">Rotate the molecule</Badge>
            <MoleculeViewer molecule={selected} />
          </div>
        </Card>

        <div className="space-y-5">
          <MoleculeInfoPanel molecule={selected} />

          <Card className="bg-white/85">
            <h3 className="text-xl font-black text-slate-950">Choose a molecule</h3>
            <div className="mt-4 grid gap-3">
              {moleculeModels.map((molecule) => (
                <button
                  key={molecule.key}
                  type="button"
                  className={cn(
                    "focus-ring rounded-2xl border-2 bg-white px-4 py-3 text-left transition hover:-translate-y-0.5 hover:border-blue-200",
                    selected.key === molecule.key ? "border-blue-500 shadow-lg shadow-blue-100" : "border-slate-100",
                  )}
                  onClick={() => selectMolecule(molecule.key)}
                >
                  <span className="flex items-center justify-between gap-3">
                    <span>
                      <span className="block text-sm font-black text-slate-950">{molecule.name}</span>
                      <span className="block text-xs font-bold text-slate-500">{molecule.geometry}</span>
                    </span>
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">{molecule.formula}</span>
                  </span>
                </button>
              ))}
            </div>
          </Card>

          <ChallengePanel
            challenge={linearMoleculeChallenge}
            selectedOptionId={selectedAnswer}
            onAnswer={answerChallenge}
          />

          {completed ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[1.4rem] border-2 border-white bg-gradient-to-br from-lime-100 via-white to-amber-100 p-4 shadow-xl"
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-black text-lime-700">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" aria-hidden="true" />
                Shape Detective badge
              </div>
              <p className="mt-3 text-sm font-bold leading-6 text-slate-700">
                You found the linear molecule. Rotate carbon dioxide again and notice how the atoms stay on one straight line.
              </p>
            </motion.div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
