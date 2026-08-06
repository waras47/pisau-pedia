"use client";

import Link from "next/link";

import { useLocaleCurrency } from "@/features/locale-currency/model/LocaleProvider";
import { Container } from "@/shared/ui/Container";
import { SectionHeading } from "@/shared/ui/SectionHeading";
import type { DictionaryKey } from "@/shared/i18n/dictionaries";

const categories: { titleKey: DictionaryKey; href: string; label: string; image: string }[] = [
  {
    titleKey: "browse_knives",
    href: "/collections/knives",
    label: "Knife collection",
    image: "/dev-images/products/aoi-gyuto-210.jpg",
  },
  {
    titleKey: "browse_sharpening",
    href: "/collections/sharpening",
    label: "Sharpening stones",
    image: "/dev-images/products/sharpening-stone.jpg",
  },
  {
    titleKey: "browse_accessories",
    href: "/collections/accessories",
    label: "Kitchen accessories",
    image: "/dev-images/products/magnetic-knife-holder-walnut.jpg",
  },
];

export function BrowseCategories() {
  const { t } = useLocaleCurrency();

  return (
    <section className="bg-surface py-16">
      <Container className="flex flex-col gap-10">
        <SectionHeading title={t("browse_title")} align="center" />
        <div className="grid gap-6 sm:grid-cols-3">
          {categories.map((category) => (
            <Link key={category.titleKey} href={category.href} className="group flex flex-col gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={category.image}
                alt={category.label}
                className="aspect-[4/3] w-full object-cover"
              />
              <span className="text-center font-display text-lg font-medium transition-colors group-hover:text-accent">
                {t(category.titleKey)}
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
