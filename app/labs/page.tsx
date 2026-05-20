import type { Metadata } from "next";
import { StoryLabPreview } from "@/components/labs/StoryLabPreview";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Story Labs",
  description:
    "Chemlab story labs turn practical chemistry into cinematic guided scenes with Master Alchem, lab actions, evidence checks, and quiz moments.",
};

export default function LabsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Labs"
        title="Story Labs"
        description="Cinematic practicals where students predict, test, observe, explain, and unlock mastery with Master Alchem beside them."
      />
      <Container className="pb-16">
        <StoryLabPreview />
      </Container>
    </>
  );
}
