"use client";

import { useState } from "react";

import { Container } from "@/shared/ui/Container";
import { Button } from "@/shared/ui/Button";

const steps = [
  {
    number: "01",
    title: "Submit Your Request",
    description:
      "Fill out the contact form below with details about your knives — type, condition, and any specific issues. We'll reply within 1 business day with a quote.",
  },
  {
    number: "02",
    title: "Ship Your Knives",
    description:
      "Pack your knives securely and ship them to our workshop. We provide a prepaid shipping label for EU customers (minimum 3 knives per order).",
  },
  {
    number: "03",
    title: "We Sharpen & Repair",
    description:
      "Our craftsmen sharpen each blade by hand on Japanese whetstones, restoring the factory edge angle. Chipped blades are repaired on coarse stones before sharpening.",
  },
  {
    number: "04",
    title: "Receive Your Knives",
    description:
      "Your knives are carefully wrapped and shipped back with tracking. Typical turnaround: 6–8 business days from the moment we receive them.",
  },
];

const pricingTiers = [
  {
    service: "Standard Sharpening",
    description: "Restore a dull edge to factory sharpness on whetstones.",
    price: "€15",
    per: "per knife",
  },
  {
    service: "Chip Repair + Sharpening",
    description:
      "Remove chips up to 2 mm, re-profile the edge, then sharpen to a mirror finish.",
    price: "€25",
    per: "per knife",
  },
  {
    service: "Full Restoration",
    description:
      "Thinning, chip repair, re-profiling, and polishing. For badly worn or damaged blades.",
    price: "€40",
    per: "per knife",
  },
  {
    service: "Handle Replacement",
    description:
      "Replace a cracked or loose Japanese handle (wa-handle) with a new octagonal magnolia handle.",
    price: "€35",
    per: "per knife",
  },
];

const faqs = [
  {
    q: "Which knives do you accept?",
    a: "We sharpen all kitchen knives — Japanese, Western, and hybrid. We do not sharpen serrated knives, scissors, or garden tools.",
  },
  {
    q: "Is there a minimum order?",
    a: "Yes, we require a minimum of 3 knives per order to keep shipping costs reasonable.",
  },
  {
    q: "Do you ship outside the EU?",
    a: "Currently our mail-in service is available for EU customers only due to customs regulations on sharp objects.",
  },
  {
    q: "How should I pack my knives?",
    a: "Wrap each blade in cardboard or newspaper and secure with tape. Place wrapped knives in a sturdy box with padding. Never ship loose blades.",
  },
  {
    q: "What if my knife can't be repaired?",
    a: "If we determine a knife is beyond repair, we'll contact you before proceeding. You'll only be charged for work completed.",
  },
  {
    q: "How long does the service take?",
    a: "Typical turnaround is 6–8 business days from the moment we receive your knives, including return shipping.",
  },
];

export function SharpeningService() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      {/* Hero */}
      <section className="bg-surface py-16 sm:py-24">
        <Container className="flex flex-col items-center gap-6 text-center">
          <span className="font-accent text-base italic text-copper">
            Professional Mail-In Service
          </span>
          <h1 className="max-w-3xl font-display text-4xl font-semibold tracking-tightest sm:text-5xl lg:text-6xl">
            Knife Sharpening &amp; Repairs
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Send us your dull or damaged knives — we&apos;ll sharpen them by
            hand on Japanese whetstones and ship them back to you, sharper than
            new.
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <ClockIcon />
              6–8 business days
            </span>
            <span className="flex items-center gap-2">
              <TruckIcon />
              EU shipping included
            </span>
            <span className="flex items-center gap-2">
              <ShieldIcon />
              Satisfaction guaranteed
            </span>
          </div>
        </Container>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <Container>
          <h2 className="mb-12 text-center font-display text-3xl font-semibold tracking-tightest sm:text-4xl">
            How It Works
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
            Pricing
          </h2>
          <p className="mb-12 text-center text-muted-foreground">
            All prices include return shipping within the EU.
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
            Before &amp; After
          </h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              { label: "Chipped Gyuto", before: "Chipped blade edge", after: "Mirror-polished edge" },
              { label: "Dull Santoku", before: "Rounded, dull edge", after: "Razor-sharp 15° edge" },
              { label: "Worn Nakiri", before: "Scratched & uneven", after: "Thinned & restored" },
            ].map((item) => (
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
            Frequently Asked Questions
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
            Request a Quote
          </h2>
          <p className="mb-10 text-center text-muted-foreground">
            Tell us about your knives and we&apos;ll get back to you within 1
            business day.
          </p>

          {submitted ? (
            <div className="flex flex-col items-center gap-4 py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-copper/10">
                <CheckIcon />
              </div>
              <h3 className="font-display text-xl font-semibold">
                Request Received
              </h3>
              <p className="text-muted-foreground">
                Thank you! We&apos;ll review your request and reply within 1
                business day.
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
                    Name
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
                    placeholder="Your name"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="email"
                    className="text-xs font-semibold uppercase tracking-widest2 text-foreground"
                  >
                    Email
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
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="message"
                  className="text-xs font-semibold uppercase tracking-widest2 text-foreground"
                >
                  Message
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
                  placeholder="Describe your knives, their condition, and what service you need..."
                />
              </div>
              <Button type="submit" className="self-start">
                Send Request
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
