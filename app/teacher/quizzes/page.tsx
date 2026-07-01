"use client";

import { RoleGuard } from "@/components/auth/RoleGuard";
import { TeacherQuizList } from "@/components/live-quiz/TeacherQuizList";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";

export default function TeacherQuizzesPage() {
  return (
    <RoleGuard allowed={["teacher", "admin"]}>
      <PageHeader
        eyebrow="Teacher Quizzes"
        title="Run live chemistry battles."
        description="Create classroom quiz rooms, share a PIN, and see student results as they answer."
      />
      <Container className="pb-16">
        <TeacherQuizList />
      </Container>
    </RoleGuard>
  );
}
