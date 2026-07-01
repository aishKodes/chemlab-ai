"use client";

import { use } from "react";
import { JoinQuizClient } from "@/components/live-quiz/JoinQuizClient";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";

export default function JoinPinPage({ params }: { params: Promise<{ pin: string }> }) {
  const { pin } = use(params);
  return (
    <>
      <PageHeader
        eyebrow="Join Live Quiz"
        title="Ready when you are."
        description="Enter your name, then answer each question carefully."
      />
      <Container className="pb-16">
        <JoinQuizClient initialPin={pin} />
      </Container>
    </>
  );
}
