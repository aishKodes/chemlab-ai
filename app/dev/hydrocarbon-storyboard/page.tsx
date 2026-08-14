import type { Metadata } from "next";
import { HydrocarbonStoryboardDebug } from "@/components/labs/hydrocarbon-quest/HydrocarbonStoryboardDebug";

export const metadata: Metadata = {
  title: "Hydrocarbon Storyboard | chemlearning",
};

export default function HydrocarbonStoryboardPage() {
  return <HydrocarbonStoryboardDebug />;
}
