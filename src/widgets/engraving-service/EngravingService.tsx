"use client";

import { useState } from "react";

import { createServiceRequest } from "@/entities/service-request/api/service-request.api";
import { HttpError } from "@/shared/api/http-error";
import { Button } from "@/shared/ui/Button";
import { Container } from "@/shared/ui/Container";
import { useLocaleCurrency } from "@/features/locale-currency";

export function EngravingService() {
  const { t } = useLocaleCurrency();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const motifs = [
    { title: t("engrave_motif1_title"), description: t("engrave_motif1_desc") },
    { title: t("engrave_motif2_title"), description: t("engrave_motif2_desc") },
    { title: t("engrave_motif3_title"), description: t("engrave_motif3_desc") },
    { title: t("engrave_motif4_title"), description: t("engrave_motif4_desc") },
  ];

  const faqs = [
    { q: t("engrave_faq1_q"), a: t("engrave_faq1_a") },
    { q: t("engrave_faq2_q"), a: t("engrave_faq2_a") },
    { q: t("engrave_faq3_q"), a: t("engrave_faq3_a") },
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await createServiceRequest({
        type: "engraving",
        customer_name: formData.name,
        customer_email: formData.email,
        message: formData.message,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof HttpError ? err.message : t("engrave_form_error"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <section className="bg-surface py-16 sm:py-24">
        <Container className="flex flex-col items-center gap-6 text-center">
          <span className="font-accent text-base italic text-copper">{t("engrave_hero_eyebrow")}</span>
          <h1 className="max-w-3xl font-display text-4xl font-semibold tracking-tightest sm:text-5xl">
            {t("engrave_hero_title")}
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            {t("engrave_hero_desc")}
          </p>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <h2 className="mb-12 text-center font-display text-3xl font-semibold tracking-tightest sm:text-4xl">
            {t("engrave_motifs_title")}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {motifs.map((m) => (
              <div key={m.title} className="flex flex-col gap-2 border border-border bg-background p-6">
                <h3 className="font-display text-lg font-semibold">{m.title}</h3>
                <p className="text-sm text-muted-foreground">{m.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-surface py-16">
        <Container className="max-w-3xl">
          <h2 className="mb-12 text-center font-display text-3xl font-semibold tracking-tightest sm:text-4xl">
            {t("engrave_faq_title")}
          </h2>
          <div className="flex flex-col divide-y divide-border">
            {faqs.map((faq) => (
              <div key={faq.q} className="py-5">
                <h3 className="font-display text-sm font-semibold sm:text-base">{faq.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container className="max-w-2xl">
          <h2 className="mb-4 text-center font-display text-3xl font-semibold tracking-tightest sm:text-4xl">
            {t("engrave_form_title")}
          </h2>
          <p className="mb-10 text-center text-muted-foreground">
            {t("engrave_form_desc")}
          </p>

          {submitted ? (
            <div className="flex flex-col items-center gap-4 py-12 text-center">
              <h3 className="font-display text-xl font-semibold">{t("engrave_form_success_title")}</h3>
              <p className="text-muted-foreground">{t("engrave_form_success_desc")}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="name" className="text-xs font-semibold uppercase tracking-widest2 text-foreground">
                    {t("engrave_form_name")}
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                    placeholder={t("engrave_form_name_placeholder")}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-xs font-semibold uppercase tracking-widest2 text-foreground">
                    {t("engrave_form_email")}
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                    placeholder={t("engrave_form_email_placeholder")}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="message" className="text-xs font-semibold uppercase tracking-widest2 text-foreground">
                  {t("engrave_form_design")}
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                  placeholder={t("engrave_form_design_placeholder")}
                />
              </div>
              {error ? <p className="text-sm text-red-600">{error}</p> : null}
              <Button type="submit" className="self-start" disabled={submitting}>
                {submitting ? t("engrave_form_sending") : t("engrave_form_submit")}
              </Button>
            </form>
          )}
        </Container>
      </section>
    </>
  );
}
