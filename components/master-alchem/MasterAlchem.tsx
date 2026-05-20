"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { TargetAndTransition } from "framer-motion";
import { FlaskConical, Sparkles } from "lucide-react";
import { useId } from "react";
import type { MasterAlchemMood } from "@/components/master-alchem/MasterAlchemMood";
import { masterAlchemMoodLabels } from "@/components/master-alchem/MasterAlchemMood";
import { cn } from "@/lib/utils";

type MasterAlchemProps = {
  mood?: MasterAlchemMood;
  size?: "sm" | "md" | "lg" | "xl" | "hero";
  message?: string;
  showBubble?: boolean;
  showGlow?: boolean;
  speaking?: boolean;
  className?: string;
  label?: string;
};

const sizeClasses = {
  sm: "h-28 w-28",
  md: "h-44 w-44",
  lg: "h-64 w-64",
  xl: "h-80 w-80",
  hero: "h-[22rem] w-[22rem] sm:h-[28rem] sm:w-[28rem] lg:h-[31rem] lg:w-[31rem]",
};

const motionByMood: Record<MasterAlchemMood, TargetAndTransition> = {
  avatar: { y: [0, -5, 0] },
  celebrating: { y: [0, -16, 0], rotate: [-1.5, 1.5, -1.5], scale: [1, 1.025, 1] },
  excited: { y: [0, -16, 0], rotate: [-1.5, 1.5, -1.5], scale: [1, 1.025, 1] },
  guide: { y: [0, -10, 0], x: [0, 4, 0] },
  hero: { y: [0, -18, 0], rotate: [-1, 1, -1] },
  idle: { y: [0, -10, 0] },
  labGuide: { y: [0, -10, 0], x: [0, 4, 0] },
  pointing: { y: [0, -9, 0], x: [0, 5, 0] },
  speaking: { y: [0, -9, 0], x: [0, 5, 0] },
  thinking: { y: [0, -8, 0], scale: [1, 1.012, 1] },
  warning: { x: [0, -3, 3, -2, 2, 0], y: [0, -7, 0] },
};

const moodAura: Record<MasterAlchemMood, string> = {
  avatar: "from-cyan-300 via-blue-300 to-violet-300",
  celebrating: "from-amber-200 via-cyan-200 to-fuchsia-300",
  excited: "from-lime-200 via-cyan-300 to-blue-300",
  guide: "from-teal-200 via-sky-300 to-violet-300",
  hero: "from-cyan-300 via-violet-300 to-amber-200",
  idle: "from-cyan-300 via-blue-300 to-violet-300",
  labGuide: "from-teal-200 via-sky-300 to-violet-300",
  pointing: "from-teal-300 via-sky-300 to-violet-300",
  speaking: "from-teal-300 via-sky-300 to-violet-300",
  thinking: "from-violet-300 via-blue-300 to-cyan-200",
  warning: "from-amber-200 via-orange-200 to-violet-200",
};

function FallbackMasterAlchem({
  mood,
  speaking,
}: {
  mood: MasterAlchemMood;
  speaking?: boolean;
}) {
  const rawId = useId().replace(/:/g, "");
  const faceId = `alchemFace-${mood}-${rawId}`;
  const robeId = `alchemRobe-${mood}-${rawId}`;
  const mistId = `alchemMist-${mood}-${rawId}`;
  const isSpeaking = speaking ?? (mood === "speaking" || mood === "pointing" || mood === "labGuide" || mood === "guide");

  return (
    <svg viewBox="0 0 360 420" role="img" aria-hidden="true" className="relative h-full w-full drop-shadow-2xl">
      <defs>
        <radialGradient id={faceId} cx="48%" cy="38%" r="62%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="52%" stopColor="#dff9ff" />
          <stop offset="100%" stopColor="#91e7ff" />
        </radialGradient>
        <linearGradient id={robeId} x1="85" x2="290" y1="150" y2="330">
          <stop offset="0%" stopColor="#3156e8" />
          <stop offset="55%" stopColor="#26c6da" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <linearGradient id={mistId} x1="92" x2="270" y1="245" y2="410">
          <stop offset="0%" stopColor="#4fdaf0" stopOpacity="0.85" />
          <stop offset="55%" stopColor="#a78bfa" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M90 318 C108 252 96 212 134 181 C158 161 202 160 226 183 C265 219 249 260 275 320 C238 343 136 344 90 318Z"
        fill={`url(#${robeId})`}
      />
      <path
        d="M105 317 C118 353 146 364 133 393 C162 376 183 381 179 416 C200 383 238 382 260 406 C247 363 277 352 281 318 C232 346 151 346 105 317Z"
        fill={`url(#${mistId})`}
      />
      <circle cx="180" cy="132" r="82" fill={`url(#${faceId})`} stroke="#fff" strokeWidth="8" />
      <path
        d="M103 118 C130 58 226 55 258 117 C239 91 208 80 180 82 C150 80 122 91 103 118Z"
        fill="#3246c7"
        opacity="0.9"
      />
      <path d="M180 36 L195 62 L225 66 L204 88 L209 119 L180 104 L151 119 L156 88 L135 66 L165 62Z" fill="#facc15" />
      <circle cx="153" cy="151" r="8" fill="#17325f" />
      <circle cx="207" cy="151" r="8" fill="#17325f" />
      <circle cx="157" cy="147" r="2.5" fill="#fff" />
      <circle cx="211" cy="147" r="2.5" fill="#fff" />
      <path
        d={isSpeaking ? "M161 184 C172 196 190 196 201 184" : "M160 181 C172 190 190 190 202 181"}
        fill="none"
        stroke="#17325f"
        strokeLinecap="round"
        strokeWidth="7"
      />
      <path d="M145 238 C162 254 200 254 216 238" fill="none" stroke="#ffffff" strokeLinecap="round" strokeWidth="5" opacity="0.7" />
    </svg>
  );
}

export function MasterAlchem({
  mood = "idle",
  size = "md",
  message,
  showBubble = false,
  showGlow = true,
  speaking,
  className,
  label,
}: MasterAlchemProps) {
  const reduced = useReducedMotion();
  const accessibleLabel = label ?? `Master Alchem, ${masterAlchemMoodLabels[mood].toLowerCase()}`;
  const isAvatar = size === "sm" || mood === "avatar";

  return (
    <motion.figure
      aria-label={accessibleLabel}
      className={cn("relative grid place-items-center", sizeClasses[size], className)}
      animate={reduced ? undefined : motionByMood[mood]}
      transition={{
        duration: mood === "warning" ? 1.6 : mood === "celebrating" || mood === "excited" ? 3.4 : 5.2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {showGlow ? (
        <motion.div
          className={cn(
            "absolute inset-5 rounded-full bg-gradient-to-br opacity-70 blur-2xl",
            moodAura[mood],
          )}
          animate={reduced ? undefined : { scale: [1, 1.1, 1], opacity: [0.45, 0.78, 0.45] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
        />
      ) : null}

      {mood === "celebrating" || mood === "excited" || mood === "hero" ? (
        <motion.div
          className="absolute -right-1 top-8 grid h-10 w-10 place-items-center rounded-2xl border-2 border-white bg-amber-200 text-amber-700 shadow-lg"
          animate={reduced ? undefined : { rotate: [0, 12, -8, 0], y: [0, -8, 0] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sparkles className="h-5 w-5" aria-hidden="true" />
        </motion.div>
      ) : null}

      {mood === "labGuide" || mood === "guide" || mood === "pointing" || mood === "speaking" ? (
        <motion.div
          className="absolute left-1 top-12 grid h-10 w-10 place-items-center rounded-2xl border-2 border-white bg-cyan-200 text-blue-700 shadow-lg"
          animate={reduced ? undefined : { x: [0, 8, 0], y: [0, -6, 0] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <FlaskConical className="h-5 w-5" aria-hidden="true" />
        </motion.div>
      ) : null}

      <div
        className={cn(
          "relative grid h-full w-full place-items-center overflow-hidden border-white/80 bg-white/35 shadow-2xl backdrop-blur-sm",
          isAvatar ? "rounded-full border-4" : "rounded-[2.4rem] border-[6px]",
        )}
      >
        <FallbackMasterAlchem mood={mood} speaking={speaking} />
      </div>

      {showBubble && message ? (
        <motion.figcaption
          className="absolute -bottom-4 left-1/2 w-[min(18rem,90vw)] -translate-x-1/2 rounded-[1.35rem] border-2 border-white bg-white/90 px-4 py-3 text-center text-sm font-black leading-5 text-slate-700 shadow-xl"
          animate={reduced ? undefined : { y: [0, -3, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          {message}
        </motion.figcaption>
      ) : null}
    </motion.figure>
  );
}
