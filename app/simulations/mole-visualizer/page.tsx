import type { Metadata } from "next";
import { MoleVisualizer } from "@/components/simulations/MoleVisualizer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Mole Concept Visualizer",
  description: "Convert mass to moles and particle counts with a visual mole model.",
};

export default function MoleVisualizerPage() {
  return (
    <>
      <PageHeader
        eyebrow="Simulation"
        title="Mole Concept Visualizer"
        description="Connect measurable grams to moles and the enormous particle counts behind chemical quantities."
      />
      <Container className="pb-16">
        <MoleVisualizer />
      </Container>
    </>
  );
}
