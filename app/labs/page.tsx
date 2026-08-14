import type { Metadata } from "next";
import { StoryLabPreview } from "@/components/labs/StoryLabPreview";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Story Labs",
  description:
    "chemlearning story labs turn chemistry practicals into guided scenes with Chem-Shastri, lab actions, evidence checks, and quiz moments.",
};

export default function LabsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Labs"
        title="Story Labs"
        description="Build cells, mix reactions, follow evidence, and unlock mastery with Chem-Shastri beside you."
      />
      <Container className="pb-16">
        <StoryLabPreview />
      </Container>
    </>
  );
}
