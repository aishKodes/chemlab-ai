import type { Metadata } from "next";
import { MoleculeExplorer } from "@/components/simulations/molecule-explorer/MoleculeExplorer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Molecule Explorer",
  description:
    "Rotate real 3D molecular models and learn how shape explains bonding in Chemlab.",
};

export default function MoleculeExplorerPage() {
  return (
    <>
      <PageHeader
        eyebrow="Featured Lab"
        title="Molecule Explorer"
        description="Rotate water, methane, carbon dioxide, ammonia, and an ionic crystal model. Watch shape become chemistry."
      />
      <Container className="pb-16">
        <MoleculeExplorer />
      </Container>
    </>
  );
}
