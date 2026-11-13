import type { Metadata } from "next";
import { AcidBaseDiscovery } from "@/components/labs/acid-base-discovery/AcidBaseDiscovery";

export const metadata: Metadata = {
  title: "Acid-Base Discovery",
  description:
    "Compare acid strength, concentration, pH, and conductivity in a guided particle-level chemistry lab.",
};

export default function AcidBaseDiscoveryPage() {
  return <AcidBaseDiscovery />;
}
