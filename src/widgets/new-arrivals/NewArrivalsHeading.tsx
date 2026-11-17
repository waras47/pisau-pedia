"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { useLocaleCurrency } from "@/features/locale-currency/model/LocaleProvider";
import { SectionHeading } from "@/shared/ui/SectionHeading";

export function NewArrivalsHeading() {
  const { t } = useLocaleCurrency();

  return (
    <div className="flex items-end justify-between gap-4">
      <SectionHeading title={t("new_arrivals_title")} />
      <Link
        href="/collections/new-arrivals"
        className="hidden shrink-0 items-center gap-1.5 text-sm font-medium uppercase tracking-widest2 text-accent sm:inline-flex"
      >
        {t("new_arrivals_view_all")}
        <ArrowRight size={14} />
      </Link>
    </div>
  );
}
