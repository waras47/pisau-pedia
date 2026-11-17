"use client";

import { useLocaleCurrency } from "@/features/locale-currency";

import { PolicyDocument } from "./PolicyDocument";
import { privacyPolicyContent } from "./privacy-policy.content";

export function PrivacyPolicy() {
  const { locale } = useLocaleCurrency();
  return <PolicyDocument content={privacyPolicyContent[locale]} />;
}
