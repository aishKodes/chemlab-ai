"use client";

import { Bell } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingState } from "@/components/ui/LoadingState";
import { NotificationItem } from "@/components/notifications/NotificationItem";
import type { BackendNotification } from "@/lib/api/backendTypes";

export function NotificationList({
  notifications,
  loading,
  error,
  onMarkRead,
}: {
  notifications: BackendNotification[];
  loading?: boolean;
  error?: string | null;
  onMarkRead?: (id: number) => void;
}) {
  if (loading) return <LoadingState label="Checking notifications" />;
  if (error) {
    return (
      <EmptyState
        title="Notifications are resting"
        description={error}
        icon={<Bell className="h-5 w-5" aria-hidden="true" />}
      />
    );
  }
  if (!notifications.length) {
    return (
      <EmptyState
        title="No notifications yet"
        description="New quests, reminders, and teacher notes will appear here."
        icon={<Bell className="h-5 w-5" aria-hidden="true" />}
      />
    );
  }

  return (
    <div className="space-y-3">
      {notifications.map((notification) => (
        <NotificationItem key={notification.id} notification={notification} onMarkRead={onMarkRead} />
      ))}
    </div>
  );
}
