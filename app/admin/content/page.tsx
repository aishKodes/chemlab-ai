import type { Metadata } from "next";
import { BookOpen, Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata: Metadata = {
  title: "Content Manager",
  description: "Chemlab admin content manager placeholder.",
};

export default function AdminContentPage() {
  return (
    <>
      <PageHeader
        eyebrow="Admin"
        title="Content manager"
        description="Prepare chemistry chapters, quests, and lessons for students."
      />
      <Container className="pb-16">
        <EmptyState
          title="Content workflow placeholder"
          description="Content tools will help teachers shape worlds, lessons, and lab missions."
          icon={<BookOpen className="h-5 w-5" aria-hidden="true" />}
          action={<Button icon={<Plus className="h-4 w-4" aria-hidden="true" />}>Draft lesson</Button>}
        />
      </Container>
    </>
  );
}
