"use client";

/* eslint-disable @next/next/no-img-element */

import { motion, useReducedMotion } from "framer-motion";
import { characterMotion, characterTransition } from "@/components/labs/hydrocarbon-quest/animationPresets";
import { hydrocarbonQuestAssets } from "@/components/labs/hydrocarbon-quest/hydrocarbonAssetManifest";
import type { HydrocarbonCharacter, HydrocarbonPose } from "@/components/labs/hydrocarbon-quest/hydrocarbonQuestTypes";
import { cn } from "@/lib/utils";

type CharacterAssetKey =
  | "kabirReference"
  | "kabirConfused"
  | "kabirSuccess"
  | "aparnaReference"
  | "aparnaExplaining"
  | "aparnaWarning"
  | "aparnaCelebrating";

const assetByCharacterPose: Record<Exclude<HydrocarbonCharacter, "Master Alchem">, Partial<Record<HydrocarbonPose, CharacterAssetKey>>> = {
  Kabir: {
    idle: "kabirReference",
    speaking: "kabirReference",
    confused: "kabirConfused",
    thinking: "kabirConfused",
    warning: "kabirConfused",
    celebrating: "kabirSuccess",
    success: "kabirSuccess",
  },
  Aparna: {
    idle: "aparnaReference",
    speaking: "aparnaExplaining",
    thinking: "aparnaExplaining",
    pointing: "aparnaExplaining",
    warning: "aparnaWarning",
    celebrating: "aparnaCelebrating",
    success: "aparnaCelebrating",
  } as Partial<Record<HydrocarbonPose, CharacterAssetKey>>,
};

export function CharacterActor({
  character,
  pose = "idle",
  speaking = false,
  side = "left",
  size = "scene",
  className,
}: {
  character: Exclude<HydrocarbonCharacter, "Master Alchem">;
  pose?: HydrocarbonPose;
  speaking?: boolean;
  side?: "left" | "right";
  size?: "sm" | "md" | "scene";
  className?: string;
}) {
  const reduced = useReducedMotion();
  const animationPose = speaking ? "speaking" : pose;
  const assetKey = assetByCharacterPose[character][pose] ?? assetByCharacterPose[character].idle;
  const asset = assetKey ? hydrocarbonQuestAssets[assetKey] : undefined;
  const canUseImage = asset?.status === "ok" && asset.webPath;

  return (
    <motion.div
      className={cn(
        "relative grid w-full place-items-center",
        size === "sm" && "max-w-[4.5rem]",
        size === "md" && "max-w-[8rem]",
        size === "scene" && "max-w-[16rem] sm:max-w-[18rem]",
        className,
      )}
      animate={reduced ? undefined : characterMotion[animationPose]}
      transition={characterTransition}
    >
      <motion.div
        className="absolute bottom-2 h-8 w-36 rounded-full bg-slate-950/20 blur-md"
        animate={reduced ? undefined : { scaleX: speaking ? [1, 0.92, 1] : [1, 0.96, 1] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className={cn(
          "relative w-full origin-bottom",
          size === "sm" && "h-24",
          size === "md" && "h-40",
          size === "scene" && "h-[min(52svh,25rem)]",
        )}
        animate={reduced ? undefined : { rotate: side === "left" ? [-0.8, 0.8, -0.8] : [0.8, -0.8, 0.8] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        {canUseImage ? (
          <img
            src={asset.webPath}
            alt={`${character} ${pose}`}
            className="h-full w-full object-contain drop-shadow-2xl"
            draggable={false}
          />
        ) : (
          <CharacterFallback character={character} pose={pose} />
        )}
      </motion.div>
      {speaking ? (
        <motion.div
          className="absolute top-8 h-3 w-3 rounded-full bg-cyan-200 shadow-[0_0_20px_rgba(103,232,249,0.9)]"
          animate={reduced ? undefined : { opacity: [0.2, 0.9, 0.2], scale: [0.8, 1.25, 0.8] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        />
      ) : null}
    </motion.div>
  );
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
