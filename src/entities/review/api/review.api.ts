import { env } from "@/shared/config/env";
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
  photos?: string[];
  status: ReviewStatus;
  created_at: string;
}

export interface CreateReviewInput {
  product_slug?: string;
  customer_name: string;
  customer_email?: string;
  rating: number;
  content: string;
  photos?: string[];
}

export interface AdminCreateReviewInput extends CreateReviewInput {
  status?: ReviewStatus;
}

export interface UpdateReviewInput {
  customer_name?: string;
  customer_email?: string;
  rating?: number;
  content?: string;
  status?: ReviewStatus;
}

// createReview hits the public review endpoint — new reviews start
// "pending" until an admin approves them (see admin/reviews).
export function createReview(input: CreateReviewInput) {
  return apiFetch<ReviewApiItem>("/reviews", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

// createReviewAdmin lets an admin insert a review directly (e.g. one
// collected offline) and pick its initial status instead of always
// starting "pending".
export function createReviewAdmin(input: AdminCreateReviewInput) {
  return apiFetch<ReviewApiItem>("/admin/reviews", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function listReviews(status?: string, productSlug?: string) {
  const params = new URLSearchParams({ per_page: "50" });
  if (status) params.set("status", status);
  if (productSlug) params.set("product_slug", productSlug);
  return apiFetch<ReviewApiItem[]>(`/admin/reviews?${params.toString()}`);
}

// listPublicReviews hits the public /reviews endpoint — always
// approved-only, no auth required. `scope` narrows to "product" (tied to
// an item someone bought) or "shop" (feedback about the store itself,
// not any one product) — omit it to get both.
export function listPublicReviews(perPage = 50, scope?: "product" | "shop") {
  const params = new URLSearchParams({ per_page: String(perPage) });
  if (scope) params.set("scope", scope);
  return apiFetch<ReviewApiItem[]>(`/reviews?${params.toString()}`);
}

// updateReview accepts any subset of fields — pass just `status` for a
// quick approve/reject, or the full set when editing content.
export function updateReview(id: string, input: UpdateReviewInput) {
  return apiFetch<ReviewApiItem>(`/admin/reviews/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function updateReviewStatus(id: string, status: ReviewStatus) {
  return updateReview(id, { status });
}

export function deleteReview(id: string) {
  return apiFetch<null>(`/admin/reviews/${id}`, { method: "DELETE" });
}

export async function uploadReviewPhoto(file: File): Promise<string> {
  const form = new FormData();
  form.append("image", file);
  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/reviews/upload-photo`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) throw new Error("Upload failed");
  const json = await res.json();
  return json.data.url;
}
