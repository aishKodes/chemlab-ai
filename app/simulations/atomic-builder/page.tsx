import type { Metadata } from "next";
import { AtomicBuilder } from "@/components/simulations/AtomicBuilder";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Atomic Builder",
  description: "Build atoms with protons, neutrons, and electrons in Chemlab.",
};

export default function AtomicBuilderPage() {
  return (
    <>
      <PageHeader
        eyebrow="Virtual Lab"
        title="Atomic Builder"
        description="Touch the atom. Change the charge. Watch identity, isotope, and ion logic respond while Chem-Shastri keeps the model grounded."
      />
      <Container className="pb-16">
        <AtomicBuilder />
      </Container>
    </>
  );
}
