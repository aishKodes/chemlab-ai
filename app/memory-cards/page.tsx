"use client";

import { useEffect, useState } from "react";
import { MemoryDeckGrid } from "@/components/learning/memory/MemoryDeckGrid";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import type { BackendMemoryDeck } from "@/lib/api/backendTypes";
import type { BackendMemorySummary } from "@/lib/api/backendTypes";
import { getReadableApiError } from "@/lib/api/apiErrors";
import { fallbackMemoryDecks, memoryApi } from "@/lib/api/memoryApi";
import { trackEvent } from "@/lib/analytics/trackEvent";
import { getLearningAnonymousId } from "@/lib/analytics/sessionTracker";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function MemoryCardsPage() {
  const [decks, setDecks] = useState<BackendMemoryDeck[]>(fallbackMemoryDecks);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<BackendMemorySummary | null>(null);

  useEffect(() => {
    void trackEvent({ event_type: "learning", event_name: "memory_cards_opened", page_path: "/memory-cards" });
    memoryApi
      .getDecks()
      .then((payload) => setDecks(payload.decks.length ? payload.decks : fallbackMemoryDecks))
      .catch((caught) => setError(getReadableApiError(caught)))
      .finally(() => setLoading(false));
    memoryApi
      .getDue(getLearningAnonymousId())
      .then((payload) => setSummary(payload.summary))
      .catch(() => setSummary(null));
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
        <Card className="bg-gradient-to-br from-white via-amber-50 to-cyan-50">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <Badge tone="amber">Smart review</Badge>
              <h2 className="mt-3 text-2xl font-black text-slate-950">Today&apos;s memory mission</h2>
              <p className="mt-2 text-sm font-bold leading-6 text-slate-600">
                Chemlab brings hard cards back sooner and spaces easy cards farther apart.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-center sm:grid-cols-4">
              {[
                ["Due", summary?.due ?? 0],
                ["Weak", summary?.weak ?? 0],
                ["New", summary?.new_cards ?? 0],
                ["Mastered", summary?.mastered ?? 0],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-white/75 px-4 py-3 shadow-sm">
                  <p className="text-2xl font-black text-blue-700">{value}</p>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
        {loading ? <LoadingState label="Loading memory decks" /> : <MemoryDeckGrid decks={decks} />}
      </Container>
    </>
  );
}
