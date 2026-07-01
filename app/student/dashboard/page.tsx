"use client";

import { BookOpen, BrainCircuit, FlaskConical, GraduationCap, Sparkles, Trophy } from "lucide-react";
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
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { ClassroomJoinCard } from "@/components/learning/ClassroomJoinCard";
import { publicApi, fallbackResources, unwrapResources } from "@/lib/api/publicApi";
import { teacherApi } from "@/lib/api/teacherApi";
import { userApi } from "@/lib/api/userApi";
import { getReadableApiError } from "@/lib/api/apiErrors";
import type { BackendNotification, BackendResource, BackendTeacherAssignment } from "@/lib/api/backendTypes";
import { trackEvent } from "@/lib/analytics/trackEvent";

export default function StudentDashboardPage() {
  return (
    <RoleGuard allowed={["student", "admin"]}>
      <StudentDashboard />
    </RoleGuard>
  );
}

function StudentDashboard() {
  const { user } = useAuth();
  const [resources, setResources] = useState<BackendResource[]>(fallbackResources);
  const [notifications, setNotifications] = useState<BackendNotification[]>([]);
  const [resourceError, setResourceError] = useState<string | null>(null);
  const [notificationError, setNotificationError] = useState<string | null>(null);
  const [assignments, setAssignments] = useState<BackendTeacherAssignment[]>([]);

  useEffect(() => {
    void trackEvent({ event_type: "page", event_name: "dashboard_viewed", page_path: "/student/dashboard" });
    publicApi
      .getResources()
      .then((payload) => {
        const nextResources = unwrapResources(payload);
        setResources(nextResources.length ? nextResources : fallbackResources);
      })
      .catch((caught) => setResourceError(getReadableApiError(caught)));
    userApi
      .getNotifications()
      .then((payload) => setNotifications(Array.isArray(payload) ? payload : payload.notifications))
      .catch((caught) => setNotificationError(getReadableApiError(caught)));
    teacherApi
      .getStudentAssignments()
      .then((payload) => setAssignments(payload.assignments))
      .catch(() => setAssignments([]));
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="Student Dashboard"
        title={`Welcome, ${user?.name ?? "chemist"}`}
        description="Choose today's mission, continue a simulation, or ask Chem-Shastri for a hint."
      />
      <Container className="space-y-8 pb-16">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Level" value="Explorer" detail="Your learning identity is forming." icon={<Trophy className="h-5 w-5" aria-hidden="true" />} />
          <StatCard label="Class" value={user?.class_level ? `Class ${user.class_level}` : "Choose"} detail="Complete profile to improve recommendations." icon={<GraduationCap className="h-5 w-5" aria-hidden="true" />} />
          <StatCard label="Daily quest" value="1 ready" detail="A short lab mission is waiting." icon={<Sparkles className="h-5 w-5" aria-hidden="true" />} />
          <StatCard label="Chem-Shastri" value="Ready" detail="Ask for hints, examples, or revision." icon={<BrainCircuit className="h-5 w-5" aria-hidden="true" />} />
        </div>

        {!user?.class_level ? (
          <ErrorState
            title="Complete your profile"
            description="Add your class level so Chemlab can recommend the right resources."
            action={<Button href="/profile">Complete profile</Button>}
          />
        ) : null}

        <section className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
          <Card className="bg-gradient-to-br from-white via-cyan-50 to-violet-50">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <Badge tone="green">Continue learning</Badge>
                <h2 className="mt-3 text-2xl font-black text-slate-950">Recommended simulations</h2>
              </div>
              <Button href="/resources" variant="secondary" size="sm">
                Browse all
              </Button>
            </div>
            {resourceError ? <p className="mt-3 text-sm font-bold text-amber-800">Using local recommendations: {resourceError}</p> : null}
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {resources.slice(0, 4).map((resource) => (
                <ResourceMiniCard key={resource.slug} resource={resource} />
              ))}
            </div>
          </Card>

          <Card>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-950">Notifications</h2>
              <NotificationBell />
            </div>
            <NotificationList notifications={notifications} error={notificationError} />
          </Card>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          {[
            { title: "Ask Chem-Shastri", href: "/ai-tutor", icon: BrainCircuit },
            { title: "Browse Class Resources", href: "/classes", icon: BookOpen },
            { title: "Continue Simulations", href: "/labs", icon: FlaskConical },
            { title: "Memory Cards", href: "/memory-cards", icon: Sparkles },
            { title: "Quick Drills", href: "/quick-drills", icon: Trophy },
            { title: "Quiz Battles", href: "/public-quizzes", icon: Trophy },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title} interactive className="p-4">
                <Icon className="h-6 w-6 text-blue-700" aria-hidden="true" />
                <h3 className="mt-3 text-base font-black text-slate-950">{item.title}</h3>
                <Button href={item.href} size="sm" variant="secondary" className="mt-4">Open</Button>
              </Card>
            );
          })}
        </section>
        <section className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <Card className="bg-gradient-to-br from-violet-50 via-white to-cyan-50">
            <Badge tone="blue">Chem-Shastri</Badge>
            <h2 className="mt-3 text-2xl font-black text-slate-950">Ask with your current class context</h2>
            <p className="mt-2 text-sm font-bold leading-6 text-slate-600">
              Chem-Shastri now uses your class, current page, and recommended resources when you want a hint or explanation.
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <Button href="/ai-tutor?prompt=Explain%20oxidation%20in%20one%20simple%20example" size="sm">
                Explain a doubt
              </Button>
              <Button href="/ai-tutor?prompt=Quiz%20me%20on%20redox%20reactions" variant="secondary" size="sm">
                Quiz me
              </Button>
            </div>
          </Card>
          <Card>
            <Badge tone="amber">Mistake repair</Badge>
            <h2 className="mt-3 text-2xl font-black text-slate-950">Questions to review next</h2>
            <div className="mt-4 grid gap-3">
              {[
                "Why zinc is the reducing agent",
                "How to choose the main carbon chain",
                "What spectator ions do in ionic equations",
              ].map((question) => (
                <a
                  key={question}
                  href={`/ai-tutor?prompt=${encodeURIComponent(question)}`}
                  className="rounded-2xl border border-amber-100 bg-amber-50/75 p-3 text-sm font-black text-amber-900 transition hover:bg-white"
                >
                  {question}
                </a>
              ))}
            </div>
          </Card>
        </section>
        <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <ClassroomJoinCard />
          <Card>
            <h2 className="text-xl font-black text-slate-950">Teacher assignments</h2>
            <div className="mt-4 space-y-3">
              {assignments.length ? (
                assignments.slice(0, 4).map((assignment) => (
                  <div key={assignment.id ?? assignment.title} className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
                    <p className="font-black text-slate-950">{assignment.title}</p>
                    <p className="mt-1 text-sm font-bold text-slate-600">{assignment.classroom_name ?? "Classroom"} · {assignment.progress_status ?? "not started"}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm font-semibold text-slate-600">No teacher assignments yet. Join a classroom when your teacher shares a code.</p>
              )}
            </div>
          </Card>
        </section>
      </Container>
    </>
  );
}

function ResourceMiniCard({ resource }: { resource: BackendResource }) {
  return (
    <div className="rounded-2xl border border-white bg-white/78 p-4 shadow-sm">
      <Badge tone="blue">{resource.type}</Badge>
      <h3 className="mt-3 text-lg font-black text-slate-950">{resource.title}</h3>
      <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">{resource.description}</p>
      {resource.route_url ? (
        <Button href={resource.route_url} size="sm" className="mt-4" icon={<FlaskConical className="h-4 w-4" aria-hidden="true" />}>
          Open simulation
        </Button>
      ) : null}
    </div>
  );
}
