"use client";

import { BookOpenCheck, BrainCircuit, ClipboardList, School, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { useAuth } from "@/components/auth/AuthProvider";
import { NotificationList } from "@/components/notifications/NotificationList";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { ErrorState } from "@/components/ui/ErrorState";
import { StatCard } from "@/components/ui/StatCard";
import { fallbackResources, publicApi, unwrapResources } from "@/lib/api/publicApi";
import { userApi } from "@/lib/api/userApi";
import { getReadableApiError } from "@/lib/api/apiErrors";
import type { BackendNotification, BackendResource } from "@/lib/api/backendTypes";
import { trackEvent } from "@/lib/analytics/trackEvent";

export default function TeacherDashboardPage() {
  return (
    <RoleGuard allowed={["teacher", "admin"]}>
      <TeacherDashboard />
    </RoleGuard>
  );
}

function TeacherDashboard() {
  const { user } = useAuth();
  const [resources, setResources] = useState<BackendResource[]>(fallbackResources);
  const [notifications, setNotifications] = useState<BackendNotification[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void trackEvent({ event_type: "page", event_name: "dashboard_viewed", page_path: "/teacher/dashboard" });
    publicApi
      .getResources()
      .then((payload) => setResources(unwrapResources(payload)))
      .catch((caught) => setError(getReadableApiError(caught)));
    userApi
      .getNotifications()
      .then((payload) => setNotifications(Array.isArray(payload) ? payload : payload.notifications))
      .catch(() => setNotifications([]));
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="Teacher Dashboard"
        title={`Welcome, ${user?.name ?? "teacher"}`}
        description="Find classroom-ready simulations, plan resources, and prepare Chem-Shastri support for students."
      />
      <Container className="space-y-8 pb-16">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Verification" value={user?.verification_status ?? "Unverified"} detail="Teacher verification can be completed later." icon={<School className="h-5 w-5" aria-hidden="true" />} />
          <StatCard label="Resources" value={String(resources.length || fallbackResources.length)} detail="Class 9-12 shortcuts are ready." icon={<BookOpenCheck className="h-5 w-5" aria-hidden="true" />} />
          <StatCard label="Teacher tools" value="Next" detail="Worksheets and classroom prompts are planned." icon={<ClipboardList className="h-5 w-5" aria-hidden="true" />} />
          <StatCard label="Student analytics" value="Ready" detail="Classroom insights are starting in Stage 4." icon={<Users className="h-5 w-5" aria-hidden="true" />} />
        </div>

        {!user?.school_or_institute ? (
          <ErrorState
            title="Complete your teacher profile"
            description="Add school or institute details so Chemlab can prepare classroom workflows later."
            action={<Button href="/profile">Complete profile</Button>}
          />
        ) : null}

        <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="bg-gradient-to-br from-white via-emerald-50 to-sky-50">
            <Badge tone="green">Suggested classroom resources</Badge>
            <h2 className="mt-3 text-2xl font-black text-slate-950">Start with simulations students can see</h2>
            {error ? <p className="mt-3 text-sm font-bold text-amber-800">Showing local examples: {error}</p> : null}
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {(resources.length ? resources : fallbackResources).slice(0, 4).map((resource) => (
                <div key={resource.slug} className="rounded-2xl border border-white bg-white/78 p-4 shadow-sm">
                  <h3 className="text-lg font-black text-slate-950">{resource.title}</h3>
                  <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">{resource.description}</p>
                  {resource.route_url ? <Button href={resource.route_url} size="sm" className="mt-4">Preview</Button> : null}
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <h2 className="text-xl font-black text-slate-950">Notifications</h2>
            <div className="mt-4">
              <NotificationList notifications={notifications} />
            </div>
            <div className="mt-5 rounded-2xl bg-violet-50 p-4">
              <BrainCircuit className="h-5 w-5 text-violet-700" aria-hidden="true" />
              <p className="mt-2 text-sm font-bold leading-6 text-slate-700">
                Chem-Shastri can now draft class-ready hints, quick checks, and lab prompts with teacher mode.
              </p>
              <div className="mt-3 grid gap-2">
                {[
                  "Create a 5-minute redox starter activity for Class 10",
                  "Give me three misconception checks for IUPAC naming",
                  "Turn Daniell cell into a board explanation",
                ].map((prompt) => (
                  <a
                    key={prompt}
                    href={`/ai-tutor?prompt=${encodeURIComponent(prompt)}`}
                    className="rounded-xl bg-white/80 px-3 py-2 text-xs font-black text-violet-800 transition hover:bg-white"
                  >
                    {prompt}
                  </a>
                ))}
              </div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Button href="/teacher/classrooms" variant="secondary">Classrooms</Button>
              <Button href="/teacher/analytics" variant="secondary">Analytics</Button>
              <Button href="/teacher/assignments" variant="secondary">Assignments</Button>
              <Button href="/memory-cards" variant="secondary">Student cards</Button>
            </div>
          </Card>
        </section>
      </Container>
    </>
  );
}
