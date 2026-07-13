"use client";

import { RadioTower, RefreshCcw, ShieldCheck, Users } from "lucide-react";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";

export default function TeacherLiveLobbyPage() {
  return (
    <RoleGuard allowed={["teacher", "admin"]}>
      <PageHeader
        eyebrow="Live Quiz Lobby"
        title="Start a room, share the PIN, then watch answers arrive."
        description="Use this hub before class. Create or open a quiz first; each live room gets its own protected results screen."
      />
      <Container className="space-y-6 pb-16">
        <Card className="bg-gradient-to-br from-white via-cyan-50 to-lime-50">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <Badge tone="green">Demo safe</Badge>
              <h2 className="mt-3 text-3xl font-black text-slate-950">Teacher live quizzes are ready from the quiz list.</h2>
              <p className="mt-2 max-w-2xl text-sm font-bold leading-6 text-slate-600">
                Open a quiz, click Start live room, share the six-digit PIN, and keep the live results page open. If the backend is slow, the live page has a manual refresh button.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button href="/teacher/quizzes" icon={<RadioTower className="h-4 w-4" />}>Open quizzes</Button>
              <Button href="/teacher/quizzes/create" variant="secondary">Create quiz</Button>
            </div>
          </div>
        </Card>

        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              icon: Users,
              title: "Students join by PIN",
              text: "Students use /join, enter the room PIN, add a display name, and answer one question at a time.",
            },
            {
              icon: RefreshCcw,
              title: "Refresh is built in",
              text: "The teacher room polls automatically and also has a visible refresh button for live demos.",
            },
            {
              icon: ShieldCheck,
              title: "Teacher protected",
              text: "This lobby and live room are guarded for teachers and admins, while student joining stays separate.",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title} className="bg-white/85">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-600 text-white">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-xl font-black text-slate-950">{item.title}</h3>
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">{item.text}</p>
              </Card>
            );
          })}
        </div>
      </Container>
    </RoleGuard>
  );
}
