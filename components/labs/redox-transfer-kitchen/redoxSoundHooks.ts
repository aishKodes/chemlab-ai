"use client";

import { createContext, useContext } from "react";
import type { RedoxSoundEvent } from "./redoxTypes";

export type RedoxSoundContextValue = {
  muted: boolean;
  toggleMuted: () => void;
  play: (event: RedoxSoundEvent) => void;
};

export const RedoxSoundContext = createContext<RedoxSoundContextValue | null>(null);

export const redoxSoundFiles: Partial<Record<RedoxSoundEvent, string>> = {
  murukku_transfer_start: "/sounds/redox-transfer-kitchen/murukku_pick.mp3",
  murukku_received: "/sounds/redox-transfer-kitchen/murukku_give.mp3",
  electron_release: "/sounds/redox-transfer-kitchen/electron_release.mp3",
  electron_travel: "/sounds/redox-transfer-kitchen/electron_travel.mp3",
  ion_transform: "/sounds/redox-transfer-kitchen/ion_transform.mp3",
  correct_answer: "/sounds/redox-transfer-kitchen/correct_answer.mp3",
  wrong_answer_soft: "/sounds/redox-transfer-kitchen/wrong_answer_soft.mp3",
  ledger_check: "/sounds/redox-transfer-kitchen/correct_answer.mp3",
  level_complete: "/sounds/redox-transfer-kitchen/level_complete.mp3",
  badge_unlock: "/sounds/redox-transfer-kitchen/badge_unlock.mp3",
  transition_whoosh: "/sounds/redox-transfer-kitchen/soft_whoosh.mp3",
};

export function createRedoxOscillatorSound(context: AudioContext, event: RedoxSoundEvent) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const now = context.currentTime;
  const settings: Record<RedoxSoundEvent, { start: number; end: number; duration: number; type?: OscillatorType }> = {
    murukku_transfer_start: { start: 520, end: 720, duration: 0.12, type: "triangle" },
    murukku_received: { start: 360, end: 620, duration: 0.2, type: "sine" },
    electron_release: { start: 900, end: 1240, duration: 0.16, type: "square" },
    electron_travel: { start: 660, end: 1120, duration: 0.22, type: "sine" },
    ion_transform: { start: 420, end: 780, duration: 0.28, type: "triangle" },
    correct_answer: { start: 640, end: 980, duration: 0.22, type: "sine" },
    wrong_answer_soft: { start: 220, end: 170, duration: 0.24, type: "sine" },
    ledger_check: { start: 720, end: 960, duration: 0.16, type: "triangle" },
    level_complete: { start: 520, end: 1040, duration: 0.36, type: "triangle" },
    badge_unlock: { start: 760, end: 1320, duration: 0.34, type: "sine" },
    transition_whoosh: { start: 260, end: 640, duration: 0.34, type: "sine" },
  };
  const setting = settings[event];

  oscillator.type = setting.type ?? "sine";
  oscillator.frequency.setValueAtTime(setting.start, now);
  oscillator.frequency.exponentialRampToValueAtTime(setting.end, now + setting.duration);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.045, now + 0.025);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + setting.duration);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(now);
  oscillator.stop(now + setting.duration + 0.02);
}

export function useRedoxSound() {
  const value = useContext(RedoxSoundContext);
  if (!value) {
    return {
      muted: true,
      toggleMuted: () => undefined,
      play: () => undefined,
    } satisfies RedoxSoundContextValue;
  }
  return value;
}
