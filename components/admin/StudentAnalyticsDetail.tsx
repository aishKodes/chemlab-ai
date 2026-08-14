"use client";

import { Activity, ArrowLeft, BrainCircuit, Clock3, FlaskConical, MessageSquareText, TriangleAlert } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { Progress } from "@/components/ui/Progress";
import { StatCard } from "@/components/ui/StatCard";
import { adminApi } from "@/lib/api/adminApi";
import { getReadableApiError } from "@/lib/api/apiErrors";
import type { BackendUser } from "@/lib/api/backendTypes";
import {
  buildStudentAnalyticsProfile,
  displayDate,
  loadStudentAnalyticsSources,
  metadataFromRow,
  type AnalyticsRow,
  type StudentAnalyticsProfile,
} from "@/lib/analytics/studentAdminAnalytics";

export function StudentAnalyticsDetail({ studentId }: { studentId: string }) {
  const [profile, setProfile] = useState<StudentAnalyticsProfile | null>(null);
  const [studentProfile, setStudentProfile] = useState<Partial<BackendUser> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      loadStudentAnalyticsSources(),
      adminApi.getStudentProfile(studentId).catch(() => null),
    ])
      .then(([sources, profilePayload]) => {
        setProfile(buildStudentAnalyticsProfile(sources, studentId));
        setStudentProfile(profilePayload?.profile ?? null);
      })
      .catch((caught) => setError(getReadableApiError(caught)))
      .finally(() => setLoading(false));
  }, [studentId]);

  const timeline = useMemo<Array<AnalyticsRow & { activity_kind: string }>>(() => {
    if (!profile) return [];
    const rows: Array<AnalyticsRow & { activity_kind: string }> = [
      ...profile.events.map((row) => ({ ...row, activity_kind: "Learning event" })),
      ...profile.simulationSessions.map((row) => ({ ...row, activity_kind: "Simulation" })),
      ...profile.resourceSessions.map((row) => ({ ...row, activity_kind: "Resource" })),
      ...profile.mistakes.map((row) => ({ ...row, activity_kind: "Mistake" })),
      ...profile.questions.map((row) => ({ ...row, activity_kind: "Chem-Shastri" })),
    ];
    return rows.sort((a, b) => String(b.created_at ?? "").localeCompare(String(a.created_at ?? ""))).slice(0, 18);
  }, [profile]);

  if (loading) return <LoadingState label="Building learner detail" />;
  if (error) return <Container className="py-12"><ErrorState description={error} /></Container>;
  if (!profile) {
    return (
      <Container className="py-12">
        <EmptyState title="Student not found" description="This learner is not present in the current admin student feed." action={<Button href="/admin/analytics/students">Back to students</Button>} />
      </Container>
    );
  }

  const name = String(profile.student.name ?? "Student");

  return (
    <Container className="space-y-6 py-8 pb-16">
      <Button href="/admin/analytics/students" variant="ghost" size="sm" icon={<ArrowLeft className="h-4 w-4" aria-hidden="true" />}>
        All students
      </Button>

      <Card className="bg-gradient-to-br from-white via-blue-50 to-violet-50">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Badge tone="blue">Student #{String(profile.student.id)}</Badge>
            <h1 className="mt-3 text-3xl font-black text-slate-950">{name}</h1>
            <p className="mt-2 text-sm font-semibold text-slate-600">{String(profile.student.email ?? "No email")}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge tone={profile.student.status === "active" ? "green" : "amber"}>{String(profile.student.status ?? "unknown")}</Badge>
              <Badge tone="slate">{studentProfile?.class_level ? `Class ${studentProfile.class_level}` : "Class not set"}</Badge>
              <Badge tone="slate">Joined {displayDate(profile.student.created_at)}</Badge>
            </div>
          </div>
          <div className="w-full max-w-xs rounded-2xl border border-blue-100 bg-white/80 p-4">
            <div className="flex items-center justify-between text-sm font-black text-slate-700">
              <span>Engagement signal</span>
              <span>{profile.engagementScore}%</span>
            </div>
            <Progress value={profile.engagementScore} className="mt-3" />
            <p className="mt-2 text-xs font-semibold leading-5 text-slate-500">Based on recent activity, active days, completed labs, and learning questions.</p>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <StatCard label="Activities" value={profile.activityCount} detail={`${profile.activeDays} active days`} icon={<Activity className="h-5 w-5" aria-hidden="true" />} />
        <StatCard label="Lab sessions" value={profile.simulationSessions.length} detail={`${profile.completedSimulations} completed`} icon={<FlaskConical className="h-5 w-5" aria-hidden="true" />} />
        <StatCard label="Lab time" value={`${profile.totalSimulationMinutes}m`} detail="Recorded session time" icon={<Clock3 className="h-5 w-5" aria-hidden="true" />} />
        <StatCard label="Questions" value={profile.questions.length} detail="Asked Chem-Shastri" icon={<BrainCircuit className="h-5 w-5" aria-hidden="true" />} />
        <StatCard label="Mistakes" value={profile.mistakes.length} detail="Learning clues captured" icon={<TriangleAlert className="h-5 w-5" aria-hidden="true" />} />
        <StatCard label="Feedback" value={profile.feedback.length} detail="Student check-ins" icon={<MessageSquareText className="h-5 w-5" aria-hidden="true" />} />
      </div>

      <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <div className="flex items-center justify-between gap-3">
            <div>
              <Badge tone="blue">Exact questions</Badge>
              <h2 className="mt-3 text-2xl font-black text-slate-950">What {name} asked Chem-Shastri</h2>
            </div>
            <Button href="/admin/analytics/chem-shastri" variant="secondary" size="sm">All questions</Button>
          </div>
          <div className="mt-5 space-y-3">
            {profile.questions.length ? profile.questions.slice(0, 12).map((question, index) => (
              <div key={String(question.id ?? index)} className="rounded-2xl border border-violet-100 bg-violet-50/60 p-4">
                <p className="text-base font-black leading-6 text-slate-950">{String(question.question_text ?? "Question text unavailable")}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-slate-500">
                  <span>{displayDate(question.created_at)}</span>
                  {question.mode ? <Badge tone="slate">{String(question.mode)}</Badge> : null}
                  {question.intent ? <Badge tone="slate">{String(question.intent)}</Badge> : null}
                  {question.simulation_slug ? <Badge tone="cyan">{String(question.simulation_slug)}</Badge> : null}
                  {question.helpful_rating ? <Badge tone={question.helpful_rating === "helpful" ? "green" : "amber"}>{String(question.helpful_rating)}</Badge> : null}
                </div>
              </div>
            )) : <EmptyState title="No Chem-Shastri questions yet" description="Questions will appear here after this student uses the mentor." />}
          </div>
        </Card>

        <Card>
          <Badge tone="green">Student voice</Badge>
          <h2 className="mt-3 text-2xl font-black text-slate-950">Feedback check-ins</h2>
          <div className="mt-5 space-y-3">
            {profile.feedback.length ? profile.feedback.map((feedback, index) => {
              const metadata = metadataFromRow(feedback);
              return (
                <div key={String(feedback.id ?? index)} className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
                  <p className="font-black text-slate-950">Improve first: {labelValue(metadata.improvement_priority)}</p>
                  <p className="mt-2 text-sm font-semibold text-slate-700">Helped most: {labelValue(metadata.helped_most)}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-700">Friction: {labelValue(metadata.friction_point)}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-700">Clarity: {String(metadata.clarity_rating ?? "-")}/5</p>
                  {metadata.comment ? <p className="mt-3 rounded-xl bg-white p-3 text-sm font-bold leading-6 text-slate-800">“{String(metadata.comment)}”</p> : null}
                  <p className="mt-3 text-xs font-bold text-slate-500">{displayDate(feedback.created_at)}</p>
                </div>
              );
            }) : <EmptyState title="No dashboard feedback yet" description="This student has not completed the new learning check-in." />}
          </div>
        </Card>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <Card>
          <Badge tone="cyan">Lab activity</Badge>
          <h2 className="mt-3 text-2xl font-black text-slate-950">Simulation sessions</h2>
          <div className="mt-5 space-y-3">
            {profile.simulationSessions.length ? profile.simulationSessions.slice(0, 10).map((session, index) => (
              <ActivityRow
                key={String(session.id ?? index)}
                title={String(session.simulation_slug ?? "Simulation")}
                detail={`${truthy(session.completed) ? "Completed" : "Started"} · ${Math.round(Number(session.duration_seconds ?? 0) / 60)} min · ${Number(session.mistakes_count ?? 0)} mistakes`}
                date={session.created_at}
              />
            )) : <EmptyState title="No simulation sessions" description="Lab starts and completions will appear here." />}
          </div>
        </Card>

        <Card>
          <Badge tone="amber">Misconception signals</Badge>
          <h2 className="mt-3 text-2xl font-black text-slate-950">Mistakes worth reviewing</h2>
          <div className="mt-5 space-y-3">
            {profile.mistakes.length ? profile.mistakes.slice(0, 10).map((mistake, index) => (
              <ActivityRow
                key={String(mistake.id ?? index)}
                title={String(mistake.mistake_key ?? "Learning mistake")}
                detail={String(mistake.feedback_shown ?? mistake.simulation_slug ?? "A retry clue was recorded.")}
                date={mistake.created_at}
              />
            )) : <EmptyState title="No mistakes recorded" description="That may mean the learner is doing well or has not reached tracked practice yet." />}
          </div>
        </Card>
      </section>

      <Card>
        <Badge tone="slate">Recent timeline</Badge>
        <h2 className="mt-3 text-2xl font-black text-slate-950">Learning activity in order</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {timeline.length ? timeline.map((row, index) => (
            <ActivityRow
              key={`${String(row.activity_kind)}-${String(row.id ?? index)}`}
              title={`${String(row.activity_kind)} · ${activityLabel(row)}`}
              detail={activityDetail(row)}
              date={row.created_at}
            />
          )) : <p className="text-sm font-semibold text-slate-600">No recent activity is available for this learner.</p>}
        </div>
      </Card>
    </Container>
  );
}

function ActivityRow({ title, detail, date }: { title: string; detail: string; date: unknown }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white/80 p-4">
      <p className="font-black text-slate-950">{title}</p>
      <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">{detail}</p>
      <p className="mt-2 text-xs font-bold text-slate-400">{displayDate(date)}</p>
    </div>
  );
}

function activityLabel(row: AnalyticsRow) {
  return String(row.event_name ?? row.simulation_slug ?? row.resource_slug ?? row.mistake_key ?? row.mode ?? "Activity");
}

function activityDetail(row: AnalyticsRow) {
  if (row.question_text) return String(row.question_text);
  if (row.page_path) return String(row.page_path);
  if (row.feedback_shown) return String(row.feedback_shown);
  return "Recorded learning activity";
}

function labelValue(value: unknown) {
  if (!value) return "Not answered";
  return String(value).replace(/_/g, " ").replace(/^\w/, (letter) => letter.toUpperCase());
}

function truthy(value: unknown) {
  return value === true || value === 1 || value === "1" || value === "true";
}
