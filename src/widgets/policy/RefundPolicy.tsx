"use client";

import { useLocaleCurrency } from "@/features/locale-currency";

import { PolicyDocument } from "./PolicyDocument";
import { refundPolicyContent } from "./refund-policy.content";

export function RefundPolicy() {
  const { locale } = useLocaleCurrency();
  return <PolicyDocument content={refundPolicyContent[locale]} />;
}
