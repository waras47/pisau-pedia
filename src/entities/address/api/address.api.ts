import { apiFetch } from "@/shared/api/client";

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

export interface AddressInput {
  label?: string;
  full_name: string;
  phone?: string;
  address_line: string;
  city: string;
  province?: string;
  postal_code: string;
  is_default: boolean;
}

export function listMyAddresses() {
  return apiFetch<AddressApiItem[]>("/users/me/addresses");
}

export function createMyAddress(input: AddressInput) {
  return apiFetch<AddressApiItem>("/users/me/addresses", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateMyAddress(id: string, input: AddressInput) {
  return apiFetch<AddressApiItem>(`/users/me/addresses/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function deleteMyAddress(id: string) {
  return apiFetch<null>(`/users/me/addresses/${id}`, { method: "DELETE" });
}
