import type { Metadata } from "next";
import { EquationBalancerTool } from "@/components/tools/EquationBalancerTool";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Equation Balancer Tool",
  description: "Check chemical equations for atom-count balance.",
};

export default function EquationBalancerToolPage() {
  return (
    <>
      <PageHeader
        eyebrow="Tool"
        title="Equation Balance Checker"
        description="Validate whether a typed reaction has equal atom counts on reactant and product sides."
      />
      <Container className="pb-16">
        <EquationBalancerTool />
      </Container>
    </>
  );
}
