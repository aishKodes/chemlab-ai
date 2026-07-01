"use client";

import Link from "next/link";
import type { BackendNotification } from "@/lib/api/backendTypes";
import { cn } from "@/lib/utils";

export function NotificationItem({
  notification,
  onMarkRead,
}: {
  notification: BackendNotification;
  onMarkRead?: (id: number) => void;
}) {
  const content = (
    <div
      className={cn(
        "rounded-2xl border p-3 text-left transition",
        notification.read_at ? "border-slate-200 bg-white/70" : "border-blue-200 bg-blue-50",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-black text-slate-950">{notification.title}</p>
          <p className="mt-1 text-xs font-semibold leading-5 text-slate-600">{notification.body}</p>
        </div>
        {!notification.read_at ? <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-500" /> : null}
      </div>
      {!notification.read_at ? (
        <button
          type="button"
          className="mt-2 text-xs font-black text-blue-700 hover:text-blue-900"
          onClick={(event) => {
            event.preventDefault();
            onMarkRead?.(notification.id);
          }}
        >
          Mark read
        </button>
      ) : null}
    </div>
  );

  if (notification.action_url) {
    return (
      <Link href={notification.action_url} className="focus-ring block rounded-2xl">
        {content}
      </Link>
    );
  }

  return content;
}
