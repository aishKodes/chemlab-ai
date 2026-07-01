import { backendClient } from "@/lib/api/backendClient";
import type { BackendMemoryCard, BackendMemoryDeck, BackendMemoryProgress, BackendMemorySummary } from "@/lib/api/backendTypes";

export const fallbackMemoryDecks: BackendMemoryDeck[] = [
  {
    id: 1,
    title: "Redox LEO and GER Memory Deck",
    slug: "redox-leo-ger-memory",
    description: "Remember oxidation, reduction, and redox agents with compact review cards.",
    difficulty: "beginner",
    status: "published",
  },
  {
    id: 2,
    title: "IUPAC Starter Memory Deck",
    slug: "iupac-starter-memory",
    description: "Practice roots, suffixes, and branch naming for early hydrocarbon nomenclature.",
    difficulty: "beginner",
    status: "published",
  },
];

export const fallbackMemoryCards: Record<string, BackendMemoryCard[]> = {
  "redox-leo-ger-memory": [
    { id: 1, deck_id: 1, front: "What does LEO mean?", back: "Loss of Electrons is Oxidation.", hint: "Look for the species giving away electrons." },
    { id: 2, deck_id: 1, front: "What does GER mean?", back: "Gain of Electrons is Reduction.", hint: "Look for the species receiving electrons." },
    { id: 3, deck_id: 1, front: "Who is the reducing agent in Zn + Cu2+?", back: "Zinc.", explanation: "Zinc gives electrons, so it causes copper ion to be reduced." },
  ],
  "iupac-starter-memory": [
    { id: 4, deck_id: 2, front: "What root means four carbons?", back: "But.", hint: "Meth, eth, prop, but." },
    { id: 5, deck_id: 2, front: "What suffix means only single bonds?", back: "ane.", explanation: "Alkanes use the suffix ane." },
    { id: 6, deck_id: 2, front: "Why is 2-methylpentane numbered from the nearer end?", back: "The branch should get the lowest possible number." },
  ],
};

export const memoryApi = {
  getDecks: () => backendClient.get<{ decks: BackendMemoryDeck[] }>("/api/public/memory-decks"),
  getDeck: (idOrSlug: string | number) => backendClient.get<{ deck: BackendMemoryDeck }>(`/api/public/memory-decks/${idOrSlug}`),
  getCards: (idOrSlug: string | number) =>
    backendClient.get<{ deck: BackendMemoryDeck; cards: BackendMemoryCard[] }>(`/api/public/memory-decks/${idOrSlug}/cards`),
  review: (payload: {
    deck_id: number;
    card_id: number;
    rating: "easy" | "good" | "hard" | "forgot";
    anonymous_id?: string;
    response_time_ms?: number;
    review_mode?: "learn" | "review" | "mistake_fix";
    metadata?: Record<string, unknown>;
  }) => backendClient.post<{ review_id: number; next_review_at?: string; progress?: BackendMemoryProgress }>("/api/learning/memory/review", payload),
  getDue: (anonymousId?: string) =>
    backendClient.get<{ cards: Array<BackendMemoryCard & Partial<BackendMemoryProgress> & { deck_title?: string; deck_slug?: string }>; summary: BackendMemorySummary }>(
      "/api/learning/memory/due",
      { query: anonymousId ? { anonymous_id: anonymousId } : undefined },
    ),
  getStudyPlan: (deckId: string | number, anonymousId?: string) =>
    backendClient.get<{
      deck: BackendMemoryDeck;
      summary: BackendMemorySummary;
      cards: Array<BackendMemoryCard & Partial<BackendMemoryProgress>>;
      message: string;
    }>(`/api/learning/memory/decks/${deckId}/study-plan`, {
      query: anonymousId ? { anonymous_id: anonymousId } : undefined,
    }),
  getProgress: (anonymousId?: string) =>
    backendClient.get<{ progress: BackendMemoryProgress[] }>("/api/learning/memory/progress", {
      query: anonymousId ? { anonymous_id: anonymousId } : undefined,
    }),
};
