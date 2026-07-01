import { backendClient } from "@/lib/api/backendClient";
import type { BackendNotification, BackendUser } from "@/lib/api/backendTypes";

export const userApi = {
  getProfile: () => backendClient.get<{ user: BackendUser } | BackendUser>("/api/user/profile"),
  updateProfile: (payload: Partial<BackendUser>) =>
    backendClient.put<{ user: BackendUser } | BackendUser>("/api/user/profile", payload),
  getNotifications: () =>
    backendClient.get<{ notifications: BackendNotification[] } | BackendNotification[]>("/api/user/notifications"),
  markNotificationRead: (id: number | string) =>
    backendClient.post<{ read?: boolean }>(`/api/user/notifications/${id}/read`, {}),
};
