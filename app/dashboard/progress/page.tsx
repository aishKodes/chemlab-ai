import type { Metadata } from "next";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Progress",
  description: "ChemLab AI progress tracking page.",
};

export default function ProgressPage() {
  return (
    <>
      <PageHeader
        eyebrow="Progress"
        title="Chapter mastery and study momentum."
        description="The current MVP displays sample progress; the API route is ready for Supabase-backed records."
      />
      <Container className="pb-16">
        <DashboardOverview />
      </Container>
    </>
  );
}
