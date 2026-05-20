import type { Metadata } from "next";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Progress",
  description: "Chemlab progress tracking page.",
};

export default function ProgressPage() {
  return (
    <>
      <PageHeader
        eyebrow="Progress"
        title="Chapter mastery and study momentum."
        description="See which worlds are growing stronger, which quests need attention, and where to practice next."
      />
      <Container className="pb-16">
        <DashboardOverview />
      </Container>
    </>
  );
}
