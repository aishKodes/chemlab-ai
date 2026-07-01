"use client";

import { AdminEntityManager } from "@/components/admin/AdminEntityManager";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { adminApi } from "@/lib/api/adminApi";
import type { BackendConceptMap } from "@/lib/api/backendTypes";

export default function AdminConceptMapsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Admin / Concept Maps"
        title="Concept maps."
        description="Create graph-style learning maps that can later power visual revision and Chem-Shastri guidance."
      />
      <Container className="pb-16">
        <AdminEntityManager<BackendConceptMap & Record<string, unknown>>
          title="Concept Maps"
          description="Use map_json for nodes and edges. Keep student-facing titles short and clear."
          listKey="concept_maps"
          fetchItems={adminApi.getConceptMaps}
          createItem={adminApi.createConceptMap}
          updateItem={adminApi.updateConceptMap}
          columns={[
            { key: "id", label: "ID" },
            { key: "title", label: "Title" },
            { key: "slug", label: "Slug" },
            { key: "class_id", label: "Class" },
            { key: "status", label: "Status" },
          ]}
          fields={[
            { name: "class_id", label: "Class ID", type: "number" },
            { name: "subject_id", label: "Subject ID", type: "number" },
            { name: "chapter_id", label: "Chapter ID", type: "number" },
            { name: "topic_id", label: "Topic ID", type: "number" },
            { name: "title", label: "Title", required: true },
            { name: "slug", label: "Slug", required: true },
            { name: "description", label: "Description", type: "textarea" },
            { name: "map_json", label: "Map JSON", type: "json", placeholder: "{\"nodes\":[\"Oxidation\"],\"edges\":[]}" },
            { name: "status", label: "Status", type: "select", options: ["draft", "published", "archived"].map((value) => ({ label: value, value })) },
            { name: "source_reference", label: "Source reference", type: "textarea" },
          ]}
          defaultValues={{ status: "draft" }}
        />
      </Container>
    </>
  );
}
