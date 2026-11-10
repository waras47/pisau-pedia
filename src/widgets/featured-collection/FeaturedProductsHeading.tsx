"use client";

import { SectionHeading } from "@/shared/ui/SectionHeading";

import { useLocaleCurrency } from "@/features/locale-currency/model/LocaleProvider";

export function FeaturedProductsHeading() {
  const { t } = useLocaleCurrency();

  return <SectionHeading title={t("featured_products_title")} />;
}
