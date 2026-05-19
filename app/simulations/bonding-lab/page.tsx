import type { Metadata } from "next";
import { BondingLab } from "@/components/simulations/BondingLab";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Chemical Bonding Lab",
  description: "Compare ionic and covalent bonding examples with valence electron reasoning.",
};

export default function BondingLabPage() {
  return (
    <>
      <PageHeader
        eyebrow="Simulation"
        title="Chemical Bonding Lab"
        description="Compare electron transfer and sharing in sodium chloride, water, carbon dioxide, and methane."
      />
      <Container className="pb-16">
        <BondingLab />
      </Container>
    </>
  );
}
