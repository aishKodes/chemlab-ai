"use client";

import { motion } from "framer-motion";
import { RotateCcw, Sparkles } from "lucide-react";
import { redoxAssetManifest } from "./redoxAssetManifest";
import { redoxFinalSummary } from "./redoxQuestData";

export function RedoxLevelComplete({
  xp,
  onRestartStory,
  onReplayGame,
}: {
  xp: number;
  onRestartStory: () => void;
  onReplayGame: () => void;
}) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <img src={redoxAssetManifest.redox_success_or_magic_background.src} alt="Redox success kitchen magic" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/42 to-slate-950/15" />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-5 py-12 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.82, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 160, damping: 16 }}
          className="rounded-[2.25rem] border border-amber-200/25 bg-slate-950/65 p-6 shadow-2xl shadow-amber-950/35 backdrop-blur-xl md:p-10"
        >
          <Sparkles className="mx-auto h-12 w-12 text-amber-200" />
          <p className="mt-4 text-sm font-black uppercase tracking-[0.3em] text-cyan-100">Badge unlocked</p>
          <h1 className="mt-3 text-4xl font-black md:text-6xl">{redoxFinalSummary.badge}</h1>
          <p className="mt-4 text-xl font-black text-amber-200">+{xp} XP earned</p>
          <p className="mx-auto mt-5 max-w-3xl text-base font-semibold leading-relaxed text-slate-100">
            Zinc was oxidized, copper ion was reduced, and sulphate stayed as the spectator. You followed the electron transfer from kitchen story to chemistry model.
          </p>
          <div className="mt-6 rounded-2xl border border-cyan-200/20 bg-white/10 p-4">
            <p className="text-lg font-black text-white">{redoxFinalSummary.equation}</p>
            <div className="mt-4 grid gap-2 text-left md:grid-cols-2">
              {redoxFinalSummary.points.map((point) => (
                <div key={point} className="rounded-xl bg-white/10 px-3 py-2 text-sm font-semibold text-cyan-50">
                  {point}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={onReplayGame} className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-300 to-lime-300 px-5 py-3 text-sm font-black text-slate-950 shadow-lg">
              <RotateCcw className="h-4 w-4" aria-hidden />
              Replay game
            </button>
            <button type="button" onClick={onRestartStory} className="rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-black text-white backdrop-blur transition hover:bg-white/18">
              Watch Paati’s story again
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
