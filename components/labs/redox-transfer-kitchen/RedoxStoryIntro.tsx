"use client";

import { RedoxStoryFramePlayer } from "./RedoxStoryFramePlayer";

export function RedoxStoryIntro({ onComplete }: { onComplete: () => void }) {
  return <RedoxStoryFramePlayer onComplete={onComplete} />;
}
