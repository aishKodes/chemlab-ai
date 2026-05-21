"use client";

import { motion } from "framer-motion";
import { Beaker, CheckCircle2, HelpCircle, Sparkles } from "lucide-react";
import { DialogPanel } from "@/components/simulation-engine/DialogPanel";
import { LabStage } from "@/components/simulation-engine/LabStage";
import type { CinematicSceneConfig, SimulationChallenge } from "@/components/simulation-engine/simulationTypes";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

export function CinematicScene({
  scene,
  challenge,
  selectedOptionId,
  onSelectOption,
}: {
  scene: CinematicSceneConfig;
  challenge: SimulationChallenge;
  selectedOptionId?: string;
  onSelectOption: (optionId: string) => void;
}) {
  const isExperiment = scene.phase === "experiment" || scene.phase === "challenge" || scene.phase === "reward";
  const isChallenge = scene.phase === "challenge";
  const isReward = scene.phase === "reward";
  const selected = challenge.options.find((option) => option.id === selectedOptionId);
  const correct = selectedOptionId === challenge.correctOptionId;

  return (
    <motion.section
      key={scene.id}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      className="grid gap-5 xl:grid-cols-[1fr_22rem]"
    >
      <div className="relative overflow-hidden rounded-[2.2rem] border-2 border-white bg-slate-950 p-3 shadow-2xl shadow-blue-900/25">
        {isExperiment ? (
          <LabStage phase={scene.phase} active={scene.phase !== "story"} label={scene.stageLabel ?? scene.title} />
        ) : (
          <StoryStage scene={scene} />
        )}
      </div>

      <div className="space-y-5">
        <DialogPanel
          mood={scene.masterAlchemMood ?? (isReward ? "celebrating" : isChallenge ? "thinking" : "guide")}
          message={scene.masterAlchemMessage}
        />
        <Card className="bg-white/86">
          <Badge tone={isReward ? "green" : isChallenge ? "amber" : "blue"}>{scene.eyebrow}</Badge>
          <h2 className="mt-3 text-2xl font-black text-slate-950">{scene.title}</h2>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">{scene.description}</p>
        </Card>
        {isChallenge ? (
          <Card className="bg-gradient-to-br from-white via-amber-50 to-cyan-50">
            <h3 className="text-xl font-black text-slate-950">{challenge.question}</h3>
            <div className="mt-4 grid gap-2">
              {challenge.options.map((option) => {
                const isSelected = selectedOptionId === option.id;
                const isCorrect = option.id === challenge.correctOptionId;
                return (
                  <button
                    type="button"
                    key={option.id}
                    onClick={() => onSelectOption(option.id)}
                    className={cn(
                      "focus-ring rounded-2xl border-2 bg-white px-4 py-3 text-left text-sm font-black leading-5 text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50",
                      isSelected && isCorrect && "border-lime-300 bg-lime-50 text-lime-900",
                      isSelected && !isCorrect && "border-amber-300 bg-amber-50 text-amber-900",
                    )}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
            {selected ? (
              <p className={cn("mt-3 rounded-2xl p-3 text-sm font-bold leading-6", correct ? "bg-lime-50 text-lime-800" : "bg-amber-50 text-amber-800")}>
                {selected.feedback}
              </p>
            ) : (
              <p className="mt-3 flex gap-2 rounded-2xl bg-blue-50 p-3 text-sm font-bold leading-6 text-blue-800">
                <HelpCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                {challenge.hint}
              </p>
            )}
          </Card>
        ) : null}
      </div>
    </motion.section>
  );
}

function StoryStage({ scene }: { scene: CinematicSceneConfig }) {
  return (
    <div className="relative grid min-h-[28rem] place-items-center overflow-hidden rounded-[2rem] bg-gradient-to-br from-cyan-100 via-white to-violet-100 p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.32),transparent_28%),radial-gradient(circle_at_80%_18%,rgba(167,139,250,0.26),transparent_30%),radial-gradient(circle_at_50%_86%,rgba(250,204,21,0.22),transparent_32%)]" />
      <div className="relative max-w-2xl text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-[1.4rem] border-2 border-white bg-blue-600 text-white shadow-xl">
          <Beaker className="h-8 w-8" aria-hidden="true" />
        </span>
        <h2 className="mt-5 text-4xl font-black text-slate-950">{scene.title}</h2>
        <p className="mt-4 text-base font-bold leading-7 text-slate-700">{scene.description}</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            ["Story", "Know the mission", <Sparkles key="story" className="h-5 w-5" />],
            ["Action", "Change the scene", <Beaker key="action" className="h-5 w-5" />],
            ["Check", "Prove the idea", <CheckCircle2 key="check" className="h-5 w-5" />],
          ].map(([title, detail, icon]) => (
            <div key={String(title)} className="rounded-3xl border-2 border-white bg-white/75 p-4 shadow-lg">
              <span className="mx-auto grid h-10 w-10 place-items-center rounded-2xl bg-cyan-100 text-blue-700">
                {icon}
              </span>
              <p className="mt-3 text-sm font-black text-slate-950">{title}</p>
              <p className="mt-1 text-xs font-bold text-slate-600">{detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
