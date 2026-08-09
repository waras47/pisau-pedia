import { apiFetch, apiFetchPaginated } from "@/shared/api/client";
import { HttpError } from "@/shared/api/http-error";
import { env } from "@/shared/config/env";

import { orderStatusOptions } from "@/entities/order/model/order-status";

export interface CreateOrderItemInput {
  product_slug: string;
  quantity: number;
}

export interface CreateOrderInput {
  idempotency_key?: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  shipping_address: string;
  shipping_city: string;
  shipping_province?: string;
  shipping_postal_code: string;
  coupon_code?: string;
  destination_id?: string;
  courier?: string;
  service?: string;
  payment_type?: string;
  payment_channel?: string;
  items: CreateOrderItemInput[];
}

export interface OrderItemResponse {
  product_name: string;
  product_slug: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface OrderResponse {
  id: string;
  status: string;
  payment_status: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  shipping_address: string;
  shipping_city: string;
  shipping_province?: string;
  shipping_postal_code: string;
  subtotal: number;
  total: number;
  currency: string;
  discount_amount?: number;
  shipping_cost: number;
  shipping_courier?: string;
  shipping_service?: string;
  shipping_etd?: string;
  payment_type?: string;
  payment_channel?: string;
  payment_va_number?: string;
  payment_qr_string?: string;
  payment_url?: string;
  payment_expiry?: string;
  // Set once the customer uploads a receipt/screenshot at checkout-success —
  // part of the manual/static payment flow (no automated gateway).
  tracking_number?: string;
  shipping_evidence_url?: string;
  payment_proof_url?: string;
  invoice_url?: string;
  // Set once the customer self-confirms the package arrived — separate
  // from `status`, which stays under admin control. See
  // docs/16-plan-konfirmasi-pesanan-diterima-review.md (backend repo).
  customer_confirmed_at?: string;
  created_at: string;
  items?: OrderItemResponse[];
}

export function createOrder(input: CreateOrderInput) {
  return apiFetch<OrderResponse>("/orders", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

// getPublicOrder is used right after checkout (checkout/success) — the order
// might belong to a guest (no login), so this hits the public GET /orders/:id
// endpoint rather than the authenticated /users/me/orders/:id one below.
export function getPublicOrder(id: string) {
  return apiFetch<OrderResponse>(`/orders/${id}`);
}

// uploadPaymentProof lets a customer attach a receipt/screenshot to their own
// order at checkout-success. Public (no admin token) and multipart, so it
// bypasses apiFetch (which hardcodes a JSON Content-Type) the same way
// shared/api/upload.api.ts's admin uploadImage() does.
export async function uploadPaymentProof(orderId: string, file: File) {
  const form = new FormData();
  form.append("image", file);

  const res = await fetch(`${env.apiBaseUrl}/orders/${orderId}/payment-proof`, {
    method: "POST",
    body: form,
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) throw new HttpError(res.status, json?.message ?? "Upload failed");
  return json.data as OrderResponse;
}

// getMyOrders/getMyOrder/confirmOrderReceived are the customer-facing "my
// orders" endpoints — always the caller's own orders (enforced server-side
// by the access token), never guest orders. See
// docs/16-plan-konfirmasi-pesanan-diterima-review.md (backend repo).
export function getMyOrders(perPage = 50) {
  return apiFetch<OrderResponse[]>(`/users/me/orders?per_page=${perPage}`);
}

export function getMyOrder(id: string) {
  return apiFetch<OrderResponse>(`/users/me/orders/${id}`);
}

export function confirmOrderReceived(id: string) {
  return apiFetch<OrderResponse>(`/users/me/orders/${id}/confirm-received`, {
    method: "POST",
  });
}

export interface ListOrdersParams {
  status?: string;
  customerEmail?: string;
  search?: string;
  perPage?: number;
}

export function listOrders(params: ListOrdersParams = {}) {
  const { status, customerEmail, search, perPage = 50 } = params;
  const query = new URLSearchParams({ per_page: String(perPage) });
  if (status) query.set("status", status);
  if (customerEmail) query.set("customer_email", customerEmail);
  if (search) query.set("search", search);
  return apiFetch<OrderResponse[]>(`/admin/orders?${query.toString()}`);
}

export interface DailyRevenuePoint {
  date: string;
  revenue: number;
}

export interface TopProductPoint {
  product_name: string;
  quantity_sold: number;
  revenue: number;
}

export interface SalesReportData {
  from: string;
  to: string;
  total_revenue: number;
  total_orders: number;
  // How many of total_orders are actually paid — the subset that backs
  // total_revenue/daily_revenue/top_products, which are all paid-only.
  paid_orders: number;
  status_counts: Record<string, number>;
  daily_revenue: DailyRevenuePoint[];
  top_products: TopProductPoint[];
}

export function getSalesReport(from?: string, to?: string) {
  const query = new URLSearchParams();
  if (from) query.set("from", from);
  if (to) query.set("to", to);
  const qs = query.toString();
  return apiFetch<SalesReportData>(`/admin/reports/sales${qs ? `?${qs}` : ""}`);
}

// All-time count per order status — sales report's status_counts is scoped
// to a date range, which doesn't fit stat cards that must always be accurate.
export async function getOrderStatusCounts(): Promise<Record<string, number>> {
  const entries = await Promise.all(
    orderStatusOptions.map(async (o) => {
      const { meta } = await apiFetchPaginated<OrderResponse[]>(`/admin/orders?status=${o.value}&per_page=1`);
      return [o.value, meta.total] as const;
    }),
  );
  return Object.fromEntries(entries);
}

export function getOrder(id: string) {
  return apiFetch<OrderResponse>(`/admin/orders/${id}`);
}

export function updateOrderStatus(id: string, status: string, extra?: { tracking_number?: string; shipping_evidence_url?: string }) {
  return apiFetch<null>(`/admin/orders/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status, ...extra }),
  });
}

// checkPaymentStatus asks Komerce directly for the current payment status
// instead of waiting for the webhook — useful in local dev (Komerce can't
// reach a localhost webhook) or when a webhook delivery was missed.
export function checkPaymentStatus(id: string) {
  return apiFetch<OrderResponse>(`/admin/orders/${id}/check-payment-status`, {
    method: "POST",
  });
}

export function updatePaymentStatus(id: string, paymentStatus: string) {
  return apiFetch<null>(`/admin/orders/${id}/payment-status`, {
    method: "PATCH",
    body: JSON.stringify({ payment_status: paymentStatus }),
  });
}
