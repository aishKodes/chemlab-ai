"use client";

import type { ReactNode } from "react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { Plus, RefreshCw, Save, Search } from "lucide-react";
import { AdminTable, type AdminColumn } from "@/components/admin/AdminTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { getReadableApiError } from "@/lib/api/apiErrors";

export type AdminFieldOption = {
  label: string;
  value: string | number;
};

export type AdminFieldConfig = {
  name: string;
  label: string;
  type?: "text" | "number" | "textarea" | "select" | "json";
  required?: boolean;
  placeholder?: string;
  options?: AdminFieldOption[];
};

type EntityRecord = Record<string, unknown> & { id?: number | string };

export function AdminEntityManager<T extends EntityRecord>({
  title,
  description,
  fetchItems,
  createItem,
  updateItem,
  deleteItem,
  columns,
  fields,
  listKey,
  defaultValues,
  query,
  extraActions,
  emptyTitle,
  getItemId,
}: {
  title: string;
  description: string;
  fetchItems: (query?: Record<string, string>) => Promise<unknown>;
  createItem?: (payload: Partial<T>) => Promise<unknown>;
  updateItem?: (id: number | string, payload: Partial<T>) => Promise<unknown>;
  deleteItem?: (id: number | string) => Promise<unknown>;
  columns: AdminColumn<T>[];
  fields: AdminFieldConfig[];
  listKey: string;
  defaultValues?: Partial<T>;
  query?: Record<string, string>;
  extraActions?: (item: T, refresh: () => void) => ReactNode;
  emptyTitle?: string;
  getItemId?: (item: T) => number | string | undefined;
}) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<T | null>(null);
  const [form, setForm] = useState<Record<string, string>>(() => formFromRecord(defaultValues ?? {}, fields));

  const mergedQuery = useMemo(() => ({ ...(query ?? {}), ...(search.trim() ? { search: search.trim() } : {}) }), [query, search]);

  function refresh() {
    setLoading(true);
    setError(null);
    fetchItems(mergedQuery)
      .then((payload) => setItems(unwrapList<T>(payload, listKey)))
      .catch((caught) => setError(getReadableApiError(caught)))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    let cancelled = false;
    fetchItems(mergedQuery)
      .then((payload) => {
        if (!cancelled) setItems(unwrapList<T>(payload, listKey));
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(mergedQuery)]);

  function beginCreate() {
    setEditing(null);
    setForm(formFromRecord(defaultValues ?? {}, fields));
    setSuccess(null);
    setError(null);
  }

  function beginEdit(item: T) {
    setEditing(item);
    setForm(formFromRecord({ ...(defaultValues ?? {}), ...item }, fields));
    setSuccess(null);
    setError(null);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!createItem && !editing) return;
    if (!updateItem && editing) return;
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = payloadFromForm<T>(form, fields);
      const updateId = editing ? (getItemId?.(editing) ?? editing.id) : undefined;
      if (updateId !== undefined) {
        await updateItem?.(updateId, payload);
        setSuccess(`${title} updated.`);
      } else {
        await createItem?.(payload);
        setSuccess(`${title} created.`);
      }
      beginCreate();
      refresh();
    } catch (caught) {
      setError(getReadableApiError(caught));
    } finally {
      setSaving(false);
    }
  }

  async function remove(item: T) {
    if (!deleteItem || item.id === undefined) return;
    setSaving(true);
    setError(null);
    try {
      await deleteItem(item.id);
      setSuccess(`${title} deleted.`);
      refresh();
    } catch (caught) {
      setError(getReadableApiError(caught));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <Card className="bg-gradient-to-br from-white via-sky-50 to-violet-50">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Badge tone="blue">Admin CRUD</Badge>
            <h2 className="mt-3 text-2xl font-black text-slate-950">{title}</h2>
            <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-600">{description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="secondary" size="sm" onClick={refresh} icon={<RefreshCw className="h-4 w-4" />}>
              Refresh
            </Button>
            {createItem ? (
              <Button type="button" size="sm" onClick={beginCreate} icon={<Plus className="h-4 w-4" />}>
                New
              </Button>
            ) : null}
          </div>
        </div>
      </Card>

      {error ? <ErrorState description={error} /> : null}
      {success ? <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-black text-emerald-900">{success}</div> : null}

      {createItem || updateItem ? (
        <Card>
          <form className="space-y-4" onSubmit={submit}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-lg font-black text-slate-950">{editing ? `Edit #${editing.id}` : `Create ${title}`}</h3>
              {editing ? <StatusBadge status={String(editing.status ?? "editing")} /> : null}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {fields.map((field) => (
                <label key={field.name} className={field.type === "textarea" || field.type === "json" ? "block md:col-span-2" : "block"}>
                  <span className="text-sm font-black text-slate-700">{field.label}</span>
                  {renderField(field, form[field.name] ?? "", (value) => setForm((current) => ({ ...current, [field.name]: value })))}
                </label>
              ))}
            </div>
            <Button type="submit" disabled={saving} icon={<Save className="h-4 w-4" />}>
              {saving ? "Saving..." : editing ? "Save changes" : "Create"}
            </Button>
          </form>
        </Card>
      ) : null}

      <Card className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Search className="h-5 w-5 text-blue-700" />
          <input
            className="min-w-64 rounded-2xl border border-blue-100 bg-white px-4 py-2 text-sm font-bold text-slate-900 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            placeholder="Search records"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <p className="text-sm font-black text-slate-500">{items.length} records</p>
      </Card>

      {loading ? (
        <LoadingState label={`Loading ${title}`} />
      ) : (
        <AdminTable
          items={items}
          columns={columns}
          emptyTitle={emptyTitle}
          actions={(item) => (
            <div className="flex flex-wrap gap-2">
              {updateItem ? (
                <Button type="button" size="sm" variant="secondary" onClick={() => beginEdit(item)}>
                  Edit
                </Button>
              ) : null}
              {extraActions?.(item, refresh)}
              {deleteItem ? (
                <Button type="button" size="sm" variant="danger" onClick={() => remove(item)}>
                  Delete
                </Button>
              ) : null}
            </div>
          )}
        />
      )}
    </div>
  );
}

const inputClass =
  "mt-2 w-full rounded-2xl border border-blue-100 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100";

function renderField(field: AdminFieldConfig, value: string, onChange: (value: string) => void) {
  if (field.type === "textarea" || field.type === "json") {
    return (
      <textarea
        className={`${inputClass} min-h-28`}
        required={field.required}
        placeholder={field.placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    );
  }

  if (field.type === "select") {
    return (
      <select className={inputClass} required={field.required} value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">Choose</option>
        {field.options?.map((option) => (
          <option key={String(option.value)} value={String(option.value)}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  return (
    <input
      className={inputClass}
      type={field.type === "number" ? "number" : "text"}
      required={field.required}
      placeholder={field.placeholder}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

function formFromRecord(record: Record<string, unknown>, fields: AdminFieldConfig[]) {
  const next: Record<string, string> = {};
  fields.forEach((field) => {
    const value = record[field.name];
    next[field.name] = typeof value === "object" && value !== null ? JSON.stringify(value, null, 2) : String(value ?? "");
  });
  return next;
}

function payloadFromForm<T>(form: Record<string, string>, fields: AdminFieldConfig[]): Partial<T> {
  const payload: Record<string, unknown> = {};
  fields.forEach((field) => {
    const raw = form[field.name];
    if (raw === "") return;
    if (field.type === "number") {
      payload[field.name] = Number(raw);
      return;
    }
    if (field.type === "json") {
      try {
        payload[field.name] = JSON.parse(raw);
      } catch {
        payload[field.name] = raw;
      }
      return;
    }
    payload[field.name] = raw;
  });
  return payload as Partial<T>;
}

function unwrapList<T>(payload: unknown, key: string): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (payload && typeof payload === "object" && Array.isArray((payload as Record<string, unknown>)[key])) {
    return (payload as Record<string, unknown>)[key] as T[];
  }
  return [];
}
