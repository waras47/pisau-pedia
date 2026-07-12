import { apiFetch, apiFetchPaginated } from "@/shared/api/client";

import { orderStatusOptions } from "@/entities/order/model/order-status";

export interface CreateOrderItemInput {
  product_slug: string;
  quantity: number;
}

export interface CreateOrderInput {
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
  invoice_url?: string;
  created_at: string;
  items?: OrderItemResponse[];
}

export function createOrder(input: CreateOrderInput) {
  return apiFetch<OrderResponse>("/orders", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export interface ListOrdersParams {
  status?: string;
  customerEmail?: string;
  perPage?: number;
}

export function listOrders(params: ListOrdersParams = {}) {
  const { status, customerEmail, perPage = 50 } = params;
  const query = new URLSearchParams({ per_page: String(perPage) });
  if (status) query.set("status", status);
  if (customerEmail) query.set("customer_email", customerEmail);
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

export function updateOrderStatus(id: string, status: string) {
  return apiFetch<null>(`/admin/orders/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export function updatePaymentStatus(id: string, paymentStatus: string) {
  return apiFetch<null>(`/admin/orders/${id}/payment-status`, {
    method: "PATCH",
    body: JSON.stringify({ payment_status: paymentStatus }),
  });
}
