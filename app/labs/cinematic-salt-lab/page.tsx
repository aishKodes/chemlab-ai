import type { Metadata } from "next";
import { NeutralizationStudio } from "@/components/labs/NeutralizationStudio";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Neutralization Studio",
  description:
    "A Chemlab story lab where students neutralize acid and base, track pH evidence, evaporate the solution, and reveal salt crystals with Master Alchem.",
};

export default function CinematicSaltLabPage() {
  return (
    <>
      <PageHeader
        eyebrow="Story Lab"
        title="Neutralization Studio"
        description="Run a guided neutralization lab with pH feedback, Master Alchem guidance, and a salt-crystal reveal."
      />
      <Container className="pb-16">
        <NeutralizationStudio />
      </Container>
    </>
  );
}
