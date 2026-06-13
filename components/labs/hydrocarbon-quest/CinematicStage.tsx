"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { CharacterActor } from "@/components/labs/hydrocarbon-quest/CharacterActor";
import { PixiStage } from "@/components/labs/hydrocarbon-quest/PixiStage";
import type { HydrocarbonSceneLayout } from "@/components/labs/hydrocarbon-quest/sceneLayouts";
import { STAGE_HEIGHT, STAGE_WIDTH, stageAreaStyle } from "@/components/labs/hydrocarbon-quest/sceneLayouts";
import type { HydrocarbonPose } from "@/components/labs/hydrocarbon-quest/hydrocarbonQuestTypes";
import { cn } from "@/lib/utils";

export function CinematicStage({
  layout,
  kabirPose = "listening",
  aparnaPose = "listening",
  activeSpeaker,
  showCharacters,
  particleTone = "cyan",
  children,
  dialogue,
  hud,
  className,
}: {
  layout: HydrocarbonSceneLayout;
  kabirPose?: HydrocarbonPose;
  aparnaPose?: HydrocarbonPose;
  activeSpeaker?: "Kabir" | "Aparna";
  showCharacters?: boolean;
  particleTone?: "cyan" | "gold" | "violet";
  children?: ReactNode;
  dialogue?: ReactNode;
  hud?: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const debug = useStageDebug();
  const shouldShowCharacters = showCharacters ?? !layout.integratedCharacters;

  return (
    <div
      className={cn("relative mx-auto w-full px-2 py-3", className)}
      style={{ maxWidth: "min(100vw, calc((100svh - 6.5rem) * 16 / 9))" }}
    >
      <div className="relative mx-auto aspect-video w-full overflow-hidden rounded-[2rem] border-2 border-white bg-slate-950 shadow-2xl">
        <motion.div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${layout.backgroundSrc})` }}
          animate={reduced ? undefined : { scale: [1.02, 1.055, 1.02], x: [0, -8, 0], y: [0, -4, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-slate-950/45 via-slate-900/8 to-blue-950/22" />
        <div className="absolute inset-0 z-[2] bg-[radial-gradient(circle_at_18%_18%,rgba(34,211,238,0.24),transparent_28%),radial-gradient(circle_at_86%_12%,rgba(250,204,21,0.18),transparent_25%)]" />
        <PixiStage tone={particleTone} density={layout.id === "puzzle" ? 18 : 28} />
        <LightRays />

        <div className="absolute inset-0 z-10">
          {hud ? <div className="absolute left-[2.8%] top-[3.2%] z-50 w-[min(92%,56rem)]">{hud}</div> : null}

          {children}

          {shouldShowCharacters ? (
            <>
              <CharacterActor
                character="Kabir"
                pose={activeSpeaker === "Kabir" ? kabirPose : kabirPose === "confused" ? "confused" : "listening"}
                speaking={activeSpeaker === "Kabir"}
                stagePlacement={{ layout, placement: layout.kabir, debug: debug.ground, zIndex: 24 }}
              />
              <CharacterActor
                character="Aparna"
                pose={activeSpeaker === "Aparna" ? aparnaPose : aparnaPose === "warning" ? "warning" : "listening"}
                speaking={activeSpeaker === "Aparna"}
                stagePlacement={{ layout, placement: layout.aparna, debug: debug.ground, zIndex: 26 }}
              />
            </>
          ) : null}

          {dialogue ? (
            <div className="absolute z-[60]" style={stageAreaStyle(layout.dialogueSafeArea)}>
              {dialogue}
            </div>
          ) : null}

          {debug.ground ? <DebugGround y={layout.groundY} /> : null}
          {debug.board && layout.boardArea ? <DebugArea label="board area" area={layout.boardArea} /> : null}
          {debug.camera ? <DebugCamera /> : null}
        </div>
      </div>
      {process.env.NODE_ENV === "development" ? (
        <p className="mt-2 text-center text-xs font-bold text-slate-500">
          Debug: press G for ground, B for board, C for camera.
        </p>
      ) : null}
    </div>
  );
}

function useStageDebug() {
  const [debug, setDebug] = useState({ ground: false, board: false, camera: false });

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() === "g") setDebug((current) => ({ ...current, ground: !current.ground }));
      if (event.key.toLowerCase() === "b") setDebug((current) => ({ ...current, board: !current.board }));
      if (event.key.toLowerCase() === "c") setDebug((current) => ({ ...current, camera: !current.camera }));
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return debug;
}

function DebugGround({ y }: { y: number }) {
  return (
    <div
      className="pointer-events-none absolute left-0 z-[80] w-full border-t-2 border-rose-400"
      style={{ top: `${(y / STAGE_HEIGHT) * 100}%` }}
    >
      <span className="absolute left-4 top-1 rounded bg-rose-500 px-2 py-1 text-xs font-black text-white">groundY {y}</span>
    </div>
  );
}

function DebugArea({ area, label }: { area: { x: number; y: number; width: number; height: number }; label: string }) {
  return (
    <div className="pointer-events-none absolute z-[79] border-2 border-dashed border-lime-400 bg-lime-300/10" style={stageAreaStyle(area)}>
      <span className="absolute left-2 top-2 rounded bg-lime-500 px-2 py-1 text-xs font-black text-slate-950">{label}</span>
    </div>
  );
}

function DebugCamera() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[78]">
      <div className="absolute left-1/2 top-0 h-full border-l-2 border-cyan-300/80" />
      <div className="absolute left-0 top-1/2 w-full border-t-2 border-cyan-300/80" />
      <span
        className="absolute rounded bg-cyan-300 px-2 py-1 text-xs font-black text-slate-950"
        style={{ left: `${(STAGE_WIDTH / 2 / STAGE_WIDTH) * 100}%`, top: `${(STAGE_HEIGHT / 2 / STAGE_HEIGHT) * 100}%` }}
      >
        camera center
      </span>
    </div>
  );
}

function LightRays() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[3] overflow-hidden">
      <motion.div
        className="absolute -left-28 top-0 h-full w-72 rotate-12 bg-gradient-to-b from-cyan-200/24 via-white/8 to-transparent blur-2xl"
        animate={{ x: [0, 38, 0], opacity: [0.18, 0.42, 0.18] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-20 top-0 h-full w-56 rotate-[-10deg] bg-gradient-to-b from-amber-200/18 via-white/6 to-transparent blur-2xl"
        animate={{ x: [0, -32, 0], opacity: [0.14, 0.34, 0.14] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
