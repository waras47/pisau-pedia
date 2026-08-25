"use client";

import { useLocaleCurrency } from "@/features/locale-currency";

import { PolicyDocument } from "./PolicyDocument";
import { termsOfServiceContent } from "./terms-of-service.content";

export function TermsOfService() {
  const { locale } = useLocaleCurrency();
  return <PolicyDocument content={termsOfServiceContent[locale]} />;
}
