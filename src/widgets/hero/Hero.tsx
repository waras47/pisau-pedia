"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { Container } from "@/shared/ui/Container";

import { useLocaleCurrency } from "@/features/locale-currency";

import { HeroImageSlider } from "./HeroImageSlider";

export function Hero() {
  const { t } = useLocaleCurrency();

  return (
    <section className="relative flex min-h-[80vh] items-center overflow-hidden bg-black lg:min-h-[640px]">
      <HeroImageSlider />

      <Container className="relative z-10 py-16 lg:py-20">
        <div className="flex max-w-xl flex-col gap-6 animate-fade-up">
          <span className="font-accent text-lg italic text-copper">
            {t("hero_eyebrow")}
          </span>
          <span className="h-px w-16 bg-gradient-to-r from-gold to-transparent" />
          <h1 className="font-display text-6xl font-semibold leading-[1.05] tracking-tightest text-white sm:text-7xl lg:text-8xl">
            {t("hero_title")}
          </h1>
          <p className="max-w-md text-white/75">{t("hero_subtitle")}</p>
          <div className="flex flex-wrap items-center gap-6 pt-2">
            <Link href="/collections/knives">
              <Button size="lg">{t("hero_cta_primary")}</Button>
            </Link>
            <Link
              href="/pages/configurator"
              className="inline-flex items-center gap-1.5 text-sm font-medium uppercase tracking-widest2 text-white transition-colors hover:text-copper"
            >
              {t("hero_cta_secondary")}
              <ArrowRight size={14} />
            </Link>
          </div>

          <p className="text-xs uppercase tracking-widest2 text-white/60">
            {t("hero_footer")}
          </p>
        </div>
      </Container>
    </section>
  );
}
