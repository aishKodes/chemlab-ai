import type { Metadata } from "next";
import { BondingLab } from "@/components/simulations/BondingLab";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Chemical Bonding Lab",
  description: "Compare ionic and covalent bonding examples with valence electron reasoning.",
};

export default function BondingLabPage() {
  return (
    <>
      <PageHeader
        eyebrow="Virtual Lab"
        title="Chemical Bonding Lab"
        description="Enter the bonding playground: combine atom cards, compare ionic and covalent rules, and let Chem-Shastri point out the valence pattern."
      />
      <Container className="pb-16">
        <BondingLab />
      </Container>
    </>
  );
}
