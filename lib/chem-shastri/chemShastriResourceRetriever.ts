import { chemShastriConfig } from "./chemShastriConfig";
import type { ChemShastriContext, ChemShastriResourceSuggestion } from "./chemShastriTypes";
import { fallbackResources } from "@/lib/api/publicApi";

type BackendList<T> = T[] | { resources?: T[]; decks?: T[]; drills?: T[]; concept_maps?: T[] };

type ResourceLike = {
  title?: string;
  slug?: string;
  type?: string;
  route_url?: string | null;
  description?: string | null;
  class_level?: string | null;
};

const FALLBACK_STUDY_TOOLS: ChemShastriResourceSuggestion[] = [
  {
    title: "Redox Transfer Kitchen",
    slug: "redox-transfer-kitchen",
    type: "simulation",
    routeUrl: "/labs/redox-transfer-kitchen",
    description: "Use the murukku transaction story to see oxidation and reduction together.",
    reason: "Matches redox, oxidation, reduction, electron transfer, and spectator ion doubts.",
    source: "fallback",
  },
  {
    title: "Hydrocarbon Naming Quest",
    slug: "hydrocarbon-naming-quest",
    type: "simulation",
    routeUrl: "/labs/hydrocarbon-naming-quest",
    description: "Trace carbon chains and build IUPAC names through a game.",
    reason: "Matches hydrocarbon, alkane, alkene, substituent, and IUPAC naming doubts.",
    source: "fallback",
  },
];

function unwrap<T>(payload: BackendList<T>, key: "resources" | "decks" | "drills" | "concept_maps"): T[] {
  if (Array.isArray(payload)) return payload;
  return payload[key] ?? [];
}

async function backendFetch<T>(path: string): Promise<T | null> {
  const baseUrl = chemShastriConfig.hostingerBaseUrl();
  if (!baseUrl) return null;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const response = await fetch(`${baseUrl}${path}`, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
      cache: "no-store",
    });
    if (!response.ok) return null;
    const payload = (await response.json()) as { ok?: boolean; data?: T };
    return payload.ok ? payload.data ?? null : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

function keywords(text: string) {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s+-]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length >= 3),
  );
}

function scoreItem(item: ResourceLike, queryWords: Set<string>, context: ChemShastriContext) {
  const haystack = `${item.title ?? ""} ${item.slug ?? ""} ${item.description ?? ""} ${item.type ?? ""}`.toLowerCase();
  let score = 0;
  queryWords.forEach((word) => {
    if (haystack.includes(word)) score += 2;
  });
  if (context.classLevel && item.class_level === context.classLevel) score += 2;
  if (context.simulationSlug && item.slug === context.simulationSlug) score += 4;
  if (context.resourceSlug && item.slug === context.resourceSlug) score += 4;
  return score;
}

function toSuggestion(
  item: ResourceLike,
  reason: string,
  source: ChemShastriResourceSuggestion["source"],
): ChemShastriResourceSuggestion | null {
  if (!item.title || !item.slug) return null;
  return {
    title: item.title,
    slug: item.slug,
    type: item.type ?? source,
    routeUrl: item.route_url ?? null,
    description: item.description ?? null,
    reason,
    source,
  };
}

export async function retrieveChemShastriResources({
  query,
  context,
  limit = 4,
}: {
  query: string;
  context: ChemShastriContext;
  limit?: number;
}) {
  const queryWords = keywords(`${query} ${context.simulationSlug ?? ""} ${context.resourceSlug ?? ""}`);
  const [resourcePayload, deckPayload, drillPayload, mapPayload] = await Promise.all([
    backendFetch<BackendList<ResourceLike>>("/api/public/resources"),
    backendFetch<BackendList<ResourceLike>>("/api/public/memory-decks"),
    backendFetch<BackendList<ResourceLike>>("/api/public/quick-drills"),
    backendFetch<BackendList<ResourceLike>>("/api/public/concept-maps"),
  ]);

  const backendItems = [
    ...unwrap(resourcePayload ?? fallbackResources, "resources").map((item) => ({ item, source: "backend" as const })),
    ...unwrap(deckPayload ?? [], "decks").map((item) => ({ item: { ...item, type: "memory_deck" }, source: "memory_deck" as const })),
    ...unwrap(drillPayload ?? [], "drills").map((item) => ({ item: { ...item, type: "quick_drill" }, source: "quick_drill" as const })),
    ...unwrap(mapPayload ?? [], "concept_maps").map((item) => ({ item: { ...item, type: "concept_map" }, source: "concept_map" as const })),
  ];

  const ranked = backendItems
    .map(({ item, source }) => ({
      item,
      source,
      score: scoreItem(item, queryWords, context),
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) =>
      toSuggestion(
        entry.item,
        entry.source === "backend"
          ? "This chemlearning resource matches the question and current context."
          : "This practice tool can reinforce the same idea after the answer.",
        entry.source,
      ),
    )
    .filter(Boolean) as ChemShastriResourceSuggestion[];

  const withFallback = ranked.length ? ranked : FALLBACK_STUDY_TOOLS;
  return withFallback.slice(0, limit);
}

export async function buildRetrievalContext(query: string, context: ChemShastriContext) {
  const suggestions = await retrieveChemShastriResources({ query, context, limit: 5 });
  const notes = suggestions
    .map((resource, index) => `[R${index + 1}] ${resource.title}: ${resource.description ?? resource.reason}`)
    .join("\n");
  return { suggestions, notes };
}
