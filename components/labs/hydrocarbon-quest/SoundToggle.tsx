"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useHydrocarbonSound } from "@/components/labs/hydrocarbon-quest/soundHooks";
import { cn } from "@/lib/utils";

export function SoundToggle({ className }: { className?: string }) {
  const sound = useHydrocarbonSound();
  return (
    <button
      type="button"
      onClick={sound.toggleMuted}
      className={cn(
        "focus-ring inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/82 px-3 py-2 text-xs font-black text-slate-800 shadow-lg backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white",
        className,
      )}
      aria-pressed={!sound.muted}
      aria-label={sound.muted ? "Turn Hydrocarbon Quest sound on" : "Mute Hydrocarbon Quest sound"}
    >
      {sound.muted ? <VolumeX className="h-4 w-4" aria-hidden="true" /> : <Volume2 className="h-4 w-4" aria-hidden="true" />}
      {sound.muted ? "Sound off" : "Sound on"}
    </button>
  );
}
