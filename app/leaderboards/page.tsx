"use client";

import { LeaderboardView } from "@/components/live-quiz/LeaderboardView";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";

export default function LeaderboardsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Leaderboards"
        title="Chemistry battle boards."
        description="Choose a quiz leaderboard and see who solved the clues cleanly."
      />
      <Container className="pb-16">
        <LeaderboardView />
      </Container>
    </>
  );
}
