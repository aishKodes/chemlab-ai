import type { Metadata } from "next";
import { MolecularMassCalculator } from "@/components/tools/MolecularMassCalculator";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Molecular Mass Calculator",
  description: "Calculate molar mass and formula breakdowns for common chemical formulas.",
};

export default function MolecularMassCalculatorPage() {
  return (
    <>
      <PageHeader
        eyebrow="Tool"
        title="Molecular Mass Calculator"
        description="Parse chemical formulas and inspect element-by-element molar mass contributions."
      />
      <Container className="pb-16">
        <MolecularMassCalculator />
      </Container>
    </>
  );
}
