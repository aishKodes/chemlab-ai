import type { Metadata } from "next";
import { MoleCalculator } from "@/components/tools/MoleCalculator";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Mole Calculator",
  description: "Convert mass, moles, and particles with Chemlab.",
};

export default function MoleCalculatorPage() {
  return (
    <>
      <PageHeader
        eyebrow="Tool"
        title="Mole Calculator"
        description="Move between grams, moles, and particles with formulas visible at every step."
      />
      <Container className="pb-16">
        <MoleCalculator />
      </Container>
    </>
  );
}
