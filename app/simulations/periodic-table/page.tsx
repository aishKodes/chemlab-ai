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
        eyebrow="Virtual Lab"
        title="Periodic Table Explorer"
        description="Click colourful element cards, discover families, compare trends, and ask Master Alchem why each element behaves the way it does."
      />
      <Container className="pb-16">
        <PeriodicTableExplorer />
      </Container>
    </>
  );
}
