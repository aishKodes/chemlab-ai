import type { Metadata } from "next";
import { simulations } from "@/data/chemistry-modules";
import { SimulationCard } from "@/components/chemistry/SimulationCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Simulations",
  description: "Interactive chemistry simulations for atoms, periodic trends, moles, bonding, and equations.",
};

export default function SimulationsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Simulation lab"
        title="Explore chemistry by changing variables and watching the model respond."
        description="The first ChemLab AI simulations are focused v1 learning tools, built for clarity and future expansion."
      />
      <Container className="pb-16">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {simulations.map((simulation) => (
            <SimulationCard key={simulation.slug} simulation={simulation} />
          ))}
        </div>
      </Container>
    </>
  );
}
