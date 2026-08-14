import type { Metadata } from "next";
import { MasterAlchemChat } from "@/components/ai/MasterAlchemChat";
import { PageHeader } from "@/components/layout/PageHeader";
import { MasterAlchemDock } from "@/components/master-alchem/MasterAlchemDock";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Chem-Shastri",
  description: "Meet Chem-Shastri, your NCERT Chemistry Guide for explanations, hints, quizzes, and lab guidance.",
};

export default function MasterAlchemPage() {
  return (
    <>
      <PageHeader
        eyebrow="Testing Mode"
        title="Chem-Shastri"
        description="Your NCERT Chemistry Guide. Ask a question in English, हिन्दी, or বাংলা and get a clear next step."
      />
      <Container className="pb-16">
        <MasterAlchemDock
          mood="idle"
          title="Ask in your own words."
          message="Chem-Shastri answers directly, uses your current topic when useful, and can explain, hint, quiz, or guide a lab."
          className="mb-6"
        />
        <MasterAlchemChat />
      </Container>
    </>
  );
}
