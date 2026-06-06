import type { Metadata } from "next";
import { HydrocarbonAssetDebug } from "@/components/labs/hydrocarbon-quest/HydrocarbonAssetDebug";

export const metadata: Metadata = {
  title: "Hydrocarbon Asset Debug",
  description: "Development preview for Hydrocarbon Naming Quest assets.",
};

export default function HydrocarbonAssetsPage() {
  return <HydrocarbonAssetDebug />;
}
