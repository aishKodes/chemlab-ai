import type { Metadata } from "next";
import { AtomicBuilder } from "@/components/simulations/AtomicBuilder";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Atomic Builder",
  description: "Build atoms with protons, neutrons, and electrons in ChemLab AI.",
};

export default function AtomicBuilderPage() {
  return (
    <>
      <PageHeader
        eyebrow="Simulation"
        title="Atomic Builder"
        description="Adjust subatomic particles to inspect element identity, isotope mass, ionic charge, and shell configuration."
      />
      <Container className="pb-16">
        <AtomicBuilder />
      </Container>
    </>
  );
}
