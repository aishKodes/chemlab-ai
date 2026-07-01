"use client";

import { AdminEntityManager } from "@/components/admin/AdminEntityManager";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { adminApi } from "@/lib/api/adminApi";
import type { BackendMemoryDeck } from "@/lib/api/backendTypes";

export default function AdminMemoryDecksPage() {
  return (
    <>
      <PageHeader
        eyebrow="Admin / Memory Cards"
        title="Memory decks."
        description="Create compact revision decks for redox, IUPAC, formulas, misconceptions, and future spaced review."
      />
      <Container className="pb-16">
        <AdminEntityManager<BackendMemoryDeck & Record<string, unknown>>
          title="Memory Decks"
          description="Decks can attach to a class, chapter, topic, or existing simulation resource."
          listKey="decks"
          fetchItems={adminApi.getMemoryDecks}
          createItem={adminApi.createMemoryDeck}
          updateItem={adminApi.updateMemoryDeck}
          columns={[
            { key: "id", label: "ID" },
            { key: "title", label: "Title" },
            { key: "class_id", label: "Class" },
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
            { name: "status", label: "Status", type: "select", options: ["draft", "published", "archived"].map((value) => ({ label: value, value })) },
            { name: "source_type", label: "Source type", type: "select", options: ["CUSTOM", "SIMULATION", "NCERT", "AI_ASSISTED"].map((value) => ({ label: value, value })) },
            { name: "source_reference", label: "Source reference", type: "textarea" },
          ]}
          defaultValues={{ language: "en", difficulty: "beginner", status: "draft", source_type: "CUSTOM" }}
          extraActions={(deck) =>
            deck.id ? (
              <Button href={`/admin/memory-cards/${deck.id}`} size="sm" variant="secondary">
                Cards
              </Button>
            ) : null
          }
        />
      </Container>
    </>
  );
}
