"use client";

export type SiBattleSound = "click" | "correct" | "wrong" | "combo" | "complete";

export function playSiBattleSound(event: SiBattleSound, muted: boolean) {
  if (muted || typeof window === "undefined") return;
  const AudioContextCtor = window.AudioContext ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextCtor) return;
  const context = new AudioContextCtor();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const notes: Record<SiBattleSound, [number, number]> = {
    click: [330, 0.05],
    correct: [660, 0.12],
    wrong: [180, 0.12],
    combo: [880, 0.14],
    complete: [1040, 0.22],
  };
  const [frequency, duration] = notes[event];
  oscillator.frequency.setValueAtTime(frequency, context.currentTime);
  oscillator.type = event === "wrong" ? "sine" : "triangle";
  gain.gain.setValueAtTime(0.0001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.045, context.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);
  oscillator.connect(gain).connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + duration + 0.02);
  oscillator.addEventListener("ended", () => void context.close());
}
