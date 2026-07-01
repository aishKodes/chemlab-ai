"use client";

import { AdminEntityManager } from "@/components/admin/AdminEntityManager";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { adminApi } from "@/lib/api/adminApi";
import type { BackendQuickDrill } from "@/lib/api/backendTypes";

export default function AdminQuickDrillsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Admin / Quick Drills"
        title="Quick drills."
        description="Create short, targeted checks for simulations, resources, and chapter topics."
      />
      <Container className="pb-16">
        <AdminEntityManager<BackendQuickDrill & Record<string, unknown>>
          title="Quick Drills"
          description="Drills are short practice rounds that can later feed progress and mistake analytics."
          listKey="drills"
          fetchItems={adminApi.getQuickDrills}
          createItem={adminApi.createQuickDrill}
          updateItem={adminApi.updateQuickDrill}
          columns={[
            { key: "id", label: "ID" },
            { key: "title", label: "Title" },
            { key: "estimated_minutes", label: "Minutes" },
            { key: "difficulty", label: "Difficulty" },
            { key: "status", label: "Status" },
          ]}
          fields={[
            { name: "class_id", label: "Class ID", type: "number" },
            { name: "subject_id", label: "Subject ID", type: "number" },
            { name: "chapter_id", label: "Chapter ID", type: "number" },
            { name: "topic_id", label: "Topic ID", type: "number" },
            { name: "resource_id", label: "Resource ID", type: "number" },
            { name: "title", label: "Title", required: true },
            { name: "slug", label: "Slug", required: true },
            { name: "description", label: "Description", type: "textarea" },
            { name: "language", label: "Language" },
            { name: "difficulty", label: "Difficulty", type: "select", options: ["beginner", "intermediate", "advanced"].map((value) => ({ label: value, value })) },
            { name: "estimated_minutes", label: "Estimated minutes", type: "number" },
            { name: "status", label: "Status", type: "select", options: ["draft", "published", "archived"].map((value) => ({ label: value, value })) },
            { name: "source_type", label: "Source type", type: "select", options: ["CUSTOM", "SIMULATION", "NCERT", "AI_ASSISTED"].map((value) => ({ label: value, value })) },
            { name: "source_reference", label: "Source reference", type: "textarea" },
          ]}
          defaultValues={{ language: "en", difficulty: "beginner", estimated_minutes: 5, status: "draft", source_type: "CUSTOM" }}
          extraActions={(drill) =>
            drill.id ? (
              <Button href={`/admin/quick-drills/${drill.id}`} size="sm" variant="secondary">
                Questions
              </Button>
            ) : null
          }
        />
      </Container>
    </>
  );
}
