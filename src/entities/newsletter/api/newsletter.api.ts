import { apiFetch, apiFetchPaginated, type ApiMeta } from "@/shared/api/client";

export type SubscriberSource = "checkout" | "footer" | "popup" | "blog" | "manual";
export type SubscriberStatus = "active" | "unsubscribed";

export interface SubscriberApiItem {
  id: string;
  email: string;
  name?: string;
  source: SubscriberSource;
  status: SubscriberStatus;
  created_at: string;
}

export function subscribeNewsletter(email: string, source: SubscriberSource = "footer", name?: string) {
  return apiFetch<SubscriberApiItem>("/newsletter/subscribe", {
    method: "POST",
    body: JSON.stringify({ email, name, source }),
  });
}

export interface ListSubscribersParams {
  page?: number;
  perPage?: number;
  status?: string;
  search?: string;
}

export interface ListSubscribersResult {
  items: SubscriberApiItem[];
  meta: ApiMeta;
}

export function listSubscribers(params: ListSubscribersParams = {}): Promise<ListSubscribersResult> {
  const { page = 1, perPage = 20, status, search } = params;
  const query = new URLSearchParams({ page: String(page), per_page: String(perPage) });
  if (status) query.set("status", status);
  if (search) query.set("search", search);
  return apiFetchPaginated<SubscriberApiItem[]>(`/admin/newsletter/subscribers?${query.toString()}`).then(
    ({ data, meta }) => ({ items: data, meta }),
  );
}

export function unsubscribeSubscriber(id: string) {
  return apiFetch<null>(`/admin/newsletter/subscribers/${id}/unsubscribe`, { method: "PATCH" });
}

export function deleteSubscriber(id: string) {
  return apiFetch<null>(`/admin/newsletter/subscribers/${id}`, { method: "DELETE" });
}
