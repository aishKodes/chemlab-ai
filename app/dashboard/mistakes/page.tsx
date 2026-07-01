import type { Metadata } from "next";
import { BrainCircuit, CheckCircle2, Flame, Ghost, WandSparkles } from "lucide-react";
import { MistakeMonsterCard } from "@/components/gamification/MistakeMonsterCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { MasterAlchemBubble } from "@/components/master-alchem/MasterAlchemBubble";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Mistake Monster Lab",
  description: "Turn wrong chemistry answers into named misconception objects with weaknesses, practice links, and Chem-Shastri rescue prompts.",
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
        eyebrow="Mistake Monster Lab"
        title="Mistake Monster Lab"
        description="Your mistakes are not failures. They are clues with names, weaknesses, practice links, and Chem-Shastri rescue prompts."
      />
      <Container className="pb-16">
        <MasterAlchemBubble
          compact
          mood="warning"
          eyebrow="No shame zone"
          message="A wrong answer is a useful signal. Name the misconception, attack its weakness, and try a smaller retry exercise."
          actionLabel="Ask Chem-Shastri"
          actionHref="/ai-tutor"
          className="mb-6"
        />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <MistakeMonsterCard
            name="Mass Number Goblin"
            concept="Atomic Structure"
            weakness="Protons plus neutrons. Electrons do not add to mass number."
            hp={35}
            tone="lime"
            icon={<Ghost className="h-10 w-10 text-lime-600" aria-hidden="true" />}
          />
          <MistakeMonsterCard
            name="Mole Ratio Phantom"
            concept="Mole Concept"
            weakness="Convert grams to moles before using reaction coefficients."
            hp={52}
            tone="cyan"
            icon={<BrainCircuit className="h-10 w-10 text-cyan-600" aria-hidden="true" />}
          />
          <MistakeMonsterCard
            name="Valency Dragon"
            concept="Chemical Bonding"
            weakness="Use charges to make ionic formulas neutral."
            hp={68}
            tone="coral"
            icon={<Flame className="h-10 w-10 text-orange-600" aria-hidden="true" />}
          />
          <MistakeMonsterCard
            name="Equilibrium Trickster"
            concept="Future World"
            weakness="Track stress, shift direction, and new equilibrium."
            hp={80}
            tone="violet"
            icon={<WandSparkles className="h-10 w-10 text-violet-600" aria-hidden="true" />}
          />
        </div>
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {mistakes.map((mistake) => (
            <Card key={mistake.title} className="bg-white/80">
              <Badge tone="amber">{mistake.chapter}</Badge>
              <h2 className="mt-4 text-xl font-black text-slate-950">{mistake.title}</h2>
              <p className="mt-3 text-sm font-medium leading-6 text-slate-600">{mistake.note}</p>
              <div className="mt-5 flex gap-2">
                <Button size="sm" variant="secondary" icon={<BrainCircuit className="h-4 w-4" aria-hidden="true" />}>
                  Ask Chem-Shastri
                </Button>
                <Button size="sm" variant="ghost" icon={<CheckCircle2 className="h-4 w-4" aria-hidden="true" />}>
                  Resolved
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </>
  );
}
