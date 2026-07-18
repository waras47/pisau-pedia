import { apiFetch } from "@/shared/api/client";

export interface SearchProductResult {
  id: string;
  name: string;
  slug: string;
  price: number;
  image?: string;
}

export interface SearchCustomerResult {
  id: string;
  full_name: string;
  email: string;
}

export interface SearchOrderResult {
  id: string;
  status: string;
  customer_name: string;
  customer_email: string;
  total: number;
  created_at: string;
}

export interface GlobalSearchResult {
  products: SearchProductResult[];
  customers: SearchCustomerResult[];
  orders: SearchOrderResult[];
}

// Admin-only quick-jump search — a handful of matches per category, not a
// paginated results page (see SearchUsecase.GlobalSearch on the backend).
export function globalSearch(query: string) {
  return apiFetch<GlobalSearchResult>(`/admin/search?q=${encodeURIComponent(query)}`);
}
