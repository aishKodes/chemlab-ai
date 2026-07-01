"use client";

import { useState } from "react";
import { RedoxGameEngine } from "./RedoxGameEngine";
import { RedoxSoundProvider } from "./RedoxSoundProvider";
import { RedoxStoryIntro } from "./RedoxStoryIntro";
import { useSimulationSession } from "@/hooks/useSimulationSession";

export function RedoxTransferKitchen() {
  const [mode, setMode] = useState<"story" | "game">("story");
  useSimulationSession("redox-transfer-kitchen");

  return (
    <RedoxSoundProvider>
      {mode === "story" ? <RedoxStoryIntro onComplete={() => setMode("game")} /> : <RedoxGameEngine onRestartStory={() => setMode("story")} />}
    </RedoxSoundProvider>
  );
}
