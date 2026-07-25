"use client";

import Link from "next/link";

import { Button } from "@/shared/ui/Button";
import { Container } from "@/shared/ui/Container";
import { PlaceholderImage } from "@/shared/ui/PlaceholderImage";
import { SectionHeading } from "@/shared/ui/SectionHeading";

import { useLocaleCurrency } from "@/features/locale-currency";

export function About() {
  const { t } = useLocaleCurrency();

  const values = [
    { icon: <LeafIcon />, title: t("about_value1_title"), description: t("about_value1_desc") },
    { icon: <MapPinIcon />, title: t("about_value2_title"), description: t("about_value2_desc") },
    { icon: <HammerIcon />, title: t("about_value3_title"), description: t("about_value3_desc") },
    { icon: <HeartIcon />, title: t("about_value4_title"), description: t("about_value4_desc") },
  ];

  const services = [
    { number: "01", title: t("about_service1_title"), description: t("about_service1_desc") },
    { number: "02", title: t("about_service2_title"), description: t("about_service2_desc") },
    { number: "03", title: t("about_service3_title"), description: t("about_service3_desc") },
    { number: "04", title: t("about_service4_title"), description: t("about_service4_desc") },
  ];

  return (
    <>
      {/* Hero */}
      <section className="bg-surface py-16 sm:py-24">
        <Container className="flex flex-col items-center gap-6 text-center">
          <span className="font-accent text-base italic text-copper">{t("about_hero_eyebrow")}</span>
          <h1 className="max-w-3xl font-display text-4xl font-semibold tracking-tightest sm:text-5xl lg:text-6xl">
            {t("about_hero_title")}
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">{t("about_hero_subtitle")}</p>
        </Container>
      </section>

      {/* Story */}
      <section className="py-16">
        <Container className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="flex flex-col gap-5">
            <SectionHeading eyebrow={t("about_story_eyebrow")} title={t("about_story_title")} />
            <p className="text-muted-foreground">{t("about_story_p1")}</p>
            <p className="text-muted-foreground">{t("about_story_p2")}</p>
          </div>
          <div className="aspect-square w-full overflow-hidden bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/dev-images/image_about_us.webp"
              alt={t("about_story_image_label")}
              className="h-full w-full object-cover"
            />
          </div>
        </Container>
      </section>

      {/* Values */}
      <section className="bg-surface py-16">
        <Container className="flex flex-col gap-12">
          <SectionHeading
            align="center"
            eyebrow={t("about_values_eyebrow")}
            title={t("about_values_title")}
            className="mx-auto"
          />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="flex flex-col gap-3">
                <span className="text-copper">{v.icon}</span>
                <h3 className="font-display text-lg font-semibold">{v.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Services */}
      <section className="py-16">
        <Container>
          <SectionHeading
            align="center"
            eyebrow={t("about_services_eyebrow")}
            title={t("about_services_title")}
            className="mx-auto mb-12"
          />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <div key={s.number} className="flex flex-col gap-2 border-t-2 border-copper pt-4">
                <span className="font-display text-2xl font-bold text-copper">{s.number}</span>
                <h3 className="font-display text-base font-semibold">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Process gallery */}
      <section className="bg-surface py-16">
        <Container className="flex flex-col gap-10">
          <SectionHeading
            align="center"
            eyebrow={t("about_gallery_eyebrow")}
            title={t("about_gallery_title")}
            className="mx-auto"
          />
          <div className="grid gap-6 sm:grid-cols-3">
            <PlaceholderImage label={t("about_gallery1_label")} ratio="portrait" />
            <PlaceholderImage label={t("about_gallery2_label")} ratio="portrait" />
            <PlaceholderImage label={t("about_gallery3_label")} ratio="portrait" />
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-16">
        <Container className="flex flex-col items-center gap-6 text-center">
          <h2 className="font-display text-2xl font-semibold tracking-tightest sm:text-3xl">
            {t("about_cta_title")}
          </h2>
          <p className="max-w-xl text-muted-foreground">{t("about_cta_subtitle")}</p>
          <Link href="/collections/knives">
            <Button size="lg">{t("about_cta_button")}</Button>
          </Link>
        </Container>
      </section>
    </>
  );
}

function HammerIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 12-8.5 8.5a2.12 2.12 0 1 1-3-3L12 9" />
      <path d="M17.64 15 22 10.64" />
      <path d="m20.91 11.7-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86L16.01 4.6a5.56 5.56 0 0 0-3.94-1.64H9l.92.82A6.18 6.18 0 0 1 12 8.4v1.56l2 2h2.47l2.26 1.91" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function LeafIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}
