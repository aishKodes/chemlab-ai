export type ElectrochemistrySoundEvent = "soft_click" | "circuit_connect" | "electron_hum" | "voltage_success" | "wrong_soft" | "level_complete";

export function playElectrochemistrySound(event: ElectrochemistrySoundEvent, muted: boolean) {
  if (muted || typeof window === "undefined") return;
  const AudioContextCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextCtor) return;
  const context = new AudioContextCtor();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const frequency = {
    soft_click: 420,
    circuit_connect: 620,
    electron_hum: 280,
    voltage_success: 760,
    wrong_soft: 180,
    level_complete: 880,
  }[event];
  oscillator.frequency.value = frequency;
  oscillator.type = event === "wrong_soft" ? "sine" : "triangle";
  gain.gain.setValueAtTime(0.0001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.035, context.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.22);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.24);
}
