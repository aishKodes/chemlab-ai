"use client";

import type { ReactNode } from "react";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  expectedHydrocarbonSoundFiles,
  HydrocarbonSoundContext,
  normalizeSoundEvent,
  soundEventToFile,
  type HydrocarbonSoundEvent,
} from "@/components/labs/hydrocarbon-quest/soundHooks";

const storageKey = "chemlab-hydrocarbon-sound-muted";
const basePath = "/sounds/hydrocarbon-quest";

export function SoundProvider({ children }: { children: ReactNode }) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const availabilityRef = useRef(new Map<string, boolean>());
  const [muted, setMutedState] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return window.localStorage.getItem(storageKey) === "true";
    } catch {
      return false;
    }
  });
  const [ready, setReady] = useState(false);

  const setMuted = useCallback((nextMuted: boolean) => {
    setMutedState(nextMuted);
    try {
      window.localStorage.setItem(storageKey, String(nextMuted));
    } catch {
      // localStorage can be unavailable in private contexts; sound still works.
    }
  }, []);

  const ensureContext = useCallback(() => {
    if (typeof window === "undefined") return undefined;
    if (!audioContextRef.current) {
      audioContextRef.current = new window.AudioContext();
    }
    if (audioContextRef.current.state === "suspended") {
      void audioContextRef.current.resume();
    }
    setReady(true);
    return audioContextRef.current;
  }, []);

  const play = useCallback(
    (event: HydrocarbonSoundEvent) => {
      if (muted) return;
      const normalized = normalizeSoundEvent(event);
      const context = ensureContext();
      if (!context) return;
      const fileName = soundEventToFile[normalized];
      void playLocalFileIfAvailable(fileName, availabilityRef.current);
      playProceduralSound(context, normalized);
    },
    [ensureContext, muted],
  );

  const value = useMemo(
    () => ({
      muted,
      ready,
      setMuted,
      toggleMuted: () => setMuted(!muted),
      play,
      missingFiles: expectedHydrocarbonSoundFiles,
      proceduralFallbackEnabled: true,
    }),
    [muted, play, ready, setMuted],
  );

  return <HydrocarbonSoundContext.Provider value={value}>{children}</HydrocarbonSoundContext.Provider>;
}

async function playLocalFileIfAvailable(fileName: string, availability: Map<string, boolean>) {
  const cached = availability.get(fileName);
  if (cached === false) return;
  if (cached === undefined) {
    const exists = await checkSoundFile(fileName);
    availability.set(fileName, exists);
    if (!exists) return;
  }

  const audio = new Audio(`${basePath}/${fileName}`);
  audio.volume = getFileVolume(fileName);
  await audio.play().catch(() => availability.set(fileName, false));
}

async function checkSoundFile(fileName: string) {
  try {
    const response = await fetch(`${basePath}/${fileName}`, { method: "HEAD" });
    return response.ok;
  } catch {
    return false;
  }
}

function playProceduralSound(context: AudioContext, event: ReturnType<typeof normalizeSoundEvent>) {
  const now = context.currentTime;
  if (event === "wrong_chain") {
    tone(context, 160, now, 0.11, 0.2, "sawtooth");
    tone(context, 132, now + 0.08, 0.1, 0.16, "sine");
    return;
  }
  if (event === "correct_chain_completed") {
    tone(context, 420, now, 0.08, 0.28, "sine");
    tone(context, 660, now + 0.09, 0.12, 0.34, "sine");
    return;
  }
  if (event === "name_forged" || event === "badge_unlock") {
    [520, 660, 880].forEach((frequency, index) => tone(context, frequency, now + index * 0.075, 0.11, 0.32, "triangle"));
    return;
  }
  if (event === "level_complete") {
    [392, 494, 587, 784].forEach((frequency, index) => tone(context, frequency, now + index * 0.07, 0.12, 0.34, "triangle"));
    return;
  }
  if (event === "scene_transition") {
    whoosh(context, now);
    return;
  }
  if (event === "reset_camera") {
    tone(context, 320, now, 0.08, 0.22, "sine");
    tone(context, 240, now + 0.07, 0.08, 0.16, "sine");
    return;
  }
  if (event === "atom_hover") {
    tone(context, 920, now, 0.035, 0.08, "sine");
    return;
  }
  if (event === "block_pick") {
    tone(context, 260, now, 0.06, 0.22, "triangle");
    return;
  }
  if (event === "block_snap_correct") {
    tone(context, 440, now, 0.06, 0.24, "triangle");
    tone(context, 620, now + 0.045, 0.07, 0.22, "triangle");
    return;
  }
  tone(context, 520, now, 0.045, 0.22, "sine");
}

function tone(
  context: AudioContext,
  frequency: number,
  start: number,
  duration: number,
  gainValue: number,
  type: OscillatorType,
) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(gainValue, start + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.02);
}

function whoosh(context: AudioContext, start: number) {
  const duration = 0.32;
  const bufferSize = Math.floor(context.sampleRate * duration);
  const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let index = 0; index < bufferSize; index += 1) {
    data[index] = (Math.random() * 2 - 1) * (1 - index / bufferSize);
  }
  const source = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(1100, start);
  filter.frequency.exponentialRampToValueAtTime(260, start + duration);
  gain.gain.setValueAtTime(0.08, start);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  source.buffer = buffer;
  source.connect(filter);
  filter.connect(gain);
  gain.connect(context.destination);
  source.start(start);
}

function getFileVolume(fileName: string) {
  if (fileName.includes("wrong")) return 0.2;
  if (fileName.includes("complete") || fileName.includes("badge") || fileName.includes("success")) return 0.35;
  if (fileName.includes("whoosh")) return 0.08;
  return 0.25;
}
