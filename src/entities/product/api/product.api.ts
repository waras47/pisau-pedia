import { apiFetch } from "@/shared/api/client";
import { env } from "@/shared/config/env";

export interface ProductApiItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  compare_at_price?: number;
  currency: string;
  maker?: string;
  badge?: string;
  category?: string;
  stock: number;
  weight: number;
  rating: number;
  review_count: number;
  image?: string;
}

export type ProductImageAngle = "front" | "back" | "side" | "top";

export interface ProductAngleImages {
  front?: string;
  back?: string;
  side?: string;
  top?: string;
}

export interface ProductApiDetail extends ProductApiItem {
  description?: string;
  description_en?: string;
  care_instructions?: string;
  images: string[];
  angle_images: ProductAngleImages;
  specs: { label: string; value: string }[];
  highlights: string[];
}

export interface ProductImageInput {
  url: string;
  angle?: ProductImageAngle;
}

export interface ProductInput {
  category_id?: string;
  name: string;
  slug?: string;
  description?: string;
  description_en?: string;
  care_instructions?: string;
  price: number;
  compare_at_price?: number;
  maker?: string;
  badge?: string;
  stock?: number;
  weight?: number;
  is_active?: boolean;
  images?: ProductImageInput[];
  specs?: { label: string; value: string }[];
  highlights?: string[];
}

export interface ListProductsParams {
  perPage?: number;
  sort?: string;
  search?: string;
}

export function listProducts(params: ListProductsParams = {}) {
  const { perPage = 50, sort, search } = params;
  const query = new URLSearchParams({ per_page: String(perPage) });
  if (sort) query.set("sort", sort);
  if (search) query.set("search", search);
  return apiFetch<ProductApiItem[]>(`/products?${query.toString()}`);
}

export interface ProductListByCategoryResult {
  items: ProductApiItem[];
  total: number;
}

// Uses a raw fetch (not apiFetch) because we need `meta.total` from the
// paginated envelope, which apiFetch discards.
export async function listProductsByCategory(
  categorySlug: string,
  perPage = 50,
): Promise<ProductListByCategoryResult> {
  const res = await fetch(
    `${env.apiBaseUrl}/products?category=${encodeURIComponent(categorySlug)}&per_page=${perPage}`,
  );
  const json = await res.json();
  if (!res.ok) throw new Error(json?.message ?? "Failed to fetch products");
  return { items: json.data as ProductApiItem[], total: json.meta?.total ?? json.data.length };
}

export function getProductBySlug(slug: string) {
  return apiFetch<ProductApiDetail>(`/products/${slug}`);
}

export function createProduct(input: ProductInput) {
  return apiFetch<ProductApiDetail>("/admin/products", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateProduct(id: string, input: Partial<ProductInput>) {
  return apiFetch<ProductApiDetail>(`/admin/products/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function deleteProduct(id: string) {
  return apiFetch<null>(`/admin/products/${id}`, { method: "DELETE" });
}

export interface CategoryStockPoint {
  category_name: string;
  product_count: number;
  total_stock: number;
}

export interface InventoryReportData {
  total_products: number;
  total_stock_value: number;
  low_stock_count: number;
  out_of_stock_count: number;
  category_breakdown: CategoryStockPoint[];
}

export function getInventoryReport() {
  return apiFetch<InventoryReportData>("/admin/reports/inventory");
}