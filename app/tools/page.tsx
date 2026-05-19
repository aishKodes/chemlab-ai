import type { Metadata } from "next";
import { ToolCard, tools } from "@/components/chemistry/ToolCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Chemistry Tools",
  description: "Molecular mass, mole conversion, and equation balance checking tools.",
};

export default function ToolsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Chemistry tools"
        title="Calculation tools that show the method, not just the answer."
        description="Use the utilities students reach for while solving formula, mole, and reaction problems."
      />
      <Container className="pb-16">
        <div className="grid gap-4 md:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </Container>
    </>
  );
}
