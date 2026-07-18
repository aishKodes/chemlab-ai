import type { Metadata } from "next";
import { ElectrochemistryPowerGrid } from "@/components/labs/electrochemistry-power-grid/ElectrochemistryPowerGrid";

export const metadata: Metadata = {
  title: "Electrochemistry Power Grid Studio",
  description: "Build a Daniell cell, watch electrons flow, and control voltage with the Nernst equation.",
};

export default function ElectrochemistryPowerGridPage() {
  return <ElectrochemistryPowerGrid />;
}
