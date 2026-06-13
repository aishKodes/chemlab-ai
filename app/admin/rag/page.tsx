import type { Metadata } from "next";
import { BookOpen, Database, FileText, Search } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "Admin RAG",
  description: "NCERT RAG index, embedding status, and retrieval test panel.",
};

async function getRagStats() {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return { books: 0, documents: 0, chunks: 0, embedded: 0, unanswered: [] };
  const [books, documents, chunks, embedded, unanswered] = await Promise.all([
    supabase.from("ncert_books").select("id", { count: "exact", head: true }),
    supabase.from("knowledge_documents").select("id", { count: "exact", head: true }),
    supabase.from("knowledge_chunks").select("id", { count: "exact", head: true }),
    supabase.from("knowledge_chunks").select("id", { count: "exact", head: true }).not("embedding_json", "is", null),
    supabase.from("unanswered_questions").select("question,frequency,status,last_asked_at").order("frequency", { ascending: false }).limit(10),
  ]);
  return {
    books: books.count ?? 0,
    documents: documents.count ?? 0,
    chunks: chunks.count ?? 0,
    embedded: embedded.count ?? 0,
    unanswered: unanswered.data ?? [],
  };
}

export default async function AdminRagPage() {
  const stats = await getRagStats();
  return (
    <>
      <PageHeader
        eyebrow="Admin / RAG"
        title="NCERT knowledge index."
        description="Track books, documents, chunks, embeddings, unanswered questions, and retrieval readiness."
      />
      <Container className="space-y-6 pb-16">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Books" value={String(stats.books)} icon={<BookOpen className="h-5 w-5" />} />
          <StatCard label="Documents" value={String(stats.documents)} icon={<FileText className="h-5 w-5" />} />
          <StatCard label="Chunks" value={String(stats.chunks)} icon={<Database className="h-5 w-5" />} />
          <StatCard label="Embedded" value={String(stats.embedded)} detail={`${Math.max(0, stats.chunks - stats.embedded)} missing`} icon={<Search className="h-5 w-5" />} />
        </div>
        <Card>
          <h2 className="text-lg font-black text-slate-950">Search test</h2>
          <p className="mt-2 text-sm font-medium leading-6 text-slate-600">
            Use <code className="rounded bg-slate-100 px-1 py-0.5">POST /api/admin/rag/search-test</code> with a query to inspect retrieved chunks and scores.
          </p>
        </Card>
        <Card>
          <h2 className="text-lg font-black text-slate-950">Unanswered questions</h2>
          <div className="mt-4 space-y-3">
            {stats.unanswered.length ? (
              stats.unanswered.map((row) => (
                <div key={`${row.question}-${row.last_asked_at}`} className="rounded-2xl border border-slate-200 bg-white/70 p-3">
                  <p className="font-bold text-slate-800">{row.question}</p>
                  <p className="text-sm text-slate-500">frequency {row.frequency} / {row.status}</p>
                </div>
              ))
            ) : (
              <p className="text-sm font-medium text-slate-500">No unanswered questions logged yet.</p>
            )}
          </div>
        </Card>
      </Container>
    </>
  );
}
