import type { Metadata } from "next";
import { HydrocarbonNamingQuest } from "@/components/labs/hydrocarbon-quest/HydrocarbonNamingQuest";

export const metadata: Metadata = {
  title: "Hydrocarbon Naming Quest",
  description:
    "Learn IUPAC hydrocarbon naming by tracing carbon families, ranking branches, and serving the double-bond VIP.",
};

export default function HydrocarbonNamingQuestPage() {
  return <HydrocarbonNamingQuest />;
}
