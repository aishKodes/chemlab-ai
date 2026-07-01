"use client";

import { use } from "react";
import { LeaderboardView } from "@/components/live-quiz/LeaderboardView";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";

export default function LeaderboardSlugPage({ params }: { params: Promise<{ quizSlug: string }> }) {
  const { quizSlug } = use(params);
  return (
    <>
      <PageHeader
        eyebrow="Leaderboard"
        title="Quiz leaderboard."
        description="Accuracy first, speed second. Try again whenever you want a cleaner run."
      />
      <Container className="pb-16">
        <LeaderboardView quizSlug={quizSlug} />
      </Container>
    </>
  );
}
