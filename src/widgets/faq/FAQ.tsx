"use client";

import { useState } from "react";
import Link from "next/link";

import { siteConfig } from "@/shared/config/site.config";
import { Container } from "@/shared/ui/Container";
import { SectionHeading } from "@/shared/ui/SectionHeading";

interface FaqItem {
  q: string;
  a: React.ReactNode;
}

interface FaqCategory {
  title: string;
  items: FaqItem[];
}

const categories: FaqCategory[] = [
  {
    title: "Ordering & Payment",
    items: [
      {
        q: "How do I place an order?",
        a: "Add a knife to your cart, then go to checkout. You can check out as a guest or create an account to track your order and save your shipping details for next time.",
      },
      {
        q: "What payment methods do you accept?",
        a: "Bank transfer to a range of Indonesian banks (BCA, BNI, Mandiri, Permata, and more) as well as QRIS — you'll see the full list of options at checkout.",
      },
      {
        q: "Can I change or cancel my order after placing it?",
        a: "Message us on WhatsApp as soon as possible — we can usually adjust or cancel an order before it ships. Once it&apos;s on its way, you&apos;ll need to wait for delivery and use our returns policy below instead.",
      },
    ],
  },
  {
    title: "Shipping & Delivery",
    items: [
      {
        q: "How much does shipping cost?",
        a: `Ongkir flat rate untuk sebagian besar pesanan, dan gratis ongkir untuk pesanan di atas Rp ${new Intl.NumberFormat("id-ID").format(siteConfig.freeShippingThreshold)}. Estimasi biaya dan waktu pengiriman akan ditampilkan saat checkout.`,
      },
      {
        q: "How long does delivery take?",
        a: "Most orders ship within 1–2 business days and arrive within 2–4 business days after that, depending on your location. You'll get a tracking link by email once your order is on its way.",
      },
      {
        q: "Do you ship internationally?",
        a: "Yes. We ship worldwide, and we cover import duties and fees on our end — the price you see at checkout is the price you pay, with no surprise charges on delivery.",
      },
    ],
  },
  {
    title: "Returns & Warranty",
    items: [
      {
        q: "What is your return policy?",
        a: "You have 30 days from delivery to return a knife in its original, unused condition for a full refund. No questions asked — just reach out to us and we'll send you instructions.",
      },
      {
        q: "What if my knife arrives damaged or faulty?",
        a: "Contact us on WhatsApp with a photo of the issue and your order number. We'll arrange a replacement or refund right away — you won't need to cover return shipping in that case.",
      },
      {
        q: "Do your knives come with a warranty?",
        a: "Every knife is covered against manufacturing defects for as long as you own it. Normal wear, chips from misuse, or rust from improper care aren't covered, but we're always happy to advise on repairs.",
      },
    ],
  },
  {
    title: "Caring for Your Knife",
    items: [
      {
        q: "How do I keep my knife sharp?",
        a: (
          <>
            Hone it with a ceramic or steel rod before each use, and have it professionally sharpened every few months depending on how often you cook. We offer a{" "}
            <Link href="/pages/sharpening-repairs" className="text-accent hover:underline">
              mail-in sharpening service
            </Link>{" "}
            if you&apos;d rather not sharpen it yourself.
          </>
        ),
      },
      {
        q: "Can I engrave a name or message on my knife?",
        a: (
          <>
            Yes — see our{" "}
            <Link href="/pages/engraving-request" className="text-accent hover:underline">
              engraving request page
            </Link>{" "}
            for details on custom engraving for new and existing knives.
          </>
        ),
      },
      {
        q: "Is it safe to wash my knife in the dishwasher?",
        a: "We don't recommend it. Hand wash with warm water and mild soap immediately after use, then dry it right away — especially for carbon steel blades, which can rust if left wet.",
      },
    ],
  },
  {
    title: "Account & Orders",
    items: [
      {
        q: "How do I track my order?",
        a: (
          <>
            Sign in and go to{" "}
            <Link href="/account/orders" className="text-accent hover:underline">
              My Orders
            </Link>{" "}
            to see the status of every order you&apos;ve placed, or use the tracking link from your shipping confirmation email.
          </>
        ),
      },
      {
        q: "How do I update my account details or saved addresses?",
        a: (
          <>
            Go to{" "}
            <Link href="/account/profile" className="text-accent hover:underline">
              Account Settings
            </Link>{" "}
            to update your name, email, or password, and{" "}
            <Link href="/account/addresses" className="text-accent hover:underline">
              My Addresses
            </Link>{" "}
            to manage your saved shipping addresses.
          </>
        ),
      },
    ],
  },
];

export function FAQ() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section className="py-16">
      <Container className="flex max-w-3xl flex-col gap-12">
        <SectionHeading
          align="center"
          eyebrow="Need help?"
          title="Frequently Asked Questions"
          description="Answers to the questions we hear most often. Still stuck? Message us on WhatsApp and we'll get back to you within a few hours."
          className="mx-auto"
        />

        <div className="flex flex-col gap-10">
          {categories.map((category) => (
            <div key={category.title} className="flex flex-col gap-2">
              <h2 className="font-display text-lg font-semibold tracking-tightest">
                {category.title}
              </h2>
              <div className="flex flex-col divide-y divide-border border-y border-border">
                {category.items.map((item) => {
                  const key = `${category.title}-${item.q}`;
                  const isOpen = open === key;
                  return (
                    <div key={key} className="py-5">
                      <button
                        type="button"
                        onClick={() => setOpen(isOpen ? null : key)}
                        className="flex w-full items-center justify-between gap-4 text-left"
                      >
                        <span className="font-display text-sm font-semibold text-foreground sm:text-base">
                          {item.q}
                        </span>
                        <span className="shrink-0 text-muted-foreground">
                          {isOpen ? "−" : "+"}
                        </span>
                      </button>
                      {isOpen ? (
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                          {item.a}
                        </p>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
