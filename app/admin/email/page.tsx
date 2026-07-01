"use client";

import { FormEvent, useEffect, useState } from "react";
import { Send } from "lucide-react";
import { AdminEntityManager } from "@/components/admin/AdminEntityManager";
import { AdminTable } from "@/components/admin/AdminTable";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { ErrorState } from "@/components/ui/ErrorState";
import { adminApi, unwrapAdminList } from "@/lib/api/adminApi";
import { getReadableApiError } from "@/lib/api/apiErrors";
import type { BackendEmailLog, BackendEmailTemplate } from "@/lib/api/backendTypes";

export default function AdminEmailPage() {
  const [to, setTo] = useState("");
  const [logs, setLogs] = useState<BackendEmailLog[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function loadLogs() {
    adminApi
      .getEmailLogs()
      .then((payload) => setLogs(unwrapAdminList<BackendEmailLog, "logs">(payload, "logs")))
      .catch(() => undefined);
  }

  useEffect(() => {
    loadLogs();
  }, []);

  async function sendTest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    try {
      await adminApi.sendTestEmail({ to_email: to });
      setMessage("Test email request sent. Check logs for provider status.");
      loadLogs();
    } catch (caught) {
      setError(getReadableApiError(caught));
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Admin / Email"
        title="Email templates and SMTP test."
        description="Edit transactional templates, send test mail, and inspect backend delivery logs."
      />
      <Container className="space-y-8 pb-16">
        {error ? <ErrorState description={error} /> : null}
        {message ? <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-black text-emerald-900">{message}</div> : null}
        <Card>
          <form className="flex flex-wrap items-end gap-4" onSubmit={sendTest}>
            <label className="min-w-72 flex-1">
              <span className="text-sm font-black text-slate-700">Send test email to</span>
              <input
                className="mt-2 w-full rounded-2xl border border-blue-100 bg-white px-4 py-3 text-sm font-semibold"
                type="email"
                value={to}
                onChange={(event) => setTo(event.target.value)}
                placeholder="admin@example.com"
                required
              />
            </label>
            <Button type="submit" icon={<Send className="h-4 w-4" />}>
              Send test
            </Button>
          </form>
        </Card>
        <AdminEntityManager<BackendEmailTemplate & Record<string, unknown>>
          title="Email Templates"
          description="Use variables such as {{name}}, {{code}}, and {{reset_code}}. Keep templates short and reliable for SMTP delivery."
          listKey="templates"
          fetchItems={adminApi.getEmailTemplates}
          updateItem={adminApi.updateEmailTemplate}
          columns={[
            { key: "id", label: "ID" },
            { key: "template_key", label: "Key" },
            { key: "subject", label: "Subject" },
            { key: "language", label: "Language" },
            { key: "status", label: "Status" },
          ]}
          fields={[
            { name: "template_key", label: "Template key", required: true },
            { name: "subject", label: "Subject", required: true },
            { name: "body_html", label: "HTML body", type: "textarea", required: true },
            { name: "body_text", label: "Text body", type: "textarea" },
            { name: "language", label: "Language" },
            { name: "status", label: "Status", type: "select", options: ["active", "draft", "archived"].map((value) => ({ label: value, value })) },
          ]}
        />
        <Card>
          <h2 className="text-xl font-black text-slate-950">Recent email logs</h2>
          <div className="mt-4">
            <AdminTable
              items={logs}
              columns={[
                { key: "id", label: "ID" },
                { key: "to_email", label: "To" },
                { key: "subject", label: "Subject" },
                { key: "status", label: "Status" },
                { key: "created_at", label: "Created" },
              ]}
            />
          </div>
        </Card>
      </Container>
    </>
  );
}
