import type { Metadata } from "next";
import { QuestMap } from "@/components/gamification/QuestMap";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Chemistry Worlds",
  description: "Choose colourful Chemlab chapter worlds with simulations, Master Alchem guidance, boss quizzes, and mistake objects.",
};

export default function ChemistryCurriculumPage() {
  return (
    <>
      <PageHeader
        eyebrow="Learn"
        title="Chemistry Worlds"
        description="Every chapter is a world. Every quest connects simulations, Master Alchem guidance, boss quizzes, and mistake objects."
      />
      <Container className="pb-16">
        <QuestMap />
      </Container>
    </>
  );
}
