"use client";

import { FormEvent, useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { AdminTable } from "@/components/admin/AdminTable";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { adminApi, unwrapAdminList } from "@/lib/api/adminApi";
import { getReadableApiError } from "@/lib/api/apiErrors";
import type { BackendNotification } from "@/lib/api/backendTypes";

type NotificationForm = {
  title: string;
  body: string;
  role_target: "student" | "teacher" | "admin" | "all";
  type: string;
  action_url: string;
};

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<BackendNotification[]>([]);
  const [form, setForm] = useState<NotificationForm>({ title: "", body: "", role_target: "all", type: "announcement", action_url: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    adminApi
      .getNotifications()
      .then((payload) => setNotifications(unwrapAdminList<BackendNotification, "notifications">(payload, "notifications")))
      .catch((caught) => setError(getReadableApiError(caught)))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    let cancelled = false;
    adminApi
      .getNotifications()
      .then((payload) => {
        if (!cancelled) setNotifications(unwrapAdminList<BackendNotification, "notifications">(payload, "notifications"));
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

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    try {
      await adminApi.sendNotification(form);
      setForm({ title: "", body: "", role_target: "all", type: "announcement", action_url: "" });
      load();
    } catch (caught) {
      setError(getReadableApiError(caught));
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Admin / Notifications"
        title="Send learning announcements."
        description="Notify all users or a specific role. Push notifications are a future stage."
      />
      <Container className="space-y-6 pb-16">
        {error ? <ErrorState description={error} /> : null}
        <Card>
          <form className="grid gap-4 md:grid-cols-2" onSubmit={send}>
            <label className="block">
              <span className="text-sm font-black text-slate-700">Title</span>
              <input className="mt-2 w-full rounded-2xl border border-blue-100 bg-white px-4 py-3 text-sm font-semibold" value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} required />
            </label>
            <label className="block">
              <span className="text-sm font-black text-slate-700">Role target</span>
              <select className="mt-2 w-full rounded-2xl border border-blue-100 bg-white px-4 py-3 text-sm font-semibold" value={form.role_target} onChange={(event) => setForm((current) => ({ ...current, role_target: event.target.value as NotificationForm["role_target"] }))}>
                <option value="all">All</option>
                <option value="student">Students</option>
                <option value="teacher">Teachers</option>
                <option value="admin">Admins</option>
              </select>
            </label>
            <label className="block md:col-span-2">
              <span className="text-sm font-black text-slate-700">Message</span>
              <textarea className="mt-2 min-h-28 w-full rounded-2xl border border-blue-100 bg-white px-4 py-3 text-sm font-semibold" value={form.body} onChange={(event) => setForm((current) => ({ ...current, body: event.target.value }))} required />
            </label>
            <label className="block">
              <span className="text-sm font-black text-slate-700">Action URL</span>
              <input className="mt-2 w-full rounded-2xl border border-blue-100 bg-white px-4 py-3 text-sm font-semibold" value={form.action_url} onChange={(event) => setForm((current) => ({ ...current, action_url: event.target.value }))} />
            </label>
            <div className="flex items-end">
              <Button type="submit" icon={<Bell className="h-4 w-4" />}>
                Send notification
              </Button>
            </div>
          </form>
        </Card>
        {loading ? (
          <LoadingState label="Loading notifications" />
        ) : (
          <AdminTable
            items={notifications}
            columns={[
              { key: "id", label: "ID" },
              { key: "title", label: "Title" },
              { key: "role_target", label: "Target" },
              { key: "type", label: "Type" },
              { key: "created_at", label: "Created" },
            ]}
          />
        )}
      </Container>
    </>
  );
}
