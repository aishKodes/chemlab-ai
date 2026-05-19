import type { Metadata } from "next";
import { AiTutorChat } from "@/components/ai/AiTutorChat";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "AI Tutor",
  description: "Ask ChemLab AI chemistry questions with explain, hint, quiz, and exam modes.",
};

export default function AiTutorPage() {
  return (
    <>
      <PageHeader
        eyebrow="AI chemistry tutor"
        title="Ask for hints, reasoning, checks, or exam-mode explanations."
        description="The browser talks only to /api/ai. Provider keys and usage logging stay on the server."
      />
      <Container className="pb-16">
        <AiTutorChat />
      </Container>
    </>
  );
}
