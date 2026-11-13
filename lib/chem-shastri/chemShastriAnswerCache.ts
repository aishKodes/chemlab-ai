import { hashText } from "@/lib/master-alchem/faqMatcher";

type CacheEntry = {
  answer: string;
  createdAt: number;
  metadata?: Record<string, unknown>;
};

const memoryCache = new Map<string, CacheEntry>();

export function buildChemShastriCacheKey(input: {
  question: string;
  classLevel?: string;
  mode?: string;
  resourceSlug?: string;
  simulationSlug?: string;
  preferredLanguage?: string;
  chapterSlug?: string;
  role?: string;
  history?: string;
  usePageContext?: boolean;
  topicSlug?: string;
  currentPage?: string;
}) {
  return hashText(
    [
      input.question.trim().toLowerCase().replace(/\s+/g, " "),
      input.classLevel ?? "",
      input.mode ?? "",
      input.resourceSlug ?? "",
      input.simulationSlug ?? "",
      input.preferredLanguage ?? "en",
      input.chapterSlug ?? "",
      input.role ?? "anonymous",
      input.history ?? "",
      String(input.usePageContext !== false),
      input.topicSlug ?? "",
      input.currentPage ?? "",
    ].join("|"),
  );
}

export function getChemShastriCachedAnswer(cacheKey: string) {
  const entry = memoryCache.get(cacheKey);
  if (!entry) return null;
  const ttlMs = Number(
    process.env.CHEM_SHASTRI_MEMORY_CACHE_TTL_MS || 1000 * 60 * 20,
  );
  if (Date.now() - entry.createdAt > ttlMs) {
    memoryCache.delete(cacheKey);
    return null;
  }
  return entry;
}

export function saveChemShastriCachedAnswer(
  cacheKey: string,
  answer: string,
  metadata?: Record<string, unknown>,
) {
  if (memoryCache.size >= 300)
    memoryCache.delete(memoryCache.keys().next().value!);
  memoryCache.set(cacheKey, { answer, createdAt: Date.now(), metadata });
}
