"use client";

import { use } from "react";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { TeacherLiveRoom } from "@/components/live-quiz/TeacherLiveRoom";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";

export default function TeacherLiveResultsPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = use(params);
  return (
    <RoleGuard allowed={["teacher", "admin"]}>
      <PageHeader
        eyebrow="Live Results"
        title="Classroom results."
        description="Review scores, timing, and participation after the live quiz."
      />
      <Container className="pb-16">
        <TeacherLiveRoom sessionId={sessionId} resultsOnly />
      </Container>
    </RoleGuard>
  );
}
