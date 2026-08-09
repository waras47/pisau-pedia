"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { Container } from "@/shared/ui/Container";
import { env } from "@/shared/config/env";

import { useLocaleCurrency } from "@/features/locale-currency";

import { HeroImageSlider } from "./HeroImageSlider";

interface HeroText {
  eyebrow: string;
  title: string;
  subtitle: string;
  cta_primary: string;
  cta_secondary: string;
  footer: string;
}

export function Hero() {
  const { t } = useLocaleCurrency();
  const [custom, setCustom] = useState<HeroText | null>(null);

  useEffect(() => {
    fetch(`${env.apiBaseUrl}/site-contents/hero_text`)
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        const val = json?.data?.value as HeroText | undefined;
        if (val?.title) setCustom(val);
      })
      .catch(() => {});
  }, []);

  const eyebrow = custom?.eyebrow || t("hero_eyebrow");
  const title = custom?.title || t("hero_title");
  const subtitle = custom?.subtitle || t("hero_subtitle");
  const ctaPrimary = custom?.cta_primary || t("hero_cta_primary");
  const ctaSecondary = custom?.cta_secondary || t("hero_cta_secondary");
  const footer = custom?.footer || t("hero_footer");

  return (
    <section className="relative flex min-h-[80vh] items-center overflow-hidden bg-black lg:min-h-[640px]">
      <HeroImageSlider />

      <Container className="relative z-10 py-16 lg:py-20">
        <div className="flex max-w-xl flex-col gap-6 animate-fade-up">
          <span className="font-accent text-lg italic text-copper">
            {eyebrow}
          </span>
          <span className="h-px w-16 bg-gradient-to-r from-gold to-transparent" />
          <h1 className="font-display text-6xl font-semibold leading-[1.05] tracking-tightest text-white sm:text-7xl lg:text-8xl">
            {title}
          </h1>
          <p className="max-w-md text-white/75">{subtitle}</p>
          <div className="flex flex-wrap items-center gap-6 pt-2">
            <Link href="/collections/knives">
              <Button size="lg">{ctaPrimary}</Button>
            </Link>
            <Link
              href="/pages/configurator"
              className="inline-flex items-center gap-1.5 text-sm font-medium uppercase tracking-widest2 text-white transition-colors hover:text-copper"
            >
              {ctaSecondary}
              <ArrowRight size={14} />
            </Link>
          </div>

          <p className="text-xs uppercase tracking-widest2 text-white/60">
            {footer}
          </p>
        </div>
      </Container>
    </section>
  );
}
