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
].map((value) => ({ label: value.replaceAll("_", " "), value }));

export default function AdminResourcesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Admin / Resources"
        title="Learning resources."
        description="Attach simulations, story labs, memory decks, quick drills, and notes to class-wise chemistry structure."
      />
      <Container className="pb-16">
        <AdminEntityManager<BackendResource & Record<string, unknown>>
          title="Resources"
          description="Use route_url for existing Next.js labs. Use class, chapter, and topic IDs to place resources in the learning map."
          listKey="resources"
          fetchItems={adminApi.getResources}
          createItem={adminApi.createResource}
          updateItem={adminApi.updateResource}
          columns={[
            { key: "id", label: "ID" },
            { key: "title", label: "Title" },
            { key: "type", label: "Type" },
            { key: "route_url", label: "Route" },
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
            { name: "status", label: "Status", type: "select", options: ["draft", "published", "archived"].map((value) => ({ label: value, value })) },
          ]}
          defaultValues={{ source_type: "CUSTOM", status: "draft" }}
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
