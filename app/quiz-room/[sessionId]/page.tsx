"use client";

import { use } from "react";
import { QuizRoomPlayer } from "@/components/live-quiz/QuizRoomPlayer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";

export default function QuizRoomPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = use(params);
  return (
    <>
      <PageHeader
        eyebrow="Live Quiz Room"
        title="Answer one question at a time."
        description="Choose carefully. Every answer helps your teacher see what the class understands."
      />
      <Container className="pb-16">
        <QuizRoomPlayer sessionId={sessionId} />
      </Container>
    </>
  );
}
