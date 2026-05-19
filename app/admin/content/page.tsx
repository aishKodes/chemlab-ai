import type { Metadata } from "next";
import { BookOpen, Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata: Metadata = {
  title: "Content Manager",
  description: "ChemLab AI admin content manager placeholder.",
};

export default function AdminContentPage() {
  return (
    <>
      <PageHeader
        eyebrow="Admin"
        title="Content manager"
        description="Create, publish, and audit chemistry chapters and lessons after role-based auth is enabled."
      />
      <Container className="pb-16">
        <EmptyState
          title="Content workflow placeholder"
          description="Chapters and lessons are modeled in Supabase. This route is reserved for safe admin authoring tools."
          icon={<BookOpen className="h-5 w-5" aria-hidden="true" />}
          action={<Button icon={<Plus className="h-4 w-4" aria-hidden="true" />}>Draft lesson</Button>}
        />
      </Container>
    </>
  );
}
