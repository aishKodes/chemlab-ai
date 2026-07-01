"use client";

import { AdminEntityManager } from "@/components/admin/AdminEntityManager";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { adminApi } from "@/lib/api/adminApi";
import type { BackendTranslation } from "@/lib/api/backendTypes";

export default function AdminTranslationsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Admin / Translations"
        title="Content translations."
        description="Edit language-specific titles, bodies, and JSON values for existing content blocks."
      />
      <Container className="pb-16">
        <AdminEntityManager<BackendTranslation & Record<string, unknown>>
          title="Translations"
          description="Stage 3 updates existing translation records. New translation creation can be added with locale workflows later."
          listKey="translations"
          fetchItems={adminApi.getTranslations}
          updateItem={adminApi.updateTranslation}
          columns={[
            { key: "id", label: "ID" },
            { key: "block_id", label: "Block ID" },
            { key: "language", label: "Language" },
            { key: "title", label: "Title" },
            { key: "updated_at", label: "Updated" },
          ]}
          fields={[
            { name: "block_id", label: "Block ID", type: "number", required: true },
            { name: "language", label: "Language", required: true },
            { name: "title", label: "Title" },
            { name: "body", label: "Body", type: "textarea" },
            { name: "value_json", label: "Value JSON", type: "json" },
          ]}
        />
      </Container>
    </>
  );
}
