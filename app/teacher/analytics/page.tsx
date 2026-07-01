"use client";

import { useEffect, useState } from "react";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { StatCard } from "@/components/ui/StatCard";
import { teacherApi } from "@/lib/api/teacherApi";
import { getReadableApiError } from "@/lib/api/apiErrors";

export default function TeacherAnalyticsPage() {
  return (
    <RoleGuard allowed={["teacher", "admin"]}>
      <TeacherAnalytics />
    </RoleGuard>
  );
}

function TeacherAnalytics() {
  const [data, setData] = useState<{ summary: Record<string, number>; recent_activity?: unknown[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    teacherApi
      .getOverview()
      .then(setData)
      .catch((caught) => setError(getReadableApiError(caught)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHeader eyebrow="Teacher Analytics" title="Classroom learning pulse." description="Watch early Chemlab learning signals for your classrooms." />
      <Container className="space-y-6 pb-16">
        {error ? <ErrorState description={error} /> : null}
        {loading ? (
          <LoadingState label="Loading teacher analytics" />
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-3">
              <StatCard label="Classrooms" value={String(data?.summary.classrooms ?? 0)} detail="Teacher-created spaces" />
              <StatCard label="Assignments" value={String(data?.summary.assignments ?? 0)} detail="Assigned practice" />
              <StatCard label="Active students" value={String(data?.summary.active_students ?? 0)} detail="Recent event activity" />
            </div>
            <Card>
              <h2 className="text-xl font-black text-slate-950">Recent classroom activity</h2>
              <pre className="mt-4 max-h-80 overflow-auto rounded-2xl bg-slate-950 p-4 text-xs font-bold text-cyan-100">
                {JSON.stringify(data?.recent_activity ?? [], null, 2)}
              </pre>
            </Card>
          </>
        )}
      </Container>
    </>
  );
}
