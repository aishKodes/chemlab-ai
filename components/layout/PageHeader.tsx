import { Container } from "@/components/ui/Container";
import { FloatingMoleculeBackground } from "@/components/ui/FloatingMoleculeBackground";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="relative overflow-hidden py-12 sm:py-16">
      <FloatingMoleculeBackground />
      <Container className="relative">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />
      </Container>
    </section>
  );
}
