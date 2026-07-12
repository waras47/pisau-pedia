"use client";

import { useState } from "react";

import { createServiceRequest } from "@/entities/service-request/api/service-request.api";
import { HttpError } from "@/shared/api/http-error";
import { Button } from "@/shared/ui/Button";
import { Container } from "@/shared/ui/Container";

const motifs = [
  { title: "Sakura", description: "Cherry blossom branch, hand-etched along the spine." },
  { title: "Mt. Fuji", description: "Minimalist mountain silhouette across the blade face." },
  { title: "Dragon", description: "Traditional Japanese dragon motif, full-blade coverage." },
  { title: "Kanji Name", description: "Your name or a chosen word rendered in kanji." },
];

const faqs = [
  {
    q: "Berapa lama proses engraving?",
    a: "Setelah desain disetujui, biasanya 2 hari kerja sebelum pisau dikirim balik.",
  },
  {
    q: "Bisa custom desain sendiri?",
    a: "Bisa — ceritakan desain/teks yang kamu mau di form di bawah, tim kami akan kirim preview digital dulu sebelum proses ukir.",
  },
  {
    q: "Berapa harganya?",
    a: "Harga tergantung kerumitan desain dan jenis pisau. Kirim detail lewat form, kami balas dengan penawaran harga dalam 1 hari kerja.",
  },
];

export function EngravingService() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      setError(err instanceof HttpError ? err.message : "Gagal mengirim request, coba lagi.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <section className="bg-surface py-16 sm:py-24">
        <Container className="flex flex-col items-center gap-6 text-center">
          <span className="font-accent text-base italic text-copper">Custom Engraving</span>
          <h1 className="max-w-3xl font-display text-4xl font-semibold tracking-tightest sm:text-5xl">
            Personalize Your Knife
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Kirim detail desain atau teks yang kamu inginkan — kami kirim preview
            digital dulu sebelum diukir ke bilah pisaumu.
          </p>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <h2 className="mb-12 text-center font-display text-3xl font-semibold tracking-tightest sm:text-4xl">
            Motif Populer
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
            FAQ
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
            Request a Quote
          </h2>
          <p className="mb-10 text-center text-muted-foreground">
            Ceritakan desain yang kamu mau, kami balas dengan penawaran harga
            dalam 1 hari kerja.
          </p>

          {submitted ? (
            <div className="flex flex-col items-center gap-4 py-12 text-center">
              <h3 className="font-display text-xl font-semibold">Request Received</h3>
              <p className="text-muted-foreground">
                Terima kasih! Tim kami akan review dan balas dalam 1 hari kerja.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="name" className="text-xs font-semibold uppercase tracking-widest2 text-foreground">
                    Nama
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                    placeholder="Nama kamu"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-xs font-semibold uppercase tracking-widest2 text-foreground">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="message" className="text-xs font-semibold uppercase tracking-widest2 text-foreground">
                  Detail Desain
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                  placeholder="Jenis pisau, teks/motif yang diinginkan, posisi ukiran, dll..."
                />
              </div>
              {error ? <p className="text-sm text-red-600">{error}</p> : null}
              <Button type="submit" className="self-start" disabled={submitting}>
                {submitting ? "Mengirim..." : "Send Request"}
              </Button>
            </form>
          )}
        </Container>
      </section>
    </>
  );
}
