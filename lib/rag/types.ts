export type KnowledgeChunkInput = {
  documentId?: string;
  classLevel?: string;
  subject?: string;
  chapterSlug?: string;
  topicSlug?: string;
  title: string;
  chunkText: string;
  pageStart?: number | null;
  pageEnd?: number | null;
  sourceCitation: string;
  metadata?: Record<string, unknown>;
};

export type PdfPageText = {
  pageNumber: number;
  text: string;
};
