"use client";

import { Activity, MessageSquareText, Search, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AdminTable } from "@/components/admin/AdminTable";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { Progress } from "@/components/ui/Progress";
import { StatCard } from "@/components/ui/StatCard";
import { getReadableApiError } from "@/lib/api/apiErrors";
import {
  buildAllStudentProfiles,
  displayDate,
  loadStudentAnalyticsSources,
  type StudentAnalyticsProfile,
  type StudentAnalyticsSources,
} from "@/lib/analytics/studentAdminAnalytics";

type StudentListRow = StudentAnalyticsProfile & { id: number | string };

export function StudentAnalyticsDashboard() {
  const [sources, setSources] = useState<StudentAnalyticsSources | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStudentAnalyticsSources()
      .then(setSources)
      .catch((caught) => setError(getReadableApiError(caught)))
      .finally(() => setLoading(false));
  }, []);

  const profiles = useMemo(() => (sources ? buildAllStudentProfiles(sources) : []), [sources]);
  const rows = useMemo<StudentListRow[]>(() => {
    const needle = search.trim().toLowerCase();
    return profiles
      .filter((profile) => {
        if (!needle) return true;
        return [profile.student.name, profile.student.email, profile.student.id]
          .some((value) => String(value ?? "").toLowerCase().includes(needle));
      })
      .map((profile) => ({ ...profile, id: profile.student.id ?? "unknown" }));
  }, [profiles, search]);

  const questionCount = profiles.reduce((sum, profile) => sum + profile.questions.length, 0);
  const feedbackCount = profiles.reduce((sum, profile) => sum + profile.feedback.length, 0);

  return (
    <>
      <PageHeader
        eyebrow="Admin / Student Intelligence"
        title="Understand every learner."
        description="Review engagement, lab activity, mistakes, feedback, and the exact chemistry questions each student asked."
      />
      <Container className="space-y-6 pb-16">
        {error ? <ErrorState title="Student analytics could not load" description={error} /> : null}
        {loading ? (
          <LoadingState label="Building student learning profiles" />
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Student accounts" value={profiles.length} detail="Learners visible to admin" icon={<Users className="h-5 w-5" aria-hidden="true" />} />
              <StatCard label="Active this week" value={sources?.activeStudents ?? 0} detail="Students with recent learning events" icon={<Activity className="h-5 w-5" aria-hidden="true" />} />
              <StatCard label="Chem-Shastri questions" value={questionCount} detail="Exact recent questions linked to students" icon={<MessageSquareText className="h-5 w-5" aria-hidden="true" />} />
              <StatCard label="Student feedback" value={feedbackCount} detail="Dashboard check-ins received" icon={<MessageSquareText className="h-5 w-5" aria-hidden="true" />} />
            </div>

            <Card className="bg-gradient-to-br from-white via-cyan-50 to-violet-50">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-slate-950">Student directory</h2>
                  <p className="mt-1 text-sm font-semibold text-slate-600">
                    Open a learner to inspect sessions, questions, mistakes, feedback, and recent activity together.
                  </p>
                </div>
                <label className="relative block w-full sm:w-80">
                  <span className="sr-only">Search students</span>
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search name, email, or ID"
                    className="h-11 w-full rounded-2xl border border-blue-100 bg-white pl-10 pr-4 text-sm font-semibold text-slate-900 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                  />
                </label>
              </div>
            </Card>

            <AdminTable<StudentListRow>
              items={rows}
              columns={[
                {
                  key: "student",
                  label: "Student",
                  render: (row) => (
                    <div>
                      <p className="font-black text-slate-950">{String(row.student.name ?? "Unnamed student")}</p>
                      <p className="mt-1 text-xs font-semibold text-slate-500">{String(row.student.email ?? "No email")}</p>
                    </div>
                  ),
                },
                { key: "lastActiveAt", label: "Last activity", render: (row) => displayDate(row.lastActiveAt) },
                {
                  key: "engagementScore",
                  label: "Engagement",
                  render: (row) => <Progress value={row.engagementScore} className="min-w-36" />,
                },
                { key: "completedSimulations", label: "Labs completed" },
                { key: "questions", label: "Questions", render: (row) => row.questions.length },
                { key: "mistakes", label: "Mistakes", render: (row) => row.mistakes.length },
                { key: "feedback", label: "Feedback", render: (row) => row.feedback.length },
              ]}
              actions={(row) => (
                <Button href={`/admin/analytics/students/${row.id}`} size="sm" variant="secondary">
                  View learner
                </Button>
              )}
              emptyTitle={search ? "No students match that search" : "No student accounts yet"}
            />

            <p className="text-xs font-semibold leading-5 text-slate-500">
              This admin-only view uses the protected recent learning feeds already stored on Hostinger. Passwords and authentication tokens are never included.
            </p>
          </>
        )}
      </Container>
    </>
  );
}
