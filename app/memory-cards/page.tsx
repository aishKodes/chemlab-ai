"use client";

import { useEffect, useState } from "react";
import { MemoryDeckGrid } from "@/components/learning/memory/MemoryDeckGrid";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import type { BackendMemoryDeck } from "@/lib/api/backendTypes";
import { getReadableApiError } from "@/lib/api/apiErrors";
import { fallbackMemoryDecks, memoryApi } from "@/lib/api/memoryApi";
import { trackEvent } from "@/lib/analytics/trackEvent";

export default function MemoryCardsPage() {
  const [decks, setDecks] = useState<BackendMemoryDeck[]>(fallbackMemoryDecks);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void trackEvent({ event_type: "learning", event_name: "memory_cards_opened", page_path: "/memory-cards" });
    memoryApi
      .getDecks()
      .then((payload) => setDecks(payload.decks.length ? payload.decks : fallbackMemoryDecks))
      .catch((caught) => setError(getReadableApiError(caught)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="Memory Cards"
        title="Review small ideas until they stick."
        description="Flip compact chemistry cards, rate how it felt, and let Chemlab schedule better practice later."
      />
      <Container className="space-y-6 pb-16">
        {error ? <ErrorState title="Using local memory decks" description={error} /> : null}
        {loading ? <LoadingState label="Loading memory decks" /> : <MemoryDeckGrid decks={decks} />}
      </Container>
    </>
  );
}
