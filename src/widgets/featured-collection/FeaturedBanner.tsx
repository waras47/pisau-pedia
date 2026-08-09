"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/shared/ui/Badge";

import { useLocaleCurrency } from "@/features/locale-currency";

export function FeaturedBanner() {
  const { t } = useLocaleCurrency();

  return (
    <div className="grid items-center gap-8 lg:grid-cols-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/products/kuro-bunka-190.jpg"
        alt={t("featured_title")}
        className="aspect-[4/3] w-full object-cover"
      />
      <div className="flex flex-col items-start gap-4">
        <Badge variant="copper">{t("featured_badge")}</Badge>
        <h2 className="font-display text-3xl font-semibold tracking-tightest sm:text-4xl">
          {t("featured_title")}
        </h2>
        <p className="max-w-md text-muted-foreground">{t("featured_desc")}</p>
        <Link
          href="/pages/configurator"
          className="inline-flex items-center gap-1.5 text-sm font-medium uppercase tracking-widest2 text-accent"
        >
          {t("featured_cta")}
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
