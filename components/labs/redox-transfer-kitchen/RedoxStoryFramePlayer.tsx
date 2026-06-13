"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, FastForward, RotateCcw, Sparkles } from "lucide-react";
import { useState } from "react";
import { redoxAssetManifest } from "./redoxAssetManifest";
import { storyCameraClasses } from "./redoxAnimationPresets";
import { redoxStoryFrames } from "./redoxQuestData";
import { RedoxDialogueBox } from "./RedoxDialogueBox";

function MurukkuTransferOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <motion.img
        src={redoxAssetManifest.paati_giving_murukku_character.src}
        alt=""
        className="absolute bottom-[8%] right-[12%] h-[58%] max-h-[540px] object-contain drop-shadow-2xl"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0, y: [0, -4, 0] }}
        transition={{ duration: 0.8, y: { repeat: Infinity, duration: 3.2 } }}
      />
      <motion.img
        src={redoxAssetManifest.karthik_confused_character.src}
        alt=""
        className="absolute bottom-[7%] left-[13%] h-[52%] max-h-[500px] object-contain drop-shadow-2xl"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0, y: [0, 3, 0] }}
        transition={{ duration: 0.8, y: { repeat: Infinity, duration: 3.6 } }}
      />
      <motion.div
        className="absolute left-[46%] top-[52%] h-16 w-16 rounded-full border-[10px] border-amber-300 bg-gradient-to-br from-amber-200 to-orange-500 shadow-2xl shadow-amber-400/50 before:absolute before:inset-3 before:rounded-full before:border-4 before:border-orange-700/55 before:content-['']"
        initial={{ x: 220, y: 0, scale: 0.7 }}
        animate={{ x: [-40, -260], y: [-12, 26], scale: [0.85, 1.05, 0.9] }}
        transition={{ duration: 2.6, repeat: Infinity, repeatDelay: 0.8, ease: "easeInOut" }}
      />
      <div className="absolute left-[9%] top-[14%] rounded-2xl border border-white/20 bg-white/16 px-4 py-3 text-sm font-black text-white backdrop-blur">
        Paati loses murukku
      </div>
      <div className="absolute right-[12%] top-[18%] rounded-2xl border border-white/20 bg-white/16 px-4 py-3 text-sm font-black text-white backdrop-blur">
        Karthik gains murukku
      </div>
      <div className="absolute left-1/2 top-[22%] -translate-x-1/2 rounded-full bg-emerald-300 px-5 py-2 text-sm font-black uppercase tracking-[0.18em] text-emerald-950 shadow-lg shadow-emerald-400/40">
        Same moment
      </div>
    </div>
  );
}

function EquationOverlay() {
  return (
    <div className="absolute inset-0 grid place-items-center px-5">
      <img src={redoxAssetManifest.paati_explaining_character.src} alt="" className="pointer-events-none absolute bottom-[5%] right-[4%] hidden h-[46%] object-contain drop-shadow-2xl md:block" />
      <img src={redoxAssetManifest.karthik_realization_character.src} alt="" className="pointer-events-none absolute bottom-[4%] left-[4%] hidden h-[42%] object-contain drop-shadow-2xl md:block" />
      <div className="w-full max-w-4xl rounded-[2rem] border border-white/18 bg-slate-950/68 p-5 text-center shadow-2xl backdrop-blur-xl md:p-8">
        <p className="mb-4 text-sm font-black uppercase tracking-[0.26em] text-amber-200">Full equation</p>
        <p className="text-2xl font-black text-white md:text-4xl">Zn(s) + CuSO₄(aq) → ZnSO₄(aq) + Cu(s)</p>
        <motion.div className="my-6 h-px bg-gradient-to-r from-transparent via-cyan-200 to-transparent" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.9 }} />
        <div className="grid gap-3 md:grid-cols-2">
          <motion.div className="rounded-2xl border border-purple-200/20 bg-purple-500/18 p-4" animate={{ opacity: [1, 0.42, 1] }} transition={{ duration: 2.4, repeat: Infinity }}>
            <p className="text-lg font-black text-purple-100">SO₄²⁻ = spectator ion</p>
            <p className="mt-1 text-sm font-semibold text-purple-50/80">It appears unchanged on both sides.</p>
          </motion.div>
          <div className="rounded-2xl border border-emerald-200/20 bg-emerald-500/18 p-4">
            <p className="text-lg font-black text-emerald-100">Net ionic reaction</p>
            <p className="mt-1 text-xl font-black text-white">Zn(s) + Cu²⁺(aq) → Zn²⁺(aq) + Cu(s)</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StartGameOverlay() {
  return (
    <div className="absolute inset-0 grid place-items-center px-5">
      <div className="max-w-3xl rounded-[2rem] border border-cyan-200/25 bg-slate-950/62 p-8 text-center shadow-2xl shadow-cyan-950/40 backdrop-blur-xl">
        <Sparkles className="mx-auto mb-4 h-10 w-10 text-cyan-200" />
        <p className="text-sm font-black uppercase tracking-[0.28em] text-cyan-100">Electron Exchange Table</p>
        <h2 className="mt-3 text-3xl font-black text-white md:text-5xl">Zinc gives. Copper receives.</h2>
        <p className="mt-4 text-base font-semibold text-cyan-50/85">Now make the electron transfer happen yourself.</p>
      </div>
    </div>
  );
}

export function RedoxStoryFramePlayer({ onComplete }: { onComplete: () => void }) {
  const [index, setIndex] = useState(0);
  const frame = redoxStoryFrames[index];
  const asset = redoxAssetManifest[frame.assetRole];
  const isLast = index === redoxStoryFrames.length - 1;

  function next() {
    if (isLast) {
      onComplete();
      return;
    }
    setIndex((current) => current + 1);
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <AnimatePresence mode="wait">
        <motion.div
          key={frame.id}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.7 }}
        >
          <img src={asset.src} alt={asset.label} className={`h-full w-full object-cover transition-transform duration-[6500ms] ${storyCameraClasses[frame.cameraMotion]}`} />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-slate-950/30" />
          {frame.overlay === "murukku_transfer" ? <MurukkuTransferOverlay /> : null}
          {frame.overlay === "equation_strip" ? <EquationOverlay /> : null}
          {frame.overlay === "start_game" ? <StartGameOverlay /> : null}
        </motion.div>
      </AnimatePresence>

      <div className="absolute left-4 right-4 top-4 z-20 flex items-center justify-between gap-3 md:left-8 md:right-8">
        <div className="rounded-full border border-white/15 bg-white/12 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-white backdrop-blur">
          Redox Transfer Kitchen
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setIndex(0)}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/12 px-3 py-2 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
          >
            <RotateCcw className="h-4 w-4" aria-hidden />
            Replay
          </button>
          <button
            type="button"
            onClick={onComplete}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/12 px-3 py-2 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
          >
            <FastForward className="h-4 w-4" aria-hidden />
            Skip story
          </button>
        </div>
      </div>

      <div className="absolute inset-x-4 bottom-5 z-30 mx-auto max-w-5xl md:bottom-8">
        <RedoxDialogueBox speaker={frame.speaker} text={frame.text} />
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            {redoxStoryFrames.map((item, dotIndex) => (
              <button
                key={item.id}
                type="button"
                aria-label={`Go to story frame ${dotIndex + 1}`}
                onClick={() => setIndex(dotIndex)}
                className={`h-2.5 rounded-full transition-all ${dotIndex === index ? "w-9 bg-amber-300" : "w-2.5 bg-white/38"}`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={next}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-300 to-cyan-300 px-5 py-3 text-sm font-black text-slate-950 shadow-xl shadow-cyan-900/30 transition hover:-translate-y-0.5"
          >
            {isLast ? "Start Electron Exchange" : "Next"}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>
    </section>
  );
}
