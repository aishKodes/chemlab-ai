import type { Metadata } from "next";
import { HydrocarbonGameEngine } from "@/components/labs/hydrocarbon-quest/HydrocarbonGameEngine";

export const metadata: Metadata = {
  title: "Hydrocarbon Naming Quest",
  description:
    "Learn IUPAC hydrocarbon naming by tracing carbon families, ranking branches, and serving the double-bond VIP.",
};

export default function HydrocarbonNamingQuestPage() {
  return <HydrocarbonGameEngine />;
}
