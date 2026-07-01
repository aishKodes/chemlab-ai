"use client";

import { JoinQuizClient } from "@/components/live-quiz/JoinQuizClient";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";

export default function JoinPage() {
  return (
    <>
      <PageHeader
        eyebrow="Join Live Quiz"
        title="Enter your classroom PIN."
        description="Type the six digits from your teacher and jump straight into the chemistry battle."
      />
      <Container className="pb-16">
        <JoinQuizClient />
      </Container>
    </>
  );
}
