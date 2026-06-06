"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { characterMotion, sceneCameraMotion } from "@/components/labs/hydrocarbon-quest/animationPresets";
import { CharacterActor } from "@/components/labs/hydrocarbon-quest/CharacterActor";
import { DialogueDirector } from "@/components/labs/hydrocarbon-quest/DialogueDirector";
import { hydrocarbonQuestAssets } from "@/components/labs/hydrocarbon-quest/hydrocarbonAssetManifest";
import { hydrocarbonQuestOpening } from "@/components/labs/hydrocarbon-quest/hydrocarbonQuestData";
import type { DialogueLine } from "@/components/labs/hydrocarbon-quest/hydrocarbonQuestTypes";
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
  const reduced = useReducedMotion();
  const line = hydrocarbonQuestOpening.dialogue[dialogueIndex] ?? hydrocarbonQuestOpening.dialogue.at(-1);
  const done = dialogueIndex >= hydrocarbonQuestOpening.dialogue.length;

  return (
    <section className="relative min-h-[calc(100svh-5rem)] overflow-hidden bg-slate-950 text-white">
      <motion.div
        className="absolute inset-0 bg-cover bg-center opacity-75"
        style={{
          backgroundImage: `url(${hydrocarbonQuestAssets.bgClassroom.webPath})`,
        }}
        animate={reduced ? undefined : sceneCameraMotion}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-blue-950/35" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.24),transparent_28%),radial-gradient(circle_at_85%_15%,rgba(250,204,21,0.16),transparent_24%)]" />
      <LightRays />

      <div className="relative mx-auto grid min-h-[calc(100svh-5rem)] max-w-7xl grid-rows-[auto_minmax(0,1fr)_auto] gap-4 px-4 py-5 sm:px-6">
        <header className="flex flex-wrap items-center justify-between gap-3 rounded-[1.4rem] border border-white/20 bg-white/12 px-4 py-3 shadow-xl backdrop-blur-md">
          <div>
            <Badge tone="cyan">Hydrocarbon Naming Quest</Badge>
            <h1 className="mt-2 text-2xl font-black sm:text-4xl">{hydrocarbonQuestOpening.subtitle}</h1>
          </div>
          <Button href="/labs" variant="secondary" size="sm">
            Back to labs
          </Button>
        </header>

        <div className="relative grid min-h-0 items-end gap-4 md:grid-cols-[1fr_1fr]">
          <motion.div
            className="flex min-h-[18rem] items-end justify-center"
            animate={reduced ? undefined : characterMotion.idle}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <CharacterActor
              character="Kabir"
              pose={line?.speaker === "Kabir" ? line.pose : done ? "success" : "confused"}
              speaking={line?.speaker === "Kabir" && !done}
              side="left"
            />
          </motion.div>
          <motion.div
            className="flex min-h-[18rem] items-end justify-center"
            animate={reduced ? undefined : characterMotion.pointing}
            transition={{ duration: 6.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <CharacterActor
              character="Aparna"
              pose={line?.speaker === "Aparna" ? line.pose : done ? "celebrating" : "thinking"}
              speaking={line?.speaker === "Aparna" && !done}
              side="right"
            />
          </motion.div>
        </div>

        {done ? (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[1.6rem] border-2 border-white bg-white/92 p-4 text-slate-950 shadow-2xl backdrop-blur-md"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-700">Quest rule</p>
                <p className="mt-2 text-lg font-black">First Name + Middle Name + Surname. Let us name the carbon family.</p>
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
        )}
      </div>
    </section>
  );
}

function LightRays() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -left-20 top-0 h-full w-52 rotate-12 bg-gradient-to-b from-cyan-200/20 via-white/5 to-transparent blur-2xl"
        animate={{ x: [0, 34, 0], opacity: [0.2, 0.42, 0.2] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-12 top-0 h-full w-44 rotate-[-10deg] bg-gradient-to-b from-amber-200/18 via-white/5 to-transparent blur-2xl"
        animate={{ x: [0, -28, 0], opacity: [0.18, 0.36, 0.18] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
