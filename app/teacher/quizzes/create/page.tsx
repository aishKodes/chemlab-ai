"use client";

import { RoleGuard } from "@/components/auth/RoleGuard";
import { CreateTeacherQuizForm } from "@/components/live-quiz/CreateTeacherQuizForm";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";

export default function CreateTeacherQuizPage() {
  return (
    <RoleGuard allowed={["teacher", "admin"]}>
      <PageHeader
        eyebrow="Create Quiz"
        title="Make a live room for your class."
        description="Start with a small quiz, then share a 6-digit PIN when students are ready."
      />
      <Container className="pb-16">
        <CreateTeacherQuizForm />
      </Container>
    </RoleGuard>
  );
}
