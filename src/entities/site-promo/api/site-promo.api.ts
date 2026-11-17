import { apiFetch } from "@/shared/api/client";

export interface SitePromoItem {
  id: string;
  title: string;
  description?: string;
  discount_percent: number;
  popup_image?: string;
  apply_to_all: boolean;
  product_ids: string[];
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SitePromoInput {
  title: string;
  description?: string;
  discount_percent: number;
  popup_image?: string;
  apply_to_all?: boolean;
  product_ids?: string[];
  start_date: string;
  end_date: string;
  is_active?: boolean;
}

export function listSitePromos() {
  return apiFetch<SitePromoItem[]>("/admin/site-promos");
}

export function getActiveSitePromo() {
  return apiFetch<SitePromoItem | null>("/site-promos/active");
}

export function createSitePromo(input: SitePromoInput) {
  return apiFetch<SitePromoItem>("/admin/site-promos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export function updateSitePromo(id: string, input: SitePromoInput) {
  return apiFetch<SitePromoItem>(`/admin/site-promos/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export function deleteSitePromo(id: string) {
  return apiFetch<void>(`/admin/site-promos/${id}`, { method: "DELETE" });
}
