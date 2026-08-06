"use client";

import { useState } from "react";

import { createServiceRequest } from "@/entities/service-request/api/service-request.api";
import { HttpError } from "@/shared/api/http-error";
import { Container } from "@/shared/ui/Container";
import { Button } from "@/shared/ui/Button";
import { useLocaleCurrency } from "@/features/locale-currency";

export function SharpeningService() {
  const { t } = useLocaleCurrency();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const steps = [
    { number: "01", title: t("sharp_step1_title"), description: t("sharp_step1_desc") },
    { number: "02", title: t("sharp_step2_title"), description: t("sharp_step2_desc") },
    { number: "03", title: t("sharp_step3_title"), description: t("sharp_step3_desc") },
    { number: "04", title: t("sharp_step4_title"), description: t("sharp_step4_desc") },
  ];

  const pricingTiers = [
    { service: t("sharp_tier1_name"), description: t("sharp_tier1_desc"), price: t("sharp_tier1_price"), per: t("sharp_tier1_per") },
    { service: t("sharp_tier2_name"), description: t("sharp_tier2_desc"), price: t("sharp_tier2_price"), per: t("sharp_tier2_per") },
    { service: t("sharp_tier3_name"), description: t("sharp_tier3_desc"), price: t("sharp_tier3_price"), per: t("sharp_tier3_per") },
    { service: t("sharp_tier4_name"), description: t("sharp_tier4_desc"), price: t("sharp_tier4_price"), per: t("sharp_tier4_per") },
  ];

  const beforeAfter = [
    { label: t("sharp_ba1_label"), before: t("sharp_ba1_before"), after: t("sharp_ba1_after") },
    { label: t("sharp_ba2_label"), before: t("sharp_ba2_before"), after: t("sharp_ba2_after") },
    { label: t("sharp_ba3_label"), before: t("sharp_ba3_before"), after: t("sharp_ba3_after") },
  ];

  const faqs = [
    { q: t("sharp_faq1_q"), a: t("sharp_faq1_a") },
    { q: t("sharp_faq2_q"), a: t("sharp_faq2_a") },
    { q: t("sharp_faq3_q"), a: t("sharp_faq3_a") },
    { q: t("sharp_faq4_q"), a: t("sharp_faq4_a") },
    { q: t("sharp_faq5_q"), a: t("sharp_faq5_a") },
    { q: t("sharp_faq6_q"), a: t("sharp_faq6_a") },
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await createServiceRequest({
        type: "sharpening",
        customer_name: formData.name,
        customer_email: formData.email,
        message: formData.message,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof HttpError ? err.message : t("sharp_form_error"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-surface py-16 sm:py-24">
        <Container className="flex flex-col items-center gap-6 text-center">
          <span className="font-accent text-base italic text-copper">
            {t("sharp_hero_eyebrow")}
          </span>
          <h1 className="max-w-3xl font-display text-4xl font-semibold tracking-tightest sm:text-5xl lg:text-6xl">
            {t("sharp_hero_title")}
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            {t("sharp_hero_desc")}
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <ClockIcon />
              {t("sharp_turnaround")}
            </span>
            <span className="flex items-center gap-2">
              <TruckIcon />
              {t("sharp_shipping")}
            </span>
            <span className="flex items-center gap-2">
              <ShieldIcon />
              {t("sharp_guarantee")}
            </span>
          </div>
        </Container>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <Container>
          <h2 className="mb-12 text-center font-display text-3xl font-semibold tracking-tightest sm:text-4xl">
            {t("sharp_how_title")}
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div key={step.number} className="flex flex-col gap-3">
                <span className="font-display text-4xl font-bold text-copper/30">
                  {step.number}
                </span>
                <h3 className="font-display text-lg font-semibold">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Pricing */}
      <section className="bg-surface py-16">
        <Container>
          <h2 className="mb-4 text-center font-display text-3xl font-semibold tracking-tightest sm:text-4xl">
            {t("sharp_pricing_title")}
          </h2>
          <p className="mb-12 text-center text-muted-foreground">
            {t("sharp_pricing_note")}
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {pricingTiers.map((tier) => (
              <div
                key={tier.service}
                className="flex flex-col gap-4 border border-border bg-background p-6"
              >
                <h3 className="font-display text-lg font-semibold">
                  {tier.service}
                </h3>
                <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                  {tier.description}
                </p>
                <div className="border-t border-border pt-4">
                  <span className="font-display text-2xl font-bold text-copper">
                    {tier.price}
                  </span>
                  <span className="ml-1 text-sm text-muted-foreground">
                    {tier.per}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Before & After */}
      <section className="py-16">
        <Container>
          <h2 className="mb-12 text-center font-display text-3xl font-semibold tracking-tightest sm:text-4xl">
            {t("sharp_ba_title")}
          </h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {beforeAfter.map((item) => (
              <div key={item.label} className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex aspect-[4/3] items-center justify-center bg-muted text-xs text-muted-foreground">
                    Before
                  </div>
                  <div className="flex aspect-[4/3] items-center justify-center bg-copper/10 text-xs text-copper">
                    After
                  </div>
                </div>
                <div>
                  <h3 className="font-display text-sm font-semibold">
                    {item.label}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {item.before} → {item.after}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="bg-surface py-16">
        <Container className="max-w-3xl">
          <h2 className="mb-12 text-center font-display text-3xl font-semibold tracking-tightest sm:text-4xl">
            {t("sharp_faq_title")}
          </h2>
          <div className="flex flex-col divide-y divide-border">
            {faqs.map((faq, i) => (
              <div key={i} className="py-5">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between gap-4 text-left"
                >
                  <span className="font-display text-sm font-semibold text-foreground sm:text-base">
                    {faq.q}
                  </span>
                  <span className="shrink-0 text-muted-foreground">
                    {openFaq === i ? "−" : "+"}
                  </span>
                </button>
                {openFaq === i && (
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Contact Form */}
      <section className="py-16">
        <Container className="max-w-2xl">
          <h2 className="mb-4 text-center font-display text-3xl font-semibold tracking-tightest sm:text-4xl">
            {t("sharp_form_title")}
          </h2>
          <p className="mb-10 text-center text-muted-foreground">
            {t("sharp_form_desc")}
          </p>

          {submitted ? (
            <div className="flex flex-col items-center gap-4 py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-copper/10">
                <CheckIcon />
              </div>
              <h3 className="font-display text-xl font-semibold">
                {t("sharp_form_success_title")}
              </h3>
              <p className="text-muted-foreground">
                {t("sharp_form_success_desc")}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="name"
                    className="text-xs font-semibold uppercase tracking-widest2 text-foreground"
                  >
                    {t("sharp_form_name")}
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                    placeholder={t("sharp_form_name_placeholder")}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="email"
                    className="text-xs font-semibold uppercase tracking-widest2 text-foreground"
                  >
                    {t("sharp_form_email")}
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                    placeholder={t("sharp_form_email_placeholder")}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="message"
                  className="text-xs font-semibold uppercase tracking-widest2 text-foreground"
                >
                  {t("sharp_form_message")}
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                  placeholder={t("sharp_form_message_placeholder")}
                />
              </div>
              {error ? <p className="text-sm text-red-600">{error}</p> : null}
              <Button type="submit" className="self-start" disabled={submitting}>
                {submitting ? t("sharp_form_sending") : t("sharp_form_submit")}
              </Button>
            </form>
          )}
        </Container>
      </section>
    </>
  );
}

function ClockIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M15 18H9" />
      <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
      <circle cx="17" cy="18" r="2" />
      <circle cx="7" cy="18" r="2" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-copper">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
