import { Container } from "@/components/ui/Container";
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
    <section className="py-12 sm:py-16">
      <Container>
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />
      </Container>
    </section>
  );
}
