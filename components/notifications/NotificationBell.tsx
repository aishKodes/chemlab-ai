"use client";

import { Bell } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { userApi } from "@/lib/api/userApi";
import type { BackendNotification } from "@/lib/api/backendTypes";
import { getReadableApiError } from "@/lib/api/apiErrors";
import { useAuth } from "@/components/auth/AuthProvider";
import { NotificationList } from "@/components/notifications/NotificationList";

function unwrapNotifications(payload: { notifications: BackendNotification[] } | BackendNotification[]) {
  return Array.isArray(payload) ? payload : payload.notifications;
}

export function NotificationBell() {
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<BackendNotification[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    let mounted = true;
    void (async () => {
      setLoading(true);
      try {
        const payload = await userApi.getNotifications();
        if (mounted) {
          setNotifications(unwrapNotifications(payload));
          setError(null);
        }
      } catch (caught) {
        if (mounted) setError(getReadableApiError(caught));
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [isAuthenticated]);

  const unreadCount = useMemo(() => notifications.filter((item) => !item.read_at).length, [notifications]);

  async function markRead(id: number) {
    setNotifications((items) =>
      items.map((item) => (item.id === id ? { ...item, read_at: item.read_at ?? new Date().toISOString() } : item)),
    );
    try {
      await userApi.markNotificationRead(id);
    } catch {
      // Optimistic read state is fine for Stage 2; the next fetch will reconcile.
    }
  }

  if (!isAuthenticated) return null;

  return (
    <div className="relative">
      <button
        type="button"
        className="focus-ring relative grid h-10 w-10 place-items-center rounded-2xl border border-blue-100 bg-white/85 text-blue-700 shadow-sm transition hover:bg-blue-50"
        aria-label="Open notifications"
        onClick={() => setOpen((current) => !current)}
      >
        <Bell className="h-5 w-5" aria-hidden="true" />
        {unreadCount ? (
          <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-rose-500 px-1 text-[0.65rem] font-black text-white">
            {unreadCount}
          </span>
        ) : null}
      </button>
      {open ? (
        <div className="absolute right-0 top-12 z-50 w-[min(22rem,calc(100vw-2rem))] rounded-[1.35rem] border border-blue-100 bg-white/96 p-3 shadow-2xl shadow-blue-950/12 backdrop-blur">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-black text-slate-950">Notifications</p>
            <button type="button" className="text-xs font-black text-blue-700" onClick={() => setOpen(false)}>
              Close
            </button>
          </div>
          <NotificationList notifications={notifications} loading={loading} error={error} onMarkRead={markRead} />
        </div>
      ) : null}
    </div>
  );
}
