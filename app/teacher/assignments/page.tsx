"use client";

import { useEffect, useState } from "react";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import type { BackendTeacherAssignment } from "@/lib/api/backendTypes";
import { teacherApi } from "@/lib/api/teacherApi";
import { getReadableApiError } from "@/lib/api/apiErrors";

export default function TeacherAssignmentsPage() {
  return (
    <RoleGuard allowed={["teacher", "admin"]}>
      <TeacherAssignments />
    </RoleGuard>
  );
}

function TeacherAssignments() {
  const [assignments, setAssignments] = useState<BackendTeacherAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    teacherApi
      .getAssignments()
      .then((payload) => setAssignments(payload.assignments))
      .catch((caught) => setError(getReadableApiError(caught)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHeader eyebrow="Teacher Assignments" title="Assigned practice." description="Track the resources, decks, and drills you have sent to classrooms." />
      <Container className="space-y-6 pb-16">
        {error ? <ErrorState description={error} /> : null}
        {loading ? <LoadingState label="Loading assignments" /> : assignments.map((assignment) => (
          <Card key={assignment.id}>
            <h2 className="text-xl font-black text-slate-950">{assignment.title}</h2>
            <p className="mt-2 text-sm font-bold text-slate-600">{assignment.classroom_name ?? "Classroom"} · {assignment.status}</p>
          </Card>
        ))}
      </Container>
    </>
  );
}
