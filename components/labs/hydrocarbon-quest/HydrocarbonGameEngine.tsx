"use client";

import { HydrocarbonNamingQuest } from "@/components/labs/hydrocarbon-quest/HydrocarbonNamingQuest";
import { SoundProvider } from "@/components/labs/hydrocarbon-quest/SoundProvider";

export function HydrocarbonGameEngine() {
  return (
    <SoundProvider>
      <HydrocarbonNamingQuest />
    </SoundProvider>
  );
}
