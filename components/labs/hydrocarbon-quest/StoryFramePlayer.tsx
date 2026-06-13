"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, FastForward } from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export type StoryFrame = {
  id: string;
  backgroundSrc: string;
  speaker: "Kabir" | "Aparna";
  text: string;
  board?: ReactNode;
};

export function StoryFramePlayer({
  frames,
  index,
  onNext,
  onSkip,
}: {
  frames: StoryFrame[];
  index: number;
  onNext: () => void;
  onSkip: () => void;
}) {
  const reduced = useReducedMotion();
  const frame = frames[Math.min(index, frames.length - 1)];
  const last = index >= frames.length - 1;

  return (
    <section className="relative min-h-[calc(100svh-5rem)] overflow-hidden bg-slate-950 py-3 text-white">
      <div className="mx-auto max-w-[min(100vw,calc((100svh-6.5rem)*16/9))] px-2">
        <div className="relative aspect-video overflow-hidden rounded-[2rem] border-2 border-white/20 bg-slate-950 shadow-2xl">
          <motion.div
            key={frame.id}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${frame.backgroundSrc})` }}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, scale: [1.04, 1.09] }}
            transition={{ duration: reduced ? 0.2 : 7, ease: "easeOut" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/78 via-slate-950/15 to-slate-950/35" />
          <div className="absolute left-[4%] top-[4%] rounded-[1.4rem] border border-white/20 bg-slate-950/45 px-4 py-3 shadow-xl backdrop-blur-md">
            <Badge tone="cyan">Hydrocarbon Naming Quest</Badge>
            <h1 className="mt-2 text-2xl font-black sm:text-4xl">The IUPAC Family Naming Game</h1>
          </div>
          {frame.board ? <div className="absolute left-[7%] right-[7%] top-[23%]">{frame.board}</div> : null}
          <motion.div
            key={`${frame.id}-dialogue`}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-[5%] left-[8%] right-[8%] rounded-[1.5rem] border-2 border-white bg-white/94 p-4 text-slate-950 shadow-2xl backdrop-blur-md"
          >
            <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">{frame.speaker}</p>
            <p className="mt-2 text-lg font-black leading-7 sm:text-xl">{frame.text}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button onClick={onSkip} variant="ghost" icon={<FastForward className="h-4 w-4" aria-hidden="true" />}>
                Skip story
              </Button>
              <Button onClick={onNext} icon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}>
                {last ? "Open quest map" : "Next"}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
