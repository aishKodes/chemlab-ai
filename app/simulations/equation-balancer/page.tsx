import type { Metadata } from "next";
import { EquationBalancer } from "@/components/simulations/EquationBalancer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Equation Balance Checker",
  description: "Check whether a chemical equation conserves atoms on both sides.",
};

export default function EquationBalancerSimulationPage() {
  return (
    <>
      <PageHeader
        eyebrow="Virtual Lab"
        title="Equation Balance Checker"
        description="Balance reactions like a puzzle game. Match every atom, clear the challenge, and let Chem-Shastri explain the conservation clue."
      />
      <Container className="pb-16">
        <EquationBalancer />
      </Container>
    </>
  );
}
