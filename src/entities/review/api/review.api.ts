import { apiFetch } from "@/shared/api/client";

export type ReviewStatus = "pending" | "approved" | "rejected";

export interface ReviewApiItem {
  id: string;
  product_name?: string;
  product_slug?: string;
  customer_name: string;
  customer_email?: string;
  rating: number;
  content: string;
  status: ReviewStatus;
  created_at: string;
}

export function listReviews(status?: string, productSlug?: string) {
  const params = new URLSearchParams({ per_page: "50" });
  if (status) params.set("status", status);
  if (productSlug) params.set("product_slug", productSlug);
  return apiFetch<ReviewApiItem[]>(`/admin/reviews?${params.toString()}`);
}

export function updateReviewStatus(id: string, status: ReviewStatus) {
  return apiFetch<ReviewApiItem>(`/admin/reviews/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export function deleteReview(id: string) {
  return apiFetch<null>(`/admin/reviews/${id}`, { method: "DELETE" });
}
