"use client";

import { AdminEntityManager } from "@/components/admin/AdminEntityManager";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { adminApi } from "@/lib/api/adminApi";
import type { BackendContentBlock } from "@/lib/api/backendTypes";

export default function AdminContentPage() {
  return (
    <>
      <PageHeader
        eyebrow="Admin / Content"
        title="Content blocks."
        description="Manage reusable page content keys and connect language translations separately."
      />
      <Container className="pb-16">
        <AdminEntityManager<BackendContentBlock & Record<string, unknown>>
          title="Content Blocks"
          description="Block keys are stable handles such as homepage.hero.title or labs.redox.description."
          listKey="content"
          fetchItems={adminApi.getContentBlocks}
          createItem={adminApi.createContentBlock}
          updateItem={adminApi.updateContentBlock}
          columns={[
            { key: "id", label: "ID" },
            { key: "block_key", label: "Key" },
            { key: "page_slug", label: "Page" },
            { key: "type", label: "Type" },
            { key: "status", label: "Status" },
          ]}
          fields={[
            { name: "block_key", label: "Block key", required: true },
            { name: "page_slug", label: "Page slug", required: true },
            { name: "section", label: "Section" },
            { name: "type", label: "Type", type: "select", required: true, options: ["text", "rich_text", "image", "json", "link", "cta", "seo"].map((value) => ({ label: value, value })) },
            { name: "status", label: "Status", type: "select", options: ["draft", "published", "archived"].map((value) => ({ label: value, value })) },
          ]}
          defaultValues={{ type: "text", status: "published" }}
          extraActions={() => (
            <Button href="/admin/translations" size="sm" variant="secondary">
              Translations
            </Button>
          )}
        />
      </Container>
    </>
  );
}
