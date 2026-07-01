"use client";

import { use } from "react";
import { AdminEntityManager } from "@/components/admin/AdminEntityManager";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { adminApi } from "@/lib/api/adminApi";
import type { BackendMemoryCard } from "@/lib/api/backendTypes";

export default function AdminMemoryCardsPage({ params }: { params: Promise<{ deckId: string }> }) {
  const { deckId } = use(params);

  return (
    <>
      <PageHeader
        eyebrow="Admin / Memory Cards"
        title={`Cards for deck #${deckId}.`}
        description="Write clear front/back cards with hints and explanations for spaced practice."
      />
      <Container className="pb-16">
        <AdminEntityManager<BackendMemoryCard & Record<string, unknown>>
          title="Memory Cards"
          description="Each card should be small enough for fast recall, with a helpful hint for mistakes."
          listKey="cards"
          fetchItems={() => adminApi.getMemoryCards(deckId)}
          createItem={adminApi.createMemoryCard}
          updateItem={adminApi.updateMemoryCard}
          deleteItem={adminApi.deleteMemoryCard}
          columns={[
            { key: "id", label: "ID" },
            { key: "front", label: "Front" },
            { key: "difficulty", label: "Difficulty" },
            { key: "card_type", label: "Type" },
            { key: "status", label: "Status" },
          ]}
          fields={[
            { name: "deck_id", label: "Deck ID", type: "number", required: true },
            { name: "front", label: "Front", required: true },
            { name: "back", label: "Back", type: "textarea", required: true },
            { name: "hint", label: "Hint", type: "textarea" },
            { name: "explanation", label: "Explanation", type: "textarea" },
            { name: "difficulty", label: "Difficulty", type: "select", options: ["beginner", "intermediate", "advanced"].map((value) => ({ label: value, value })) },
            { name: "card_type", label: "Card type", type: "select", options: ["concept", "formula", "definition", "mistake", "application"].map((value) => ({ label: value, value })) },
            { name: "mistake_type", label: "Mistake type" },
            { name: "source_reference", label: "Source reference", type: "textarea" },
            { name: "order_index", label: "Order", type: "number" },
            { name: "status", label: "Status", type: "select", options: ["draft", "published", "archived"].map((value) => ({ label: value, value })) },
          ]}
          defaultValues={{ deck_id: Number(deckId), difficulty: "beginner", card_type: "concept", order_index: 0, status: "published" }}
        />
      </Container>
    </>
  );
}
