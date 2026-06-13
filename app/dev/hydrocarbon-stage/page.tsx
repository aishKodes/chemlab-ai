import type { Metadata } from "next";
import { HydrocarbonStageDebug } from "@/components/labs/hydrocarbon-quest/HydrocarbonStageDebug";

export const metadata: Metadata = {
  title: "Hydrocarbon Stage Debug",
  description: "Development staging page for Hydrocarbon Naming Quest cinematic layouts.",
};

export default function HydrocarbonStagePage() {
  return <HydrocarbonStageDebug />;
}
