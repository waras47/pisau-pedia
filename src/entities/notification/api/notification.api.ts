import { apiFetch, apiFetchPaginated } from "@/shared/api/client";

export type NotificationModule = "product" | "order" | "customer" | "service";

export interface NotificationApiItem {
  id: string;
  module: NotificationModule;
  type: string;
  title: string;
  message: string;
  reference_id?: string;
  link?: string;
  is_read: boolean;
  created_at: string;
}

export interface ListNotificationsParams {
  page?: number;
  perPage?: number;
  unreadOnly?: boolean;
}

export interface ListNotificationsResult {
  items: NotificationApiItem[];
  meta: { page: number; per_page: number; total: number; total_pages: number };
}

export function listNotifications(params: ListNotificationsParams = {}): Promise<ListNotificationsResult> {
  const { page = 1, perPage = 20, unreadOnly } = params;
  const query = new URLSearchParams({ page: String(page), per_page: String(perPage) });
  if (unreadOnly) query.set("unread_only", "true");
  return apiFetchPaginated<NotificationApiItem[]>(`/admin/notifications?${query.toString()}`).then(
    ({ data, meta }) => ({ items: data, meta }),
  );
}

export function getUnreadCount() {
  return apiFetch<{ count: number }>("/admin/notifications/unread-count");
}

export function markAsRead(id: string) {
  return apiFetch<null>(`/admin/notifications/${id}/read`, { method: "PATCH" });
}

export function markAllAsRead() {
  return apiFetch<null>("/admin/notifications/read-all", { method: "PATCH" });
}
