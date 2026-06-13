"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { CinematicStage } from "@/components/labs/hydrocarbon-quest/CinematicStage";
import { DialogueDirector } from "@/components/labs/hydrocarbon-quest/DialogueDirector";
import { hydrocarbonQuestOpening } from "@/components/labs/hydrocarbon-quest/hydrocarbonQuestData";
import { classroomScene, ruleScene } from "@/components/labs/hydrocarbon-quest/sceneLayouts";
import type { DialogueLine, HydrocarbonPose } from "@/components/labs/hydrocarbon-quest/hydrocarbonQuestTypes";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export function CinematicScene({
  dialogueIndex,
  onNext,
  onSkip,
  onStart,
}: {
  dialogueIndex: number;
  onNext: () => void;
  onSkip: () => void;
  onStart: () => void;
}) {
  const line = hydrocarbonQuestOpening.dialogue[dialogueIndex] ?? hydrocarbonQuestOpening.dialogue.at(-1);
  const done = dialogueIndex >= hydrocarbonQuestOpening.dialogue.length;
  const activeSpeaker = done ? "Aparna" : line?.speaker === "Kabir" || line?.speaker === "Aparna" ? line.speaker : undefined;
  const kabirPose: HydrocarbonPose = line?.speaker === "Kabir" ? line.pose : done ? "thinking" : "listening";
  const aparnaPose: HydrocarbonPose = line?.speaker === "Aparna" ? line.pose : done ? "celebrating" : "listening";
  const layout = dialogueIndex >= 3 && dialogueIndex <= 5 ? ruleScene : classroomScene;

  return (
    <section className="relative min-h-[calc(100svh-5rem)] overflow-hidden bg-gradient-to-br from-sky-100 via-white to-amber-100 py-3">
      <CinematicStage
        layout={layout}
        kabirPose={kabirPose}
        aparnaPose={aparnaPose}
        activeSpeaker={activeSpeaker}
        showCharacters={false}
        particleTone="cyan"
        hud={
          <div className="max-w-[44rem] rounded-[1.25rem] border border-white/25 bg-slate-950/40 px-4 py-3 text-white shadow-xl backdrop-blur-md">
            <Badge tone="cyan">Hydrocarbon Naming Quest</Badge>
            <h1 className="mt-2 text-xl font-black sm:text-3xl">{hydrocarbonQuestOpening.subtitle}</h1>
          </div>
        }
        dialogue={
          done ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[1.35rem] border-2 border-white bg-white/92 p-4 text-slate-950 shadow-2xl backdrop-blur-md"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-700">Quest rule</p>
                  <p className="mt-2 text-lg font-black">Find the family line, name the branch, then choose the bond surname.</p>
                </div>
                <Button onClick={onStart} icon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}>
                  Start Quest
                </Button>
              </div>
            </motion.div>
          ) : (
            <DialogueDirector
              lines={hydrocarbonQuestOpening.dialogue as DialogueLine[]}
              index={dialogueIndex}
              onNext={onNext}
              onSkip={onSkip}
              ctaLabel={dialogueIndex === hydrocarbonQuestOpening.dialogue.length - 1 ? "Ready" : "Next"}
            />
          )
        }
      />
    </section>
  );
}
