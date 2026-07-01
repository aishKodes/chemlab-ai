"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import type { BackendClassroom, BackendTeacherAssignment } from "@/lib/api/backendTypes";
import { teacherApi } from "@/lib/api/teacherApi";
import { getReadableApiError } from "@/lib/api/apiErrors";

export default function TeacherClassroomDetailPage() {
  return (
    <RoleGuard allowed={["teacher", "admin"]}>
      <TeacherClassroomDetail />
    </RoleGuard>
  );
}

function TeacherClassroomDetail() {
  const params = useParams<{ id: string }>();
  const [classroom, setClassroom] = useState<BackendClassroom | null>(null);
  const [students, setStudents] = useState<unknown[]>([]);
  const [assignments, setAssignments] = useState<BackendTeacherAssignment[]>([]);
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function load() {
    teacherApi
      .getClassroom(params.id)
      .then((payload) => {
        setClassroom(payload.classroom);
        setStudents(payload.students);
        setAssignments(payload.assignments);
      })
      .catch((caught) => setError(getReadableApiError(caught)))
      .finally(() => setLoading(false));
  }

  useEffect(load, [params.id]);

  async function regenerate() {
    const payload = await teacherApi.regenerateJoinCode(params.id);
    setClassroom((current) => (current ? { ...current, join_code: payload.join_code } : current));
  }

  async function createAssignment() {
    if (!assignmentTitle.trim()) return;
    await teacherApi.createAssignment(params.id, { title: assignmentTitle, instructions: "Complete this Chemlab activity and review your mistakes." });
    setAssignmentTitle("");
    load();
  }

  return (
    <>
      <PageHeader eyebrow="Classroom" title={classroom?.name ?? "Classroom"} description="Manage students, join code, and Stage 4 assignments." />
      <Container className="space-y-6 pb-16">
        {error ? <ErrorState description={error} /> : null}
        {loading ? (
          <LoadingState label="Loading classroom" />
        ) : (
          <>
            <Card>
              <h2 className="text-xl font-black text-slate-950">Join code</h2>
              <p className="mt-2 text-3xl font-black text-blue-700">{classroom?.join_code ?? "Not set"}</p>
              <Button className="mt-4" variant="secondary" onClick={regenerate}>Regenerate code</Button>
            </Card>
            <div className="grid gap-5 lg:grid-cols-2">
              <Card>
                <h2 className="text-xl font-black text-slate-950">Students</h2>
                <pre className="mt-4 max-h-72 overflow-auto rounded-2xl bg-slate-950 p-4 text-xs font-bold text-cyan-100">{JSON.stringify(students, null, 2)}</pre>
              </Card>
              <Card>
                <h2 className="text-xl font-black text-slate-950">Assignments</h2>
                <div className="mt-4 flex gap-2">
                  <input value={assignmentTitle} onChange={(event) => setAssignmentTitle(event.target.value)} placeholder="Assignment title" className="focus-ring h-11 flex-1 rounded-2xl border border-blue-100 bg-white/85 px-4 text-sm font-bold" />
                  <Button onClick={createAssignment}>Assign</Button>
                </div>
                <div className="mt-4 space-y-3">
                  {assignments.map((assignment) => <div key={assignment.id} className="rounded-2xl bg-blue-50 p-4 font-bold text-slate-700">{assignment.title}</div>)}
                </div>
              </Card>
            </div>
          </>
        )}
      </Container>
    </>
  );
}
