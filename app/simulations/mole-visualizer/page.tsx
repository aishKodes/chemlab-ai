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
        eyebrow="Virtual Lab"
        title="Mole Concept Visualizer"
        description="Watch mass become moles, then particle clouds, while Chem-Shastri turns Avogadro's number into a scale story."
      />
      <Container className="pb-16">
        <MoleVisualizer />
      </Container>
    </>
  );
}
