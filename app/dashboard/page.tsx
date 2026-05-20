import type { Metadata } from "next";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Progress Galaxy",
  description: "A colourful Chemlab student dashboard for XP, streaks, labs completed, chapter mastery, mistake objects, and Master Alchem activity.",
};

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        eyebrow="Progress Galaxy"
        title="Progress Galaxy"
        description="Track XP, streaks, daily quests, mastery, labs completed, mistake objects, recent achievements, and Master Alchem activity."
      />
      <Container className="pb-16">
        <DashboardOverview />
      </Container>
    </>
  );
}
