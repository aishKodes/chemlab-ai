import type { Metadata } from "next";
import { RedoxStoryboardDebug } from "@/components/labs/redox-transfer-kitchen/RedoxStoryboardDebug";

export const metadata: Metadata = {
  title: "Redox Storyboard Debug | chemlearning",
  robots: { index: false, follow: false },
};

export default function RedoxStoryboardPage() {
  return <RedoxStoryboardDebug />;
}
