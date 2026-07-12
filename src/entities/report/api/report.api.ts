import { tokenStorage } from "@/entities/session/model/token-storage";
import { apiFetch } from "@/shared/api/client";
import { env } from "@/shared/config/env";
import { HttpError } from "@/shared/api/http-error";

export interface DailyRevenuePoint {
  date: string;
  revenue: number;
}

export interface TopProductPoint {
  product_name: string;
  quantity_sold: number;
  revenue: number;
}

export interface SalesReport {
  from: string;
  to: string;
  total_revenue: number;
  total_orders: number;
  status_counts: Record<string, number>;
  daily_revenue: DailyRevenuePoint[];
  top_products: TopProductPoint[];
}

export interface CategoryStock {
  category_name: string;
  product_count: number;
  total_stock: number;
}

export interface InventoryReport {
  total_products: number;
  total_stock_value: number;
  low_stock_count: number;
  out_of_stock_count: number;
  category_breakdown: CategoryStock[];
}

export function getSalesReport(from?: string, to?: string) {
  const params = new URLSearchParams();
  if (from) params.set("from", from);
  if (to) params.set("to", to);
  const qs = params.toString();
  return apiFetch<SalesReport>(`/admin/reports/sales${qs ? `?${qs}` : ""}`);
}

export function getInventoryReport() {
  return apiFetch<InventoryReport>("/admin/reports/inventory");
}

// Export endpoints need the Authorization header, so a plain <a href> can't
// trigger the download — fetch the file as a blob ourselves and hand the
// browser a temporary object URL to save instead.
async function downloadFile(path: string, fallbackFilename: string) {
  const accessToken = tokenStorage.getAccessToken();
  const res = await fetch(`${env.apiBaseUrl}${path}`, {
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
  });
  if (!res.ok) {
    const json = await res.json().catch(() => null);
    throw new HttpError(res.status, json?.message ?? "Gagal mengunduh laporan");
  }

  const disposition = res.headers.get("Content-Disposition") ?? "";
  const match = disposition.match(/filename="?([^"]+)"?/);
  const filename = match?.[1] ?? fallbackFilename;

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function exportSalesReport(format: "xlsx" | "pdf", from?: string, to?: string) {
  const params = new URLSearchParams({ format });
  if (from) params.set("from", from);
  if (to) params.set("to", to);
  return downloadFile(`/admin/reports/sales/export?${params.toString()}`, `sales-report.${format}`);
}

export function exportInventoryReport(format: "xlsx" | "pdf") {
  return downloadFile(`/admin/reports/inventory/export?format=${format}`, `inventory-report.${format}`);
}
