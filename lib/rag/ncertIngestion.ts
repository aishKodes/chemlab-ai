import fs from "node:fs/promises";
import path from "node:path";
import { PDFParse } from "pdf-parse";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { chunkTextByWords, contentHash } from "./chunker";
import { chapterSlugFromTitle, parseNcertFilename } from "./sourceParser";

export async function ingestNcertFolder(root = "data/ncert/raw") {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return { processed: 0, chunks: 0, skipped: "Supabase not configured" };
  const files = await walkKnowledgeFiles(root);
  let processed = 0;
  let chunksStored = 0;
  for (const file of files) {
    const metadata = parseNcertFilename(file);
    const parsed = await readKnowledgeFile(file);
    const chapterSlug = chapterSlugFromTitle(metadata.bookTitle);
    const book = await supabase
      .from("ncert_books")
      .upsert(
        {
          class_level: metadata.classLevel,
          subject: metadata.subject,
          book_title: metadata.bookTitle,
          book_code: metadata.bookCode,
          language: metadata.language,
          local_file_path: file,
          status: "active",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "book_code" },
      )
      .select("id")
      .single();
    const chapter = await supabase
      .from("ncert_chapters")
      .insert({
        book_id: book.data?.id,
        chapter_number: 1,
        chapter_title: metadata.bookTitle,
        chapter_slug: chapterSlug,
        class_level: metadata.classLevel,
        subject: metadata.subject,
        status: "active",
      })
      .select("id")
      .single();
    const document = await supabase
      .from("knowledge_documents")
      .insert({
        source_type: "ncert",
        source_id: book.data?.id,
        class_level: metadata.classLevel,
        subject: metadata.subject,
        book_title: metadata.bookTitle,
        chapter_id: chapter.data?.id,
        chapter_slug: chapterSlug,
        chapter_title: metadata.bookTitle,
        title: metadata.bookTitle,
        raw_text: parsed.text,
        source_reference: `NCERT Class ${metadata.classLevel || ""} ${metadata.subject} - ${metadata.bookTitle}`,
        metadata: { file, info: parsed.info },
        status: "active",
      })
      .select("id")
      .single();
    const chunks = chunkTextByWords({
      text: parsed.text,
      title: metadata.bookTitle,
      classLevel: metadata.classLevel,
      subject: metadata.subject,
      chapterSlug,
      pageStart: 1,
      pageEnd: parsed.total,
      sourceCitation: `NCERT Class ${metadata.classLevel || ""} ${metadata.subject} - ${metadata.bookTitle}`,
      metadata: { source_type: "ncert", local_file_path: file },
    });
    for (const [index, chunk] of chunks.entries()) {
      const hash = contentHash(chunk.chunkText);
      await supabase.from("knowledge_chunks").upsert(
        {
          document_id: document.data?.id,
          chunk_index: index,
          class_level: chunk.classLevel,
          subject: chunk.subject,
          chapter_slug: chunk.chapterSlug,
          topic_slug: chunk.topicSlug,
          title: chunk.title,
          chunk_text: chunk.chunkText,
          clean_text: chunk.chunkText,
          token_count: Math.ceil(chunk.chunkText.length / 4),
          page_start: chunk.pageStart,
          page_end: chunk.pageEnd,
          source_citation: chunk.sourceCitation,
          source_reference: chunk.sourceCitation,
          keywords: extractKeywords(chunk.chunkText),
          metadata: chunk.metadata,
          content_hash: hash,
          status: "active",
        },
        { onConflict: "content_hash" },
      );
      chunksStored += 1;
    }
    processed += 1;
  }
  return { processed, chunks: chunksStored };
}

async function readKnowledgeFile(file: string): Promise<{ text: string; total: number; info: unknown }> {
  if (file.toLowerCase().endsWith(".txt") || file.toLowerCase().endsWith(".md")) {
    const text = await fs.readFile(file, "utf8");
    return { text, total: 1, info: { type: "text" } };
  }
  const buffer = await fs.readFile(file);
  const parser = new PDFParse({ data: buffer });
  const parsed = await parser.getText();
  const info = await parser.getInfo().catch(() => null);
  await parser.destroy().catch(() => undefined);
  return { text: parsed.text, total: parsed.total, info };
}

function extractKeywords(text: string) {
  const stop = new Set(["this", "that", "with", "from", "have", "into", "their", "there", "which", "when", "then", "than", "class", "chapter"]);
  const counts = new Map<string, number>();
  text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length > 3 && !stop.has(word))
    .forEach((word) => counts.set(word, (counts.get(word) ?? 0) + 1));
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 24)
    .map(([word]) => word);
}

async function walkKnowledgeFiles(root: string): Promise<string[]> {
  const entries = await fs.readdir(root, { withFileTypes: true }).catch(() => []);
  const files: string[] = [];
  for (const entry of entries) {
    const fullPath = path.join(root, entry.name);
    if (entry.isDirectory()) files.push(...(await walkKnowledgeFiles(fullPath)));
    if (entry.isFile() && /\.(pdf|txt|md)$/i.test(entry.name)) files.push(fullPath);
  }
  return files;
}
