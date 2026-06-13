import crypto from "node:crypto";
import type { KnowledgeChunkInput } from "./types";

export function contentHash(text: string) {
  return crypto.createHash("sha256").update(text).digest("hex");
}

function cleanPageText(text: string) {
  return text
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/^\s*\d+\s*$/gm, "")
    .trim();
}

export function chunkTextByWords({
  text,
  title,
  classLevel,
  subject = "chemistry",
  chapterSlug,
  topicSlug,
  pageStart,
  pageEnd,
  sourceCitation,
  metadata,
  minWords = 300,
  maxWords = 700,
}: {
  text: string;
  title: string;
  classLevel?: string;
  subject?: string;
  chapterSlug?: string;
  topicSlug?: string;
  pageStart?: number | null;
  pageEnd?: number | null;
  sourceCitation: string;
  metadata?: Record<string, unknown>;
  minWords?: number;
  maxWords?: number;
}): KnowledgeChunkInput[] {
  const words = cleanPageText(text).split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const chunks: KnowledgeChunkInput[] = [];
  let index = 0;
  while (index < words.length) {
    const end = Math.min(words.length, index + maxWords);
    const slice = words.slice(index, end);
    if (slice.length < minWords && chunks.length) {
      chunks[chunks.length - 1].chunkText += ` ${slice.join(" ")}`;
      break;
    }
    chunks.push({
      title,
      classLevel,
      subject,
      chapterSlug,
      topicSlug,
      pageStart,
      pageEnd,
      sourceCitation,
      metadata,
      chunkText: slice.join(" "),
    });
    index = end;
  }
  return chunks;
}
