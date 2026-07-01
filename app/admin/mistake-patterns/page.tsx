"use client";

import { AdminEntityManager } from "@/components/admin/AdminEntityManager";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { adminApi } from "@/lib/api/adminApi";
import type { BackendMistakePattern } from "@/lib/api/backendTypes";

export default function AdminMistakePatternsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Admin / Mistake Patterns"
        title="Mistake pattern library."
        description="Turn common wrong answers into friendly, targeted remediation for future dashboards and practice loops."
      />
      <Container className="pb-16">
        <AdminEntityManager<BackendMistakePattern & Record<string, unknown>>
          title="Mistake Patterns"
          description="Capture what students misunderstand, how to correct it, and a concrete example."
          listKey="mistake_patterns"
          fetchItems={adminApi.getMistakePatterns}
          createItem={adminApi.createMistakePattern}
          updateItem={adminApi.updateMistakePattern}
          columns={[
            { key: "id", label: "ID" },
            { key: "mistake_key", label: "Key" },
            { key: "title", label: "Title" },
            { key: "severity", label: "Severity" },
            { key: "status", label: "Status" },
          ]}
          fields={[
            { name: "class_id", label: "Class ID", type: "number" },
            { name: "subject_id", label: "Subject ID", type: "number" },
            { name: "chapter_id", label: "Chapter ID", type: "number" },
            { name: "topic_id", label: "Topic ID", type: "number" },
            { name: "resource_id", label: "Resource ID", type: "number" },
            { name: "mistake_key", label: "Mistake key", required: true },
            { name: "title", label: "Title", required: true },
            { name: "description", label: "Description", type: "textarea" },
            { name: "correction", label: "Correction", type: "textarea" },
            { name: "example", label: "Example", type: "textarea" },
            { name: "severity", label: "Severity", type: "select", options: ["low", "medium", "high"].map((value) => ({ label: value, value })) },
            { name: "status", label: "Status", type: "select", options: ["draft", "published", "archived"].map((value) => ({ label: value, value })) },
          ]}
          defaultValues={{ severity: "medium", status: "published" }}
        />
      </Container>
    </>
  );
}
