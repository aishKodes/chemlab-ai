"use client";

import { FormEvent, useEffect, useState } from "react";
import { Upload } from "lucide-react";
import { AdminTable } from "@/components/admin/AdminTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { adminApi, unwrapAdminList } from "@/lib/api/adminApi";
import { getReadableApiError } from "@/lib/api/apiErrors";
import type { BackendMediaAsset } from "@/lib/api/backendTypes";

export default function AdminMediaPage() {
  const [media, setMedia] = useState<BackendMediaAsset[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [altText, setAltText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  function load() {
    setLoading(true);
    adminApi
      .getMediaAssets()
      .then((payload) => setMedia(unwrapAdminList<BackendMediaAsset, "media">(payload, "media")))
      .catch((caught) => setError(getReadableApiError(caught)))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    let cancelled = false;
    adminApi
      .getMediaAssets()
      .then((payload) => {
        if (!cancelled) setMedia(unwrapAdminList<BackendMediaAsset, "media">(payload, "media"));
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

  async function upload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) return;
    setSaving(true);
    setError(null);
    try {
      await adminApi.uploadMedia(file, { title, alt_text: altText, usage_context: "admin_upload" });
      setFile(null);
      setTitle("");
      setAltText("");
      load();
    } catch (caught) {
      setError(getReadableApiError(caught));
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Admin / Media"
        title="Media library."
        description="Upload and review safe images for content, resources, and future lab scenes."
      />
      <Container className="space-y-6 pb-16">
        {error ? <ErrorState description={error} /> : null}
        <Card>
          <form className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end" onSubmit={upload}>
            <label className="block">
              <span className="text-sm font-black text-slate-700">Image file</span>
              <input
                className="mt-2 w-full rounded-2xl border border-blue-100 bg-white px-4 py-3 text-sm font-semibold"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/svg+xml"
                onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              />
            </label>
            <label className="block">
              <span className="text-sm font-black text-slate-700">Title</span>
              <input className="mt-2 w-full rounded-2xl border border-blue-100 bg-white px-4 py-3 text-sm font-semibold" value={title} onChange={(event) => setTitle(event.target.value)} />
            </label>
            <label className="block md:col-span-2">
              <span className="text-sm font-black text-slate-700">Alt text</span>
              <input className="mt-2 w-full rounded-2xl border border-blue-100 bg-white px-4 py-3 text-sm font-semibold" value={altText} onChange={(event) => setAltText(event.target.value)} />
            </label>
            <Button type="submit" disabled={!file || saving} icon={<Upload className="h-4 w-4" />}>
              {saving ? "Uploading..." : "Upload"}
            </Button>
          </form>
        </Card>
        {loading ? (
          <LoadingState label="Loading media" />
        ) : (
          <AdminTable
            items={media}
            columns={[
              { key: "id", label: "ID" },
              { key: "title", label: "Title" },
              { key: "file_url", label: "URL" },
              { key: "mime_type", label: "Type" },
              { key: "status", label: "Status", render: (item) => <StatusBadge status={item.status} /> },
            ]}
            actions={(item) =>
              item.id ? (
                <Button
                  size="sm"
                  variant="danger"
                  onClick={async () => {
                    if (item.id) await adminApi.archiveMedia(item.id);
                    load();
                  }}
                >
                  Archive
                </Button>
              ) : null
            }
          />
        )}
      </Container>
    </>
  );
}
