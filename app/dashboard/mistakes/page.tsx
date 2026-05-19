import type { Metadata } from "next";
import { BrainCircuit, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Mistake Notebook",
  description: "Review chemistry mistakes and convert them into targeted practice.",
};

const mistakes = [
  {
    title: "Isotope vs element identity",
    chapter: "Atomic Structure",
    note: "Changing neutrons changes isotope, not element. Protons define the element.",
  },
  {
    title: "Balancing by changing subscripts",
    chapter: "Chemical Reactions",
    note: "Use coefficients to balance; subscripts change compound identity.",
  },
  {
    title: "Mole ratio from grams",
    chapter: "Mole Concept",
    note: "Convert grams to moles before comparing equation coefficients.",
  },
];

export default function MistakesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Mistake notebook"
        title="Turn wrong answers into repair loops."
        description="A focused notebook for unresolved misconceptions, future spaced repetition, and AI tutor follow-up."
      />
      <Container className="pb-16">
        <div className="grid gap-4 lg:grid-cols-3">
          {mistakes.map((mistake) => (
            <Card key={mistake.title}>
              <Badge tone="amber">{mistake.chapter}</Badge>
              <h2 className="mt-4 text-xl font-semibold text-white">{mistake.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">{mistake.note}</p>
              <div className="mt-5 flex gap-2">
                <Button size="sm" variant="secondary" icon={<BrainCircuit className="h-4 w-4" aria-hidden="true" />}>
                  Ask tutor
                </Button>
                <Button size="sm" variant="ghost" icon={<CheckCircle2 className="h-4 w-4" aria-hidden="true" />}>
                  Mark resolved
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </>
  );
}
