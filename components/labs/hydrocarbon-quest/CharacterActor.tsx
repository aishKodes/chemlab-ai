"use client";

/* eslint-disable @next/next/no-img-element */

import { motion, useReducedMotion } from "framer-motion";
import type { HydrocarbonSceneLayout, StageCharacterPlacement } from "@/components/labs/hydrocarbon-quest/sceneLayouts";
import { placeCharacterOnGround, resolveCharacterConfig, STAGE_HEIGHT, STAGE_WIDTH } from "@/components/labs/hydrocarbon-quest/sceneLayouts";
import type { HydrocarbonCharacter, HydrocarbonPose } from "@/components/labs/hydrocarbon-quest/hydrocarbonQuestTypes";
import { cn } from "@/lib/utils";

export function CharacterActor({
  character,
  pose = "idle",
  speaking = false,
  stagePlacement,
  size = "scene",
  className,
}: {
  character: Exclude<HydrocarbonCharacter, "Master Alchem">;
  pose?: HydrocarbonPose;
  speaking?: boolean;
  stagePlacement?: {
    layout: HydrocarbonSceneLayout;
    placement: StageCharacterPlacement;
    debug?: boolean;
    zIndex?: number;
  };
  size?: "sm" | "md" | "scene";
  className?: string;
}) {
  const reduced = useReducedMotion();
  const animationPose = speaking ? "speaking" : pose;
  const asset = resolveCharacterConfig(character, pose);

  if (stagePlacement) {
    const placed = placeCharacterOnGround(asset, { width: STAGE_WIDTH, height: STAGE_HEIGHT }, {
      groundY: stagePlacement.layout.groundY,
      footXOnStage: stagePlacement.placement.footX,
      scale: stagePlacement.placement.scale,
      flipX: stagePlacement.placement.flipX,
    });
    const shadowWidth = Math.max(130, 380 * stagePlacement.placement.scale);
    const shadowHeight = Math.max(22, 58 * stagePlacement.placement.scale);

    return (
      <div
        className={cn("pointer-events-none absolute", className)}
        style={{
          left: placed.leftPct,
          top: placed.topPct,
          width: placed.widthPct,
          height: placed.heightPct,
          zIndex: stagePlacement.zIndex ?? 24,
        }}
      >
        <div
          className="absolute rounded-full bg-slate-950 blur-lg"
          style={{
            left: `${asset.anchor.footX * 100}%`,
            top: `${asset.anchor.footY * 100}%`,
            width: `${shadowWidth}px`,
            height: `${shadowHeight}px`,
            opacity: stagePlacement.placement.shadowStrength ?? 0.3,
            transform: "translate(-50%, -36%)",
          }}
        />
        <motion.div
          className="relative h-full w-full"
          style={{ transformOrigin: placed.transformOrigin }}
          animate={reduced ? undefined : getStageMotion(animationPose)}
          transition={getStageTransition(animationPose)}
        >
          <div
            className="h-full w-full"
            style={{
              transform: stagePlacement.placement.flipX ? "scaleX(-1)" : undefined,
              transformOrigin: placed.transformOrigin,
            }}
          >
            {asset.src ? (
              <img src={asset.src} alt={asset.alt} className="h-full w-full object-contain drop-shadow-2xl" draggable={false} />
            ) : (
              <CharacterFallback character={character} pose={pose} />
            )}
          </div>
        </motion.div>
        {speaking ? (
          <motion.div
            className="absolute h-5 w-5 rounded-full bg-cyan-100 shadow-[0_0_26px_rgba(103,232,249,0.95)]"
            style={{
              left: `${asset.anchor.footX * 100}%`,
              top: "22%",
              transform: "translate(-50%, -50%)",
            }}
            animate={reduced ? undefined : { opacity: [0.2, 0.95, 0.2], scale: [0.75, 1.18, 0.75] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
          />
        ) : null}
        {stagePlacement.debug ? (
          <div
            className="absolute h-4 w-4 rounded-full border-2 border-white bg-rose-500 shadow"
            style={{
              left: `${asset.anchor.footX * 100}%`,
              top: `${asset.anchor.footY * 100}%`,
              transform: "translate(-50%, -50%)",
            }}
            title={`${character} foot anchor`}
          />
        ) : null}
      </div>
    );
  }

  return (
    <motion.div
      className={cn(
        "relative grid w-full place-items-center",
        size === "sm" && "max-w-[4.5rem]",
        size === "md" && "max-w-[8rem]",
        size === "scene" && "max-w-[16rem] sm:max-w-[18rem]",
        className,
      )}
      animate={reduced ? undefined : getInlineMotion(animationPose)}
      transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
    >
      <motion.div
        className="absolute bottom-2 h-8 w-36 rounded-full bg-slate-950/20 blur-md"
        animate={reduced ? undefined : { scaleX: speaking ? [1, 0.92, 1] : [1, 0.96, 1] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      />
      <div
        className={cn(
          "relative w-full origin-bottom",
          size === "sm" && "h-24",
          size === "md" && "h-40",
          size === "scene" && "h-[min(52svh,25rem)]",
        )}
      >
        {asset.src ? (
          <img src={asset.src} alt={asset.alt} className="h-full w-full object-contain drop-shadow-2xl" draggable={false} />
        ) : (
          <CharacterFallback character={character} pose={pose} />
        )}
      </div>
    </motion.div>
  );
}

function getStageMotion(pose: HydrocarbonPose) {
  if (pose === "speaking" || pose === "explaining" || pose === "pointing") {
    return { scaleY: [1, 1.012, 1], rotate: [-0.35, 0.45, -0.35] };
  }
  if (pose === "listening" || pose === "idle") {
    return { scaleY: [1, 1.008, 1], rotate: [-0.25, 0.25, -0.25] };
  }
  if (pose === "confused" || pose === "thinking") {
    return { rotate: [-1.3, 0.8, -1.3], scaleY: [1, 1.006, 1] };
  }
  if (pose === "warning") {
    return { x: [0, -8, 6, -3, 0], rotate: [-0.3, 0.35, -0.2, 0] };
  }
  if (pose === "celebrating" || pose === "success") {
    return { y: [0, -18, 0], rotate: [-1.2, 1.1, -1.2], scaleY: [1, 1.018, 1] };
  }
  return { scaleY: [1, 1.008, 1] };
}

function getStageTransition(pose: HydrocarbonPose) {
  return {
    duration: pose === "warning" ? 0.65 : pose === "celebrating" || pose === "success" ? 2.7 : 4.8,
    repeat: pose === "warning" ? 0 : Infinity,
    ease: "easeInOut" as const,
  };
}

function getInlineMotion(pose: HydrocarbonPose) {
  if (pose === "warning") return { x: [0, -5, 5, -3, 3, 0] };
  if (pose === "celebrating" || pose === "success") return { y: [0, -14, 0], scale: [1, 1.03, 1] };
  if (pose === "speaking" || pose === "explaining") return { y: [0, -6, 0], rotate: [-0.5, 0.7, -0.4], scale: [1, 1.01, 1] };
  if (pose === "confused" || pose === "thinking") return { x: [0, -2, 2, 0], rotate: [-1, 0.8, -1] };
  return { y: [0, -4, 0], scaleY: [1, 1.01, 1] };
}

function CharacterFallback({ character, pose }: { character: string; pose: HydrocarbonPose }) {
  const isAparna = character === "Aparna";
  return (
    <div className="grid h-full w-full place-items-end">
      <div className="relative mx-auto h-[86%] w-[72%]">
        <div className={cn("absolute left-1/2 top-4 h-24 w-24 -translate-x-1/2 rounded-full border-4 border-white shadow-xl", isAparna ? "bg-violet-200" : "bg-cyan-200")} />
        <div className={cn("absolute bottom-8 left-1/2 h-[70%] w-[78%] -translate-x-1/2 rounded-t-[4rem] border-4 border-white shadow-2xl", isAparna ? "bg-gradient-to-br from-violet-500 to-blue-500" : "bg-gradient-to-br from-cyan-500 to-blue-500")} />
        <div className="absolute left-1/2 top-14 flex -translate-x-1/2 gap-5">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-800" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-800" />
        </div>
        <div className={cn("absolute left-1/2 top-24 h-2 w-10 -translate-x-1/2 rounded-full bg-slate-800", pose === "confused" && "rotate-6")} />
      </div>
    </div>
  );
}
