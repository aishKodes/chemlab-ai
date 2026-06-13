"use client";

import { motion } from "framer-motion";
import { Lightbulb, RotateCcw } from "lucide-react";
import { CharacterActor } from "@/components/labs/hydrocarbon-quest/CharacterActor";
import type { HydrocarbonPose } from "@/components/labs/hydrocarbon-quest/hydrocarbonQuestTypes";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function AparnaHintBox({
  message,
  mood = "thinking",
  warning = false,
  onReplay,
  showCharacter = true,
  className,
}: {
  message: string;
  mood?: HydrocarbonPose;
  warning?: boolean;
  onReplay?: () => void;
  showCharacter?: boolean;
  className?: string;
}) {
  return (
    <motion.aside
      key={message}
      initial={{ opacity: 0, x: 18 }}
      animate={warning ? { opacity: 1, x: [0, -8, 8, -4, 0] } : { opacity: 1, x: 0 }}
      transition={{ duration: warning ? 0.42 : 0.3 }}
      className={cn(
        "relative overflow-hidden rounded-[1.6rem] border-2 border-white bg-white/88 p-3 shadow-xl backdrop-blur-md",
        warning && "border-rose-200 bg-rose-50/92",
        className,
      )}
    >
      <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-cyan-300/40 blur-2xl" />
      <div className={cn("relative grid gap-3", showCharacter ? "grid-cols-[4.5rem_1fr]" : "grid-cols-1")}>
        {showCharacter ? <CharacterActor character="Aparna" pose={mood} speaking size="sm" /> : null}
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-blue-700">
            <Lightbulb className="h-4 w-4" aria-hidden="true" />
            Aparna&apos;s clue
          </div>
          <p className="mt-2 text-sm font-black leading-6 text-slate-800">{message}</p>
          {onReplay ? (
            <Button
              className="mt-3"
              variant="ghost"
              size="sm"
              onClick={onReplay}
              icon={<RotateCcw className="h-4 w-4" aria-hidden="true" />}
            >
              Replay explanation
            </Button>
          ) : null}
        </div>
      </div>
    </motion.aside>
  );
}
