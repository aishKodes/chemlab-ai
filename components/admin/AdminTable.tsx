"use client";

import type { ReactNode } from "react";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/admin/StatusBadge";

export type AdminColumn<T> = {
  key: keyof T | string;
  label: string;
  render?: (item: T) => ReactNode;
};

export function AdminTable<T extends { id?: number | string }>({
  items,
  columns,
  actions,
  emptyTitle = "No records yet",
}: {
  items: T[];
  columns: AdminColumn<T>[];
  actions?: (item: T) => ReactNode;
  emptyTitle?: string;
}) {
  if (!items.length) {
    return <EmptyState title={emptyTitle} description="Create a record or adjust filters when the backend is ready." />;
  }

  return (
    <div className="overflow-x-auto rounded-3xl border border-white/70 bg-white/80 shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
        <thead className="bg-slate-50/90 text-xs font-black uppercase tracking-wide text-slate-500">
          <tr>
            {columns.map((column) => (
              <th key={String(column.key)} className="px-4 py-3">
                {column.label}
              </th>
            ))}
            {actions ? <th className="px-4 py-3">Actions</th> : null}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {items.map((item, index) => (
            <tr key={String(item.id ?? index)} className="align-top">
              {columns.map((column) => (
                <td key={String(column.key)} className="max-w-[20rem] px-4 py-3 font-semibold text-slate-700">
                  {column.render ? column.render(item) : renderValue((item as Record<string, unknown>)[String(column.key)])}
                </td>
              ))}
              {actions ? <td className="px-4 py-3">{actions(item)}</td> : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function renderValue(value: unknown) {
  if (value === null || value === undefined || value === "") return <span className="text-slate-400">-</span>;
  if (typeof value === "string" && ["draft", "published", "archived", "active", "hidden", "pending", "blocked", "verified", "unverified"].includes(value)) {
    return <StatusBadge status={value} />;
  }
  if (typeof value === "object") return <code className="text-xs text-slate-500">{JSON.stringify(value)}</code>;
  return String(value);
}
