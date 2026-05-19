import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Admin",
  description: "ChemLab AI admin dashboard foundation.",
};

export default function AdminPage() {
  return (
    <>
      <PageHeader
        eyebrow="Admin"
        title="Content and question management foundation."
        description="A lean admin shell for future teacher/content workflows without overbuilding before auth and roles are connected."
      />
      <Container className="pb-16">
        <AdminShell />
      </Container>
    </>
  );
}
