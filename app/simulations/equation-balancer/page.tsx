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
        eyebrow="Simulation"
        title="Equation Balance Checker"
        description="Count atoms on reactant and product sides to make conservation of mass visible."
      />
      <Container className="pb-16">
        <EquationBalancer />
      </Container>
    </>
  );
}
