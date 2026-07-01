"use client";

import { useEffect, useState } from "react";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { AdminTable } from "@/components/admin/AdminTable";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { analyticsAdminApi } from "@/lib/api/analyticsAdminApi";
import { getReadableApiError } from "@/lib/api/apiErrors";

type AnalyticsKind = "resources" | "simulations" | "mistakes" | "chemShastri" | "students" | "teachers" | "rollups";

const titles: Record<AnalyticsKind, { eyebrow: string; title: string; description: string }> = {
  resources: {
    eyebrow: "Admin / Analytics",
    title: "Resource sessions",
    description: "See which learning resources are getting opened and completed.",
  },
  simulations: {
    eyebrow: "Admin / Analytics",
    title: "Simulation activity",
    description: "Track simulation starts, sessions, and top labs.",
  },
  mistakes: {
    eyebrow: "Admin / Analytics",
    title: "Mistake patterns",
    description: "Find the misconceptions students are bumping into most often.",
  },
  chemShastri: {
    eyebrow: "Admin / Analytics",
    title: "Chem-Shastri questions",
    description: "Review question trends without exposing private passwords or secrets.",
  },
  students: {
    eyebrow: "Admin / Analytics",
    title: "Student activity",
    description: "Monitor student accounts and recent active learners.",
  },
  teachers: {
    eyebrow: "Admin / Analytics",
    title: "Teacher activity",
    description: "Watch teacher accounts and classroom creation.",
  },
  rollups: {
    eyebrow: "Admin / Analytics",
    title: "Daily rollups",
    description: "Check precomputed daily learning summaries for future dashboards.",
  },
};

export function AdminAnalyticsSection({ kind }: { kind: AnalyticsKind }) {
  return (
    <RoleGuard allowed={["admin"]}>
      <AdminAnalyticsContent kind={kind} />
    </RoleGuard>
  );
}

function AdminAnalyticsContent({ kind }: { kind: AnalyticsKind }) {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const title = titles[kind];

  useEffect(() => {
    analyticsAdminApi[kind]()
      .then((payload) => setData(payload as Record<string, unknown>))
      .catch((caught) => setError(getReadableApiError(caught)))
      .finally(() => setLoading(false));
  }, [kind]);

  const rows = firstArray(data);

  return (
    <>
      <PageHeader eyebrow={title.eyebrow} title={title.title} description={title.description} />
      <Container className="space-y-6 pb-16">
        {error ? <ErrorState description={error} /> : null}
        {loading ? (
          <LoadingState label="Loading analytics" />
        ) : (
          <>
            <Card>
              <h2 className="text-xl font-black text-slate-950">Snapshot</h2>
              <pre className="mt-4 max-h-72 overflow-auto rounded-2xl bg-slate-950 p-4 text-xs font-bold text-cyan-100">
                {JSON.stringify(data ?? {}, null, 2)}
              </pre>
            </Card>
            <AdminTable<Record<string, unknown> & { id?: number | string }>
              items={rows}
              columns={columnsFromRows(rows)}
              emptyTitle="No analytics rows yet"
            />
          </>
        )}
      </Container>
    </>
  );
}

function firstArray(data: Record<string, unknown> | null): Array<Record<string, unknown> & { id?: number | string }> {
  if (!data) return [];
  for (const value of Object.values(data)) {
    if (Array.isArray(value)) return value as Array<Record<string, unknown> & { id?: number | string }>;
  }
  return [];
}

function columnsFromRows(rows: Array<Record<string, unknown> & { id?: number | string }>) {
  const keys = Object.keys(rows[0] ?? {}).slice(0, 6);
  return keys.map((key) => ({ key, label: key.replace(/_/g, " ") }));
}
