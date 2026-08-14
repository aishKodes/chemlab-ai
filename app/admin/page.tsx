import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Admin",
  description: "chemlearning admin dashboard foundation.",
};

export default function AdminPage() {
  return (
    <>
      <PageHeader
        eyebrow="Admin"
        title="chemlearning control room."
        description="A simple place for future content, question, and classroom tools."
      />
      <Container className="pb-16">
        <AdminShell />
      </Container>
    </>
  );
}
