import type { Metadata } from "next";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Student Dashboard",
  description: "ChemLab AI student dashboard with progress, mistakes, quiz attempts, and AI usage.",
};

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        eyebrow="Student dashboard"
        title="Progress, mistakes, and the next useful action."
        description="A Supabase-ready dashboard shell with realistic MVP sample data until authentication is connected."
      />
      <Container className="pb-16">
        <DashboardOverview />
      </Container>
    </>
  );
}
