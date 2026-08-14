"use client";

import { useEffect, useState } from "react";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import type { BackendClassroom } from "@/lib/api/backendTypes";
import { teacherApi } from "@/lib/api/teacherApi";
import { getReadableApiError } from "@/lib/api/apiErrors";

export default function TeacherClassroomsPage() {
  return (
    <RoleGuard allowed={["teacher", "admin"]}>
      <TeacherClassrooms />
    </RoleGuard>
  );
}

function TeacherClassrooms() {
  const [classrooms, setClassrooms] = useState<BackendClassroom[]>([]);
  const [name, setName] = useState("");
  const [classLevel, setClassLevel] = useState("10");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function load() {
    teacherApi
      .getClassrooms()
      .then((payload) => setClassrooms(payload.classrooms))
      .catch((caught) => setError(getReadableApiError(caught)))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function create() {
    if (!name.trim()) return;
    await teacherApi.createClassroom({ name, class_level: classLevel as BackendClassroom["class_level"] });
    setName("");
    load();
  }

  return (
    <>
      <PageHeader eyebrow="Teacher Classrooms" title="Create spaces for your students." description="Classroom codes let students join your chemlearning assignments." />
      <Container className="space-y-6 pb-16">
        {error ? <ErrorState description={error} /> : null}
        <Card className="bg-gradient-to-br from-white via-emerald-50 to-cyan-50">
          <h2 className="text-xl font-black text-slate-950">New classroom</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-[1fr_160px_auto]">
            <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Classroom name" className="focus-ring h-11 rounded-2xl border border-blue-100 bg-white/85 px-4 text-sm font-bold" />
            <select value={classLevel} onChange={(event) => setClassLevel(event.target.value)} className="focus-ring h-11 rounded-2xl border border-blue-100 bg-white/85 px-4 text-sm font-bold">
              {["9", "10", "11", "12"].map((level) => <option key={level} value={level}>Class {level}</option>)}
            </select>
            <Button onClick={create}>Create</Button>
          </div>
        </Card>
        {loading ? (
          <LoadingState label="Loading classrooms" />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {classrooms.map((classroom) => (
              <Card key={classroom.id} interactive>
                <Badge tone="green">{classroom.class_level ? `Class ${classroom.class_level}` : "Classroom"}</Badge>
                <h2 className="mt-3 text-2xl font-black text-slate-950">{classroom.name}</h2>
                <p className="mt-2 text-sm font-bold text-slate-600">Join code: {classroom.join_code ?? "not set"}</p>
                <p className="mt-1 text-sm font-bold text-slate-600">{classroom.student_count ?? 0} students</p>
                <Button href={`/teacher/classrooms/${classroom.id}`} className="mt-5" variant="secondary">Open</Button>
              </Card>
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
