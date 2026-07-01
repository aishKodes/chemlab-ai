"use client";

import { use, useEffect, useState } from "react";
import { MemoryCardPlayer } from "@/components/learning/memory/MemoryCardPlayer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import type { BackendMemoryCard, BackendMemoryDeck } from "@/lib/api/backendTypes";
import { getReadableApiError } from "@/lib/api/apiErrors";
import { fallbackMemoryCards, fallbackMemoryDecks, memoryApi } from "@/lib/api/memoryApi";
import { trackEvent } from "@/lib/analytics/trackEvent";
import { useResourceSession } from "@/hooks/useResourceSession";

export default function MemoryDeckPage({ params }: { params: Promise<{ deckSlug: string }> }) {
  const { deckSlug } = use(params);
  const fallbackDeck = fallbackMemoryDecks.find((deck) => deck.slug === deckSlug) ?? fallbackMemoryDecks[0];
  const [deck, setDeck] = useState<BackendMemoryDeck>(fallbackDeck);
  const [cards, setCards] = useState<BackendMemoryCard[]>(fallbackMemoryCards[deckSlug] ?? []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useResourceSession({ resourceSlug: deck.resource_id ? undefined : deck.slug, resourceId: deck.resource_id ?? undefined, resourceType: "memory_deck" });

  useEffect(() => {
    void trackEvent({ event_type: "learning", event_name: "memory_deck_started", page_path: `/memory-cards/${deckSlug}`, metadata: { deckSlug } });
    memoryApi
      .getCards(deckSlug)
      .then((payload) => {
        setDeck(payload.deck);
        setCards(payload.cards.length ? payload.cards : fallbackMemoryCards[deckSlug] ?? []);
      })
      .catch((caught) => setError(getReadableApiError(caught)))
      .finally(() => setLoading(false));
  }, [deckSlug]);

  return (
    <>
      <PageHeader eyebrow="Memory Deck" title={deck.title} description={deck.description ?? "Review this chemistry idea one small card at a time."} />
      <Container className="space-y-6 pb-16">
        {error ? <ErrorState title="Using local cards" description={error} /> : null}
        {loading && !cards.length ? <LoadingState label="Loading cards" /> : <MemoryCardPlayer deck={deck} cards={cards} />}
      </Container>
    </>
  );
}
