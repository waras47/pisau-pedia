import { apiFetch } from "@/shared/api/client";

export interface PaymentMethod {
  payment_type: string; // "va" | "qris"
  display_name: string;
  bank_code: string;
  logo_url: string;
  min_amount: number;
  max_amount: number;
}

export function getPaymentMethods() {
  return apiFetch<PaymentMethod[]>("/payment/methods");
}
