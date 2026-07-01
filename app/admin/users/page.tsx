"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { ShieldCheck, UserCheck, Users } from "lucide-react";
import { AdminTable } from "@/components/admin/AdminTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { adminApi, unwrapAdminList } from "@/lib/api/adminApi";
import { getReadableApiError } from "@/lib/api/apiErrors";
import type { BackendUser } from "@/lib/api/backendTypes";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<BackendUser[]>([]);
  const [selected, setSelected] = useState<BackendUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    adminApi
      .getUsers()
      .then((payload) => {
        const next = unwrapAdminList<BackendUser, "users">(payload, "users");
        setUsers(next);
        setSelected((current) => current ?? next[0] ?? null);
      })
      .catch((caught) => setError(getReadableApiError(caught)))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    let cancelled = false;
    adminApi
      .getUsers()
      .then((payload) => {
        if (cancelled) return;
        const next = unwrapAdminList<BackendUser, "users">(payload, "users");
        setUsers(next);
        setSelected((current) => current ?? next[0] ?? null);
      })
      .catch((caught) => {
        if (!cancelled) setError(getReadableApiError(caught));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function updateStatus(user: BackendUser, status: NonNullable<BackendUser["status"]>) {
    if (!user.id) return;
    await adminApi.updateUserStatus(user.id, status);
    load();
  }

  async function updateRole(user: BackendUser, role: BackendUser["role"]) {
    if (!user.id) return;
    await adminApi.updateUserRole(user.id, role);
    load();
  }

  async function verifyTeacher(user: BackendUser) {
    if (!user.id) return;
    await adminApi.verifyTeacher(user.id);
    load();
  }

  return (
    <>
      <PageHeader
        eyebrow="Admin / Users"
        title="Manage Chemlab accounts."
        description="Review students, teachers, admins, account status, and teacher verification from one protected surface."
      />
      <Container className="space-y-6 pb-16">
        {error ? <ErrorState description={error} /> : null}
        <div className="grid gap-4 md:grid-cols-3">
          <Stat label="Total users" value={users.length} icon={<Users className="h-5 w-5" />} />
          <Stat label="Teachers" value={users.filter((user) => user.role === "teacher").length} icon={<UserCheck className="h-5 w-5" />} />
          <Stat label="Admins" value={users.filter((user) => user.role === "admin").length} icon={<ShieldCheck className="h-5 w-5" />} />
        </div>
        {loading ? (
          <LoadingState label="Loading users" />
        ) : (
          <AdminTable
            items={users}
            columns={[
              { key: "name", label: "Name" },
              { key: "email", label: "Email" },
              { key: "role", label: "Role", render: (user) => <Badge tone="blue">{user.role}</Badge> },
              { key: "status", label: "Status", render: (user) => <StatusBadge status={user.status} /> },
              { key: "created_at", label: "Joined" },
            ]}
            actions={(user) => (
              <Button size="sm" variant="secondary" onClick={() => setSelected(user)}>
                View
              </Button>
            )}
          />
        )}

        {selected ? (
          <Card>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <Badge tone="cyan">Selected user</Badge>
                <h2 className="mt-3 text-2xl font-black text-slate-950">{selected.name}</h2>
                <p className="mt-1 text-sm font-bold text-slate-500">{selected.email}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <StatusBadge status={selected.status} />
                  <Badge tone="blue">{selected.role}</Badge>
                  {selected.class_level ? <Badge tone="green">Class {selected.class_level}</Badge> : null}
                  {selected.verification_status ? <StatusBadge status={selected.verification_status} /> : null}
                </div>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {(["active", "blocked", "pending"] as const).map((status) => (
                  <Button key={status} size="sm" variant={status === "blocked" ? "danger" : "secondary"} onClick={() => updateStatus(selected, status)}>
                    Set {status}
                  </Button>
                ))}
                {(["student", "teacher", "admin"] as const).map((role) => (
                  <Button key={role} size="sm" variant="secondary" onClick={() => updateRole(selected, role)}>
                    Make {role}
                  </Button>
                ))}
                {selected.role === "teacher" ? (
                  <Button size="sm" onClick={() => verifyTeacher(selected)}>
                    Verify teacher
                  </Button>
                ) : null}
              </div>
            </div>
          </Card>
        ) : null}
      </Container>
    </>
  );
}

function Stat({ label, value, icon }: { label: string; value: number; icon: ReactNode }) {
  return (
    <Card>
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-100 text-blue-700">{icon}</div>
        <div>
          <p className="text-sm font-black text-slate-500">{label}</p>
          <p className="text-2xl font-black text-slate-950">{value}</p>
        </div>
      </div>
    </Card>
  );
}
