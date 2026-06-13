"use client";

import { createContext, useContext } from "react";

export type HydrocarbonSoundEvent =
  | "atom_hover"
  | "atom_click"
  | "correct_chain_completed"
  | "wrong_chain"
  | "block_pick"
  | "block_snap_correct"
  | "name_forged"
  | "level_complete"
  | "badge_unlock"
  | "scene_transition"
  | "reset_camera"
  | "click_atom"
  | "drag_pickup"
  | "snap_correct"
  | "snap_wrong"
  | "gentle_error"
  | "success_bell"
  | "flame_whoosh";

export type HydrocarbonSoundApi = {
  muted: boolean;
  ready: boolean;
  setMuted: (muted: boolean) => void;
  toggleMuted: () => void;
  play: (event: HydrocarbonSoundEvent) => void;
  missingFiles: string[];
  proceduralFallbackEnabled: boolean;
};

export const expectedHydrocarbonSoundFiles = [
  "click_atom.mp3",
  "hover_atom.mp3",
  "trace_success.mp3",
  "wrong_choice.mp3",
  "block_pick.mp3",
  "block_snap.mp3",
  "forge_success.mp3",
  "level_complete.mp3",
  "badge_unlock.mp3",
  "soft_whoosh.mp3",
  "camera_reset.mp3",
];

export const soundEventToFile: Record<Exclude<HydrocarbonSoundEvent, "drag_pickup" | "snap_correct" | "snap_wrong" | "gentle_error" | "success_bell" | "flame_whoosh" | "click_atom">, string> = {
  atom_hover: "hover_atom.mp3",
  atom_click: "click_atom.mp3",
  correct_chain_completed: "trace_success.mp3",
  wrong_chain: "wrong_choice.mp3",
  block_pick: "block_pick.mp3",
  block_snap_correct: "block_snap.mp3",
  name_forged: "forge_success.mp3",
  level_complete: "level_complete.mp3",
  badge_unlock: "badge_unlock.mp3",
  scene_transition: "soft_whoosh.mp3",
  reset_camera: "camera_reset.mp3",
};

export const HydrocarbonSoundContext = createContext<HydrocarbonSoundApi | undefined>(undefined);

export function normalizeSoundEvent(event: HydrocarbonSoundEvent): Exclude<HydrocarbonSoundEvent, "drag_pickup" | "snap_correct" | "snap_wrong" | "gentle_error" | "success_bell" | "flame_whoosh" | "click_atom"> {
  if (event === "click_atom") return "atom_click";
  if (event === "drag_pickup") return "block_pick";
  if (event === "snap_correct") return "block_snap_correct";
  if (event === "snap_wrong" || event === "gentle_error") return "wrong_chain";
  if (event === "success_bell") return "name_forged";
  if (event === "flame_whoosh") return "scene_transition";
  return event;
}

export function useHydrocarbonSound() {
  const context = useContext(HydrocarbonSoundContext);
  if (context) return context;
  return {
    muted: true,
    ready: false,
    setMuted: () => undefined,
    toggleMuted: () => undefined,
    play: () => undefined,
    missingFiles: expectedHydrocarbonSoundFiles,
    proceduralFallbackEnabled: true,
  } satisfies HydrocarbonSoundApi;
}
