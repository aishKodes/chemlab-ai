"use client";

import { use } from "react";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { TeacherLiveRoom } from "@/components/live-quiz/TeacherLiveRoom";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";

export default function TeacherLivePage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = use(params);
  return (
    <RoleGuard allowed={["teacher", "admin"]}>
      <PageHeader
        eyebrow="Live Room"
        title="Watch the room fill with answers."
        description="Keep this open while students join with the PIN and complete the quiz."
      />
      <Container className="pb-16">
        <TeacherLiveRoom sessionId={sessionId} />
      </Container>
    </RoleGuard>
  );
}
