"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Activity, BookOpen, FlaskConical, MailWarning, MessageSquareText, Users } from "lucide-react";
import { AdminTable } from "@/components/admin/AdminTable";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { adminApi } from "@/lib/api/adminApi";
import { getReadableApiError } from "@/lib/api/apiErrors";
import type { BackendAdminAnalyticsSummary, BackendLearningEvent } from "@/lib/api/backendTypes";

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<BackendAdminAnalyticsSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getAdminAnalyticsSummary()
      .then(setData)
      .catch((caught) => setError(getReadableApiError(caught)))
      .finally(() => setLoading(false));
  }, []);

  const summary = data?.summary ?? {};

  return (
    <>
      <PageHeader
        eyebrow="Admin / Analytics"
        title="Learning event summary."
        description="Stage 3 stores and summarizes events. Deeper mastery intelligence comes in Stage 4."
      />
      <Container className="space-y-6 pb-16">
        {error ? <ErrorState description={error} /> : null}
        {loading ? (
          <LoadingState label="Loading analytics" />
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <Metric label="Users" value={summary.users ?? 0} icon={<Users className="h-5 w-5" />} />
              <Metric label="Published resources" value={summary.published_resources ?? 0} icon={<BookOpen className="h-5 w-5" />} />
              <Metric label="Memory decks" value={summary.memory_decks ?? 0} icon={<Activity className="h-5 w-5" />} />
              <Metric label="Email failures" value={summary.email_failures ?? 0} icon={<MailWarning className="h-5 w-5" />} />
            </div>
            <Card>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black text-slate-950">Stage 4 analytics areas</h2>
                  <p className="mt-1 text-sm font-bold text-slate-600">Open deeper learning intelligence views.</p>
                </div>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {[
                  { href: "/admin/analytics/resources", label: "Resources", icon: BookOpen },
                  { href: "/admin/analytics/simulations", label: "Simulations", icon: FlaskConical },
                  { href: "/admin/analytics/mistakes", label: "Mistakes", icon: Activity },
                  { href: "/admin/analytics/chem-shastri", label: "Chem-Shastri", icon: MessageSquareText },
                  { href: "/admin/analytics/students", label: "Students", icon: Users },
                  { href: "/admin/analytics/rollups", label: "Rollups", icon: Activity },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button key={item.href} href={item.href} variant="secondary" icon={<Icon className="h-4 w-4" aria-hidden="true" />}>
                      {item.label}
                    </Button>
                  );
                })}
              </div>
            </Card>
            <Card>
              <h2 className="text-xl font-black text-slate-950">Top events</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {(data?.top_events ?? []).map((event) => (
                  <div key={event.event_name} className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
                    <p className="font-black text-slate-950">{event.event_name}</p>
                    <p className="text-sm font-bold text-blue-700">{event.total} events</p>
                  </div>
                ))}
              </div>
            </Card>
            <AdminTable<BackendLearningEvent & Record<string, unknown>>
              items={(data?.recent_events ?? []) as (BackendLearningEvent & Record<string, unknown>)[]}
              columns={[
                { key: "id", label: "ID" },
                { key: "event_type", label: "Type" },
                { key: "event_name", label: "Name" },
                { key: "page_path", label: "Page" },
                { key: "created_at", label: "Created" },
              ]}
              emptyTitle="No events stored yet"
            />
          </>
        )}
      </Container>
    </>
  );
}

function Metric({ label, value, icon }: { label: string; value: number; icon: ReactNode }) {
  return (
    <Card>
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-violet-100 text-violet-700">{icon}</div>
        <div>
          <p className="text-sm font-black text-slate-500">{label}</p>
          <p className="text-2xl font-black text-slate-950">{value}</p>
        </div>
      </div>
    </Card>
  );
}
