"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useRedoxSound } from "./redoxSoundHooks";

export function RedoxSoundToggle() {
  const { muted, toggleMuted } = useRedoxSound();

  return (
    <button
      type="button"
      onClick={toggleMuted}
      className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/12 px-3 py-2 text-sm font-semibold text-white shadow-lg backdrop-blur-md transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-200"
      aria-label={muted ? "Turn Redox Kitchen sound on" : "Mute Redox Kitchen sound"}
    >
      {muted ? <VolumeX className="h-4 w-4" aria-hidden /> : <Volume2 className="h-4 w-4" aria-hidden />}
      <span>{muted ? "Sound off" : "Sound on"}</span>
    </button>
  );
}
