"use client";

import { useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { createRedoxOscillatorSound, RedoxSoundContext, redoxSoundFiles } from "./redoxSoundHooks";
import type { RedoxSoundEvent } from "./redoxTypes";

type WindowWithWebAudio = Window & {
  AudioContext?: typeof AudioContext;
  webkitAudioContext?: typeof AudioContext;
};

export function RedoxSoundProvider({ children }: { children: ReactNode }) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const [muted, setMuted] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem("chemlab:redox-muted") === "true";
  });

  const value = useMemo(
    () => ({
      muted,
      toggleMuted: () => {
        setMuted((current) => {
          const next = !current;
          if (typeof window !== "undefined") {
            window.localStorage.setItem("chemlab:redox-muted", String(next));
          }
          return next;
        });
      },
      play: (event: RedoxSoundEvent) => {
        if (muted || typeof window === "undefined") return;

        const browserWindow = window as WindowWithWebAudio;
        const AudioContextCtor = browserWindow.AudioContext || browserWindow.webkitAudioContext;

        const playFallback = () => {
          if (!AudioContextCtor) return;
          audioContextRef.current ??= new AudioContextCtor();
          createRedoxOscillatorSound(audioContextRef.current, event);
        };

        const src = redoxSoundFiles[event];
        if (!src) {
          playFallback();
          return;
        }

        const audio = new Audio(src);
        audio.volume = 0.26;
        audio.play().catch(playFallback);
      },
    }),
    [muted],
  );

  return <RedoxSoundContext.Provider value={value}>{children}</RedoxSoundContext.Provider>;
}
