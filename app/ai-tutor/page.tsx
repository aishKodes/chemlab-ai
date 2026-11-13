import type { Metadata } from "next";
import { MasterAlchemChat } from "@/components/ai/MasterAlchemChat";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Chem-Shastri",
  description:
    "Meet Chem-Shastri, your NCERT Chemistry Guide for explanations, hints, quizzes, and lab guidance.",
};

export default function MasterAlchemPage() {
  return (
    <Container className="max-w-5xl py-6">
      <MasterAlchemChat />
    </Container>
  );
}
