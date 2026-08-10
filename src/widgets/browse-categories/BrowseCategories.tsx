"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { useLocaleCurrency } from "@/features/locale-currency/model/LocaleProvider";
import { Container } from "@/shared/ui/Container";
import { SectionHeading } from "@/shared/ui/SectionHeading";
import { env } from "@/shared/config/env";
import { localized } from "@/shared/lib/localized";

interface BrowseCategory {
  title: string;
  href: string;
  image: string;
  [key: string]: string;
}

export function BrowseCategories() {
  const { t, locale } = useLocaleCurrency();
  const [categories, setCategories] = useState<BrowseCategory[]>([]);

  useEffect(() => {
    fetch(`${env.apiBaseUrl}/site-contents/browse_categories`)
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        const items = json?.data?.value as BrowseCategory[] | undefined;
        if (items?.length) setCategories(items);
      })
      .catch(() => {});
  }, []);

  if (!categories.length) return null;

  return (
    <section className="bg-surface py-16">
      <Container className="flex flex-col gap-10">
        <SectionHeading title={t("browse_title")} align="center" />
        <div className="grid gap-6 sm:grid-cols-3">
          {categories.map((cat, i) => (
            <Link key={i} href={cat.href} className="group flex flex-col gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cat.image} alt={localized(cat, "title", locale)} className="aspect-[4/3] w-full object-cover" />
              <span className="text-center font-display text-lg font-medium transition-colors group-hover:text-accent">
                {localized(cat, "title", locale)}
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
