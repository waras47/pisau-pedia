"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { useLocaleCurrency } from "@/features/locale-currency/model/LocaleProvider";
import { Button } from "@/shared/ui/Button";
import { Container } from "@/shared/ui/Container";
import { env } from "@/shared/config/env";

interface ConfigBanner {
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  image: string;
}

export function ConfiguratorBanner() {
  const { t } = useLocaleCurrency();
  const [dynamic, setDynamic] = useState<ConfigBanner | null>(null);

  useEffect(() => {
    fetch(`${env.apiBaseUrl}/site-contents/configurator_banner`)
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        const val = json?.data?.value as ConfigBanner | undefined;
        if (val?.title) setDynamic(val);
      })
      .catch(() => {});
  }, []);

  const image = dynamic?.image || "/config-home.webp";
  const eyebrow = dynamic?.eyebrow || t("config_eyebrow");
  const title = dynamic?.title || t("config_title");
  const description = dynamic?.description || t("config_desc");
  const cta = dynamic?.cta || t("config_cta");

  return (
    <section className="bg-muted/40 py-16">
      <Container className="grid items-center gap-10 lg:grid-cols-2">
        <div className="overflow-hidden rounded-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt="Konfigurator pisau"
            className="aspect-[4/3] w-full object-cover"
          />
        </div>

        <div className="flex flex-col items-start gap-4">
          <span className="font-accent text-lg italic text-copper">
            {eyebrow}
          </span>
          <h2 className="font-display text-3xl font-semibold tracking-tightest sm:text-4xl">
            {title}
          </h2>
          <p className="max-w-md text-muted-foreground">
            {description}
          </p>
          <Link href="/pages/configurator">
            <Button size="lg" className="mt-2">
              {cta}
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}
