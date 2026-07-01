import type { Metadata } from "next";
import { MasterAlchemChat } from "@/components/ai/MasterAlchemChat";
import { PageHeader } from "@/components/layout/PageHeader";
import { MasterAlchemDock } from "@/components/master-alchem/MasterAlchemDock";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Chem-Shastri",
  description: "Meet Chem-Shastri, Chemlab's magical AI mentor for chemistry explanations, hints, lab guide mode, quizzes, and answer checking.",
};

export default function MasterAlchemPage() {
  return (
    <>
      <PageHeader
        eyebrow="AI Mentor"
        title="Chem-Shastri"
        description="A warm alchemical mentor who explains chemistry with hints, questions, lab thinking, and no-shame mistake repair."
      />
      <Container className="pb-16">
        <MasterAlchemDock
          mood="idle"
          title="Chem-Shastri is your guide through the chemistry universe."
          message="Choose Explain, Hint, Step-by-Step, Quiz Me, Check My Answer, Exam Mode, or Lab Guide Mode. Ask in your own words, and Chem-Shastri will guide the next step."
          className="mb-6"
        />
        <MasterAlchemChat />
      </Container>
    </>
  );
}
