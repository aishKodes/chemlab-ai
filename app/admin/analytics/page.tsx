import type { Metadata } from "next";
import { Brain, ChartNoAxesColumn, FlaskConical, MessageCircleQuestion } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { getAdminAnalyticsOverview } from "@/lib/analytics/adminMetrics";

export const metadata: Metadata = {
  title: "Admin Analytics",
  description: "Chemlab learning, AI, RAG, and simulation analytics.",
};

export default async function AdminAnalyticsPage() {
  const overview = await getAdminAnalyticsOverview();
  return (
    <>
      <PageHeader
        eyebrow="Admin / Analytics"
        title="Chemlab learning signals."
        description="AI usage, RAG activity, student progress, misconceptions, and question coverage."
      />
      <Container className="space-y-6 pb-16">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Conversations" value={String(overview.conversations)} icon={<Brain className="h-5 w-5" />} />
          <StatCard label="AI messages" value={String(overview.ai.totalRequests)} icon={<ChartNoAxesColumn className="h-5 w-5" />} />
          <StatCard label="AI cost today" value={`₹${overview.ai.budget.usedInr.toFixed(2)}`} detail={`₹${overview.ai.budget.remainingInr.toFixed(2)} remaining`} icon={<ChartNoAxesColumn className="h-5 w-5" />} />
          <StatCard label="Knowledge chunks" value={String(overview.chunks)} icon={<FlaskConical className="h-5 w-5" />} />
          <StatCard label="Unanswered" value={String(overview.unanswered)} icon={<MessageCircleQuestion className="h-5 w-5" />} />
        </div>
        <Card>
          <h2 className="text-lg font-black text-slate-950">Common misconceptions</h2>
          <div className="mt-4 space-y-3">
            {overview.learning.misconceptions.length ? (
              overview.learning.misconceptions.map((row) => (
                <div key={`${row.misconception_key}-${row.confidence}`} className="rounded-2xl border border-slate-200 bg-white/70 p-3">
                  <p className="font-bold text-slate-800">{row.misconception_key}</p>
                  <p className="text-sm text-slate-500">confidence {row.confidence} / resolved {String(row.resolved)}</p>
                </div>
              ))
            ) : (
              <p className="text-sm font-medium text-slate-500">No misconceptions detected yet.</p>
            )}
          </div>
        </Card>
      </Container>
    </>
  );
}
