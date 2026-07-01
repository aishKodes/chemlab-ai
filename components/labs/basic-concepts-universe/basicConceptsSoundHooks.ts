"use client";

export type BasicConceptsSoundEvent = "zone_open" | "checkpoint_correct" | "checkpoint_wrong" | "zone_complete" | "badge_unlock";

export function playBasicConceptsSound(event: BasicConceptsSoundEvent) {
  if (typeof window === "undefined") return;
  const AudioContextCtor = window.AudioContext ?? window.webkitAudioContext;
  if (!AudioContextCtor) return;
  try {
    const context = new AudioContextCtor();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const frequency = event === "checkpoint_wrong" ? 180 : event === "badge_unlock" ? 660 : 420;
    oscillator.frequency.value = frequency;
    oscillator.type = "sine";
    gain.gain.value = 0.03;
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.12);
    oscillator.onended = () => void context.close();
  } catch {
    // Sound is optional; missing audio support should never block learning.
  }
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}
