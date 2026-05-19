import type { Metadata } from "next";
import { PeriodicTableExplorer } from "@/components/simulations/PeriodicTableExplorer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Periodic Table Explorer",
  description: "Explore the first 30 elements with search, filters, and trend notes.",
};

export default function PeriodicTableSimulationPage() {
  return (
    <>
      <PageHeader
        eyebrow="Simulation"
        title="Periodic Table Explorer"
        description="Search, filter, and inspect element families, shell configurations, oxidation states, and early periodic trends."
      />
      <Container className="pb-16">
        <PeriodicTableExplorer />
      </Container>
    </>
  );
}
