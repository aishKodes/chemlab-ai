"use client";

export type HydrocarbonSoundEvent =
  | "click_atom"
  | "drag_pickup"
  | "snap_correct"
  | "snap_wrong"
  | "gentle_error"
  | "success_bell"
  | "flame_whoosh"
  | "level_complete";

export function useHydrocarbonSound() {
  function play(_event: HydrocarbonSoundEvent) {
    void _event;
    // Sound files are intentionally optional. Future audio can be wired here
    // without changing the gameplay components.
  }

  return { play };
}
