"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { useLocaleCurrency } from "@/features/locale-currency/model/LocaleProvider";
import { Container } from "@/shared/ui/Container";
import type { DictionaryKey } from "@/shared/i18n/dictionaries";

const banners: {
  titleKey: DictionaryKey;
  descKey: DictionaryKey;
  ctaKey: DictionaryKey;
  href: string;
  label: string;
  image: string;
}[] = [
  {
    titleKey: "banner_sharpening_title",
    descKey: "banner_sharpening_desc",
    ctaKey: "banner_sharpening_cta",
    href: "/collections/sharpening",
    label: "Sharpening stone in use",
    image: "/images/products/sharpening-stone.jpg",
  },
  {
    titleKey: "banner_accessories_title",
    descKey: "banner_accessories_desc",
    ctaKey: "banner_accessories_cta",
    href: "/collections/accessories",
    label: "Kitchen accessories",
    image: "/images/products/hasegawa-cutting-board-m.jpg",
  },
];

export function CategoryBanners() {
  const { t } = useLocaleCurrency();

  return (
    <section className="bg-surface py-16">
      <Container className="grid gap-6 sm:grid-cols-2">
        {banners.map((banner) => (
          <Link
            key={banner.titleKey}
            href={banner.href}
            className="group relative flex flex-col justify-end overflow-hidden"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={banner.image}
              alt={banner.label}
              className="aspect-[4/3] w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/0 to-foreground/0" />
            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-6 text-background">
              <h3 className="font-display text-2xl font-semibold">{t(banner.titleKey)}</h3>
              <p className="max-w-xs text-sm text-background/85">
                {t(banner.descKey)}
              </p>
              <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest2">
                {t(banner.ctaKey)}
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-1"
                />
              </span>
            </div>
          </Link>
        ))}
      </Container>
    </section>
  );
}
