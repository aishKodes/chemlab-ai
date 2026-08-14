import type { Metadata } from "next";
import { FileQuestion, Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata: Metadata = {
  title: "Question Manager",
  description: "chemlearning admin question manager placeholder.",
};

export default function AdminQuestionsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Admin"
        title="Question manager"
        description="Prepare boss battles, warm-up questions, and mistake-repair prompts."
      />
      <Container className="pb-16">
        <EmptyState
          title="Question editor coming next"
          description="Question tools will help turn practice into clearer feedback for students."
          icon={<FileQuestion className="h-5 w-5" aria-hidden="true" />}
          action={<Button icon={<Plus className="h-4 w-4" aria-hidden="true" />}>Draft question</Button>}
        />
      </Container>
    </>
  );
}
