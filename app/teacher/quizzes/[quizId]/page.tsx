"use client";

import { use } from "react";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { TeacherQuizDetail } from "@/components/live-quiz/TeacherLiveRoom";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";

export default function TeacherQuizDetailPage({ params }: { params: Promise<{ quizId: string }> }) {
  const { quizId } = use(params);
  return (
    <RoleGuard allowed={["teacher", "admin"]}>
      <PageHeader
        eyebrow="Teacher Quiz"
        title="Start a live quiz room."
        description="Share the PIN on the classroom board and watch answers arrive."
      />
      <Container className="pb-16">
        <TeacherQuizDetail quizId={quizId} />
      </Container>
    </RoleGuard>
  );
}
