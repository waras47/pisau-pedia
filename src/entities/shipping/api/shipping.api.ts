import { apiFetch } from "@/shared/api/client";

export interface ShippingDestination {
  id: number;
  label: string;
  province_name: string;
  city_name: string;
  district_name: string;
  subdistrict_name: string;
  zip_code: string;
}

export interface ShippingOption {
  name: string;
  code: string;
  service: string;
  description: string;
  cost: number;
  etd: string;
}

export interface ShippingCostItem {
  product_slug: string;
  quantity: number;
}

export function searchDestinations(search: string) {
  return apiFetch<ShippingDestination[]>(`/shipping/destinations?search=${encodeURIComponent(search)}`);
}

export function calculateShippingCost(destinationId: string, items: ShippingCostItem[]) {
  return apiFetch<ShippingOption[]>("/shipping/cost", {
    method: "POST",
    body: JSON.stringify({ destination_id: destinationId, items }),
  });
}
