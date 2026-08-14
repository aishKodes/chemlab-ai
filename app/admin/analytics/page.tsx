"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Activity, BrainCircuit, FlaskConical, MessageSquareText, Users } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { analyticsAdminApi } from "@/lib/api/analyticsAdminApi";
import { getReadableApiError } from "@/lib/api/apiErrors";
import type { BackendAdminAnalyticsSummary } from "@/lib/api/backendTypes";
import { dedupeQuestionRows, type AnalyticsRow } from "@/lib/analytics/studentAdminAnalytics";

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<BackendAdminAnalyticsSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [studentCount, setStudentCount] = useState(0);
  const [activeStudents, setActiveStudents] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);

  useEffect(() => {
    Promise.all([analyticsAdminApi.summary(), analyticsAdminApi.students(), analyticsAdminApi.chemShastri()])
      .then(([summaryPayload, studentPayload, questionPayload]) => {
        setData(summaryPayload);
        setStudentCount(studentPayload.students.length);
        setActiveStudents(studentPayload.active_students);
        setQuestionCount(dedupeQuestionRows(questionPayload.questions as AnalyticsRow[]).length);
      })
      .catch((caught) => setError(getReadableApiError(caught)))
      .finally(() => setLoading(false));
  }, []);

  const summary = data?.summary ?? {};

  return (
    <>
      <PageHeader
        eyebrow="Admin / Analytics"
        title="See how students are really learning."
        description="Move from platform totals into each learner's labs, mistakes, feedback, and exact Chem-Shastri questions."
      />
      <Container className="space-y-6 pb-16">
        {error ? <ErrorState description={error} /> : null}
        {loading ? (
          <LoadingState label="Loading analytics" />
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <Metric label="Student accounts" value={studentCount} icon={<Users className="h-5 w-5" />} />
              <Metric label="Active students" value={activeStudents} icon={<Activity className="h-5 w-5" />} />
              <Metric label="Simulation sessions" value={summary.simulation_sessions ?? 0} icon={<FlaskConical className="h-5 w-5" />} />
              <Metric label="Chem-Shastri questions" value={questionCount} icon={<BrainCircuit className="h-5 w-5" />} />
            </div>
            <Card className="bg-gradient-to-br from-white via-blue-50 to-violet-50">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-black uppercase text-blue-700">Student intelligence</p>
                  <h2 className="mt-2 text-2xl font-black text-slate-950">Open a complete learner profile</h2>
                  <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-slate-600">
                    Search students, compare engagement, inspect lab sessions and mistakes, read dashboard feedback, and see the chemistry questions they asked.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button href="/admin/analytics/students" icon={<Users className="h-4 w-4" aria-hidden="true" />}>Student analytics</Button>
                  <Button href="/admin/analytics/chem-shastri" variant="secondary" icon={<MessageSquareText className="h-4 w-4" aria-hidden="true" />}>Exact questions</Button>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black text-slate-950">Analytics areas</h2>
                  <p className="mt-1 text-sm font-bold text-slate-600">Move from overall activity into the learning signal you need.</p>
                </div>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {[
                  { href: "/admin/analytics/resources", label: "Resources", icon: Activity },
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
