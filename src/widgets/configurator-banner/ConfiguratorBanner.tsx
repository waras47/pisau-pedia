"use client";

import Link from "next/link";

import { useLocaleCurrency } from "@/features/locale-currency/model/LocaleProvider";
import { Button } from "@/shared/ui/Button";
import { Container } from "@/shared/ui/Container";

export function ConfiguratorBanner() {
  const { t } = useLocaleCurrency();

  return (
    <section className="bg-muted/40 py-16">
      <Container className="grid items-center gap-10 lg:grid-cols-2">
        <div className="overflow-hidden rounded-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/config-home.webp"
            alt="Konfigurator pisau"
            className="aspect-[4/3] w-full object-cover"
          />
        </div>

        <div className="flex flex-col items-start gap-4">
          <span className="font-accent text-lg italic text-copper">
            {t("config_eyebrow")}
          </span>
          <h2 className="font-display text-3xl font-semibold tracking-tightest sm:text-4xl">
            {t("config_title")}
          </h2>
          <p className="max-w-md text-muted-foreground">
            {t("config_desc")}
          </p>
          <Link href="/pages/configurator">
            <Button size="lg" className="mt-2">
              {t("config_cta")}
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}
