"use client";

import { HeadphonesIcon, RotateCcw, ShieldCheck, Truck } from "lucide-react";

import { useLocaleCurrency } from "@/features/locale-currency/model/LocaleProvider";
import { Container } from "@/shared/ui/Container";
import { SectionHeading } from "@/shared/ui/SectionHeading";
import type { DictionaryKey } from "@/shared/i18n/dictionaries";

const badges: { icon: typeof Truck; titleKey: DictionaryKey; descKey: DictionaryKey }[] = [
  { icon: Truck, titleKey: "trust_shipping_title", descKey: "trust_shipping_desc" },
  { icon: ShieldCheck, titleKey: "trust_duties_title", descKey: "trust_duties_desc" },
  { icon: RotateCcw, titleKey: "trust_returns_title", descKey: "trust_returns_desc" },
  { icon: HeadphonesIcon, titleKey: "trust_support_title", descKey: "trust_support_desc" },
];

export function TrustBadges() {
  const { t } = useLocaleCurrency();

  return (
    <section className="border-y border-border bg-surface py-16">
      <Container className="flex flex-col gap-10">
        <SectionHeading eyebrow={t("trust_eyebrow")} title={t("trust_title")} align="center" />
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {badges.map(({ icon: Icon, titleKey, descKey }) => (
            <div key={titleKey} className="flex flex-col items-center gap-3 text-center">
              <Icon size={26} className="text-accent" />
              <h3 className="font-display text-base font-semibold">{t(titleKey)}</h3>
              <p className="text-sm text-muted-foreground">{t(descKey)}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
