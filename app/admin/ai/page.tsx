import type { Metadata } from "next";
import { Bot, CircleDollarSign, Database, Gauge } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { getAiUsageOverview } from "@/lib/analytics/aiUsage";

export const metadata: Metadata = {
  title: "Admin AI",
  description: "Chem-Shastri AI routing, cache, cost, and model usage overview.",
};

export default async function AdminAiPage() {
  const overview = await getAiUsageOverview();
  return (
    <>
      <PageHeader
        eyebrow="Admin / AI"
        title="Chem-Shastri AI control."
        description="Provider usage, cache behavior, estimated cost, and model routing health."
      />
      <Container className="space-y-6 pb-16">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="AI requests" value={String(overview.totalRequests)} icon={<Bot className="h-5 w-5" />} />
          <StatCard label="Today's budget" value={`₹${overview.budget.usedInr.toFixed(2)} / ₹${overview.budget.budgetInr}`} icon={<CircleDollarSign className="h-5 w-5" />} />
          <StatCard label="Cache hit rate" value={`${Math.round(overview.cacheHitRate * 100)}%`} icon={<Database className="h-5 w-5" />} />
          <StatCard label="Budget blocks" value={String(overview.blockedByBudget)} detail={`${overview.ragOnlyAnswers} RAG-only answers`} icon={<Gauge className="h-5 w-5" />} />
        </div>
        <Card>
          <h2 className="text-lg font-black text-slate-950">Cost guard</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
              <p className="text-xs font-black uppercase tracking-wide text-emerald-700">Remaining today</p>
              <p className="mt-1 text-2xl font-black text-emerald-900">₹{overview.budget.remainingInr.toFixed(2)}</p>
            </div>
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
              <p className="text-xs font-black uppercase tracking-wide text-blue-700">Voice requests</p>
              <p className="mt-1 text-2xl font-black text-blue-900">{overview.voiceRequests}</p>
            </div>
            <div className="rounded-2xl border border-violet-100 bg-violet-50 p-4">
              <p className="text-xs font-black uppercase tracking-wide text-violet-700">Router</p>
              <p className="mt-1 text-sm font-bold text-violet-900">Gemini first. OpenAI only for guarded fallback or hard reasoning.</p>
            </div>
          </div>
        </Card>
        <Card>
          <h2 className="text-lg font-black text-slate-950">Model split</h2>
          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-600">
                <tr>
                  <th className="p-3">Provider / model</th>
                  <th className="p-3">Requests</th>
                </tr>
              </thead>
              <tbody>
                {overview.modelSplit.length ? (
                  overview.modelSplit.map((row) => (
                    <tr key={row.model} className="border-t border-slate-100">
                      <td className="p-3 font-semibold text-slate-800">{row.model}</td>
                      <td className="p-3 text-slate-600">{row.count}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="p-3 text-slate-500" colSpan={2}>
                      No AI usage logged yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </Container>
    </>
  );
}
