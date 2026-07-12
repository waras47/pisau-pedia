import { apiFetch } from "@/shared/api/client";

export type CouponApiType = "percentage" | "fixed" | "free_shipping";

export interface CouponApiItem {
  id: string;
  code: string;
  type: CouponApiType;
  value: number;
  min_order: number;
  max_uses?: number;
  used_count: number;
  starts_at?: string;
  ends_at?: string;
  is_active: boolean;
  description?: string;
}

export interface CouponInput {
  code: string;
  type: CouponApiType;
  value?: number;
  min_order?: number;
  max_uses?: number;
  starts_at?: string;
  ends_at?: string;
  is_active?: boolean;
  description?: string;
}

export function listCoupons() {
  return apiFetch<CouponApiItem[]>("/admin/coupons?per_page=100");
}

export function createCoupon(input: CouponInput) {
  return apiFetch<CouponApiItem>("/admin/coupons", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateCoupon(id: string, input: CouponInput) {
  return apiFetch<CouponApiItem>(`/admin/coupons/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function deleteCoupon(id: string) {
  return apiFetch<null>(`/admin/coupons/${id}`, { method: "DELETE" });
}

export interface ValidateCouponResult {
  valid: boolean;
  discount_amount: number;
  free_shipping: boolean;
  code: string;
}

export function validateCoupon(code: string, subtotal: number) {
  return apiFetch<ValidateCouponResult>("/coupons/validate", {
    method: "POST",
    body: JSON.stringify({ code, subtotal }),
  });
}
