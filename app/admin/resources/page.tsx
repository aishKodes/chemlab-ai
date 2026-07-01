"use client";

import { AdminEntityManager } from "@/components/admin/AdminEntityManager";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { adminApi } from "@/lib/api/adminApi";
import type { BackendResource } from "@/lib/api/backendTypes";

const resourceTypes = [
  "simulation",
  "story_lab",
  "memory_deck",
  "quick_drill",
  "concept_map",
  "formula_sheet",
  "revision_note",
  "teacher_note",
  "mistake_card_set",
  "exam_practice",
  "explanation",
  "visualization",
  "external_resource",
  "worksheet",
  "reaction_map",
  "video_link",
].map((value) => ({ label: value.replaceAll("_", " "), value }));

export default function AdminResourcesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Admin / Resources"
        title="Learning resources."
        description="Attach simulations, story labs, memory decks, quick drills, and reviewed external resources to class-wise chemistry structure."
      />
      <Container className="pb-16">
        <AdminEntityManager<BackendResource & Record<string, unknown>>
          title="Resources"
          description="Use route_url for existing Next.js labs. External resources need source URL, license, and attribution before publishing."
          listKey="resources"
          fetchItems={adminApi.getResources}
          createItem={adminApi.createResource}
          updateItem={adminApi.updateResource}
          columns={[
            { key: "id", label: "ID" },
            { key: "title", label: "Title" },
            { key: "type", label: "Type" },
            { key: "route_url", label: "Route" },
            { key: "quality_status", label: "Quality" },
            { key: "status", label: "Status" },
          ]}
          fields={[
            { name: "class_id", label: "Class ID", type: "number" },
            { name: "subject_id", label: "Subject ID", type: "number" },
            { name: "chapter_id", label: "Chapter ID", type: "number" },
            { name: "topic_id", label: "Topic ID", type: "number" },
            { name: "type", label: "Type", type: "select", required: true, options: resourceTypes },
            { name: "title", label: "Title", required: true },
            { name: "slug", label: "Slug", required: true },
            { name: "description", label: "Description", type: "textarea" },
            { name: "route_url", label: "Route URL" },
            { name: "content_json", label: "Content JSON", type: "json", placeholder: "{\"cta\":\"Open lab\"}" },
            { name: "source_type", label: "Source type", type: "select", options: ["CUSTOM", "SIMULATION", "NCERT", "AI_ASSISTED"].map((value) => ({ label: value, value })) },
            { name: "source_reference", label: "Source reference", type: "textarea" },
            { name: "source_url", label: "Source URL" },
            { name: "license_type", label: "License type" },
            { name: "attribution_text", label: "Attribution text", type: "textarea" },
            { name: "author", label: "Author" },
            { name: "embed_url", label: "Embed URL" },
            { name: "external_open_mode", label: "External open mode", type: "select", options: ["same_tab", "new_tab", "embed"].map((value) => ({ label: value.replaceAll("_", " "), value })) },
            { name: "quality_status", label: "Quality status", type: "select", options: ["draft", "needs_review", "verified", "published", "archived"].map((value) => ({ label: value.replaceAll("_", " "), value })) },
            { name: "accuracy_notes", label: "Accuracy notes", type: "textarea" },
            { name: "why_useful", label: "Why this is useful", type: "textarea" },
            { name: "student_instructions", label: "Student instructions", type: "textarea" },
            { name: "student_level", label: "Student level", type: "select", options: ["beginner", "intermediate", "advanced"].map((value) => ({ label: value, value })) },
            { name: "estimated_minutes", label: "Estimated minutes", type: "number" },
            { name: "status", label: "Status", type: "select", options: ["draft", "published", "archived"].map((value) => ({ label: value, value })) },
          ]}
          defaultValues={{ source_type: "CUSTOM", status: "draft", quality_status: "needs_review", external_open_mode: "new_tab", student_level: "beginner" }}
          extraActions={(item, refresh) => (
            <>
              <Button
                size="sm"
                variant="secondary"
                onClick={async () => {
                  if (item.id) await adminApi.publishResource(item.id);
                  refresh();
                }}
              >
                Publish
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={async () => {
                  if (item.id) await adminApi.archiveResource(item.id);
                  refresh();
                }}
              >
                Archive
              </Button>
            </>
          )}
        />
      </Container>
    </>
  );
}
