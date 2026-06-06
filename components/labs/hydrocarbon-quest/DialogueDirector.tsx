"use client";

import { motion } from "framer-motion";
import { FastForward, Play } from "lucide-react";
import type { DialogueLine } from "@/components/labs/hydrocarbon-quest/hydrocarbonQuestTypes";
import { Button } from "@/components/ui/Button";

export function DialogueDirector({
  lines,
  index,
  onNext,
  onSkip,
  ctaLabel = "Next",
}: {
  lines: DialogueLine[];
  index: number;
  onNext: () => void;
  onSkip?: () => void;
  ctaLabel?: string;
}) {
  const line = lines[index] ?? lines[lines.length - 1];

  return (
    <motion.div
      key={`${line.speaker}-${index}`}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[1.6rem] border-2 border-white bg-white/92 p-4 shadow-2xl backdrop-blur-md"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-700">{line.speaker}</p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.28 }}
            className="mt-2 max-w-4xl text-base font-black leading-7 text-slate-800 sm:text-lg"
          >
            {line.text}
          </motion.p>
        </div>
        <div className="flex shrink-0 gap-2">
          {onSkip ? (
            <Button variant="ghost" size="sm" onClick={onSkip} icon={<FastForward className="h-4 w-4" aria-hidden="true" />}>
              Skip story
            </Button>
          ) : null}
          <Button size="sm" onClick={onNext} icon={<Play className="h-4 w-4" aria-hidden="true" />}>
            {ctaLabel}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
