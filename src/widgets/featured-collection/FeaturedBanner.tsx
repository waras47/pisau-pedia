"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/shared/ui/Badge";
import { env } from "@/shared/config/env";

import { useLocaleCurrency } from "@/features/locale-currency";

interface FeaturedData {
  badge: string;
  title: string;
  description: string;
  cta: string;
  image: string;
}

export function FeaturedBanner() {
  const { t } = useLocaleCurrency();
  const [data, setData] = useState<FeaturedData | null>(null);

  useEffect(() => {
    fetch(`${env.apiBaseUrl}/site-contents/featured_banner`)
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        const val = json?.data?.value as FeaturedData | undefined;
        if (val?.title) setData(val);
      })
      .catch(() => {});
  }, []);

  const badge = data?.badge || t("featured_badge");
  const title = data?.title || t("featured_title");
  const description = data?.description || t("featured_desc");
  const cta = data?.cta || t("featured_cta");
  const image = data?.image;

  return (
    <div className="grid items-center gap-8 lg:grid-cols-2">
      {image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt={title}
          className="aspect-[4/3] w-full object-cover"
        />
      )}
      <div className="flex flex-col items-start gap-4">
        <Badge variant="copper">{badge}</Badge>
        <h2 className="font-display text-3xl font-semibold tracking-tightest sm:text-4xl">
          {title}
        </h2>
        <p className="max-w-md text-muted-foreground">{description}</p>
        <Link
          href="/pages/configurator"
          className="inline-flex items-center gap-1.5 text-sm font-medium uppercase tracking-widest2 text-accent"
        >
          {cta}
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
