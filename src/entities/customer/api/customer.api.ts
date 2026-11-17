import { apiFetch } from "@/shared/api/client";

export interface CustomerResponse {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  is_active: boolean;
  order_count: number;
  total_spent: number;
  created_at: string;
}

export interface AddressApiItem {
  id: string;
  label?: string;
  full_name: string;
  phone?: string;
  address_line: string;
  city: string;
  province?: string;
  postal_code: string;
  is_default: boolean;
}

export function listCustomers(search?: string) {
  const params = new URLSearchParams({ per_page: "50" });
  if (search) params.set("search", search);
  return apiFetch<CustomerResponse[]>(`/admin/customers?${params.toString()}`);
}

export function getCustomer(id: string) {
  return apiFetch<CustomerResponse>(`/admin/customers/${id}`);
}

export function getCustomerAddresses(id: string) {
  return apiFetch<AddressApiItem[]>(`/admin/customers/${id}/addresses`);
}

export function updateCustomerStatus(id: string, isActive: boolean) {
  return apiFetch<CustomerResponse>(`/admin/customers/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ is_active: isActive }),
  });
}
