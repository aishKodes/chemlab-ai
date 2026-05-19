import type { Metadata } from "next";
import { FileQuestion, Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata: Metadata = {
  title: "Question Manager",
  description: "ChemLab AI admin question manager placeholder.",
};

export default function AdminQuestionsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Admin"
        title="Question manager"
        description="Schema and seed data are ready; the authenticated editorial workflow can be layered here."
      />
      <Container className="pb-16">
        <EmptyState
          title="Question editor coming next"
          description="This placeholder protects the route contract while the MVP uses local sample questions and Supabase seed data."
          icon={<FileQuestion className="h-5 w-5" aria-hidden="true" />}
          action={<Button icon={<Plus className="h-4 w-4" aria-hidden="true" />}>Draft question</Button>}
        />
      </Container>
    </>
  );
}
