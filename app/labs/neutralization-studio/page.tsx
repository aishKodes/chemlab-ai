import type { Metadata } from "next";
import { NeutralizationStudio } from "@/components/labs/NeutralizationStudio";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Neutralization Studio",
  description:
    "Mix acid and base, watch pH change, find the neutral point, evaporate water, and reveal salt crystals in Chemlab.",
};

export default function NeutralizationStudioPage() {
  return (
    <>
      <PageHeader
        eyebrow="Featured Lab"
        title="Neutralization Studio"
        description="Discover how acid and base become salt and water. Master Alchem guides each step."
      />
      <Container className="pb-16">
        <NeutralizationStudio />
      </Container>
    </>
  );
}

