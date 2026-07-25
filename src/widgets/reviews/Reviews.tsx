"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { HttpError } from "@/shared/api/http-error";
import { Button } from "@/shared/ui/Button";
import { Container } from "@/shared/ui/Container";
import { SectionHeading } from "@/shared/ui/SectionHeading";

import { RatingStars } from "@/entities/product/ui/RatingStars";
import { createReview, type ReviewApiItem } from "@/entities/review/api/review.api";

interface ReviewsProps {
  productReviews: ReviewApiItem[];
  shopReviews: ReviewApiItem[];
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function average(reviews: ReviewApiItem[]) {
  return reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
}

export function Reviews({ productReviews, shopReviews }: ReviewsProps) {
  const [tab, setTab] = useState<"product" | "shop">("product");
  const [formOpen, setFormOpen] = useState(false);

  const allReviews = useMemo(() => [...productReviews, ...shopReviews], [productReviews, shopReviews]);
  const overallAverage = average(allReviews);
  const activeReviews = tab === "product" ? productReviews : shopReviews;

  return (
    <section className="py-16">
      <Container className="flex flex-col gap-12">
        <SectionHeading
          align="center"
          eyebrow="What customers say"
          title="Customer Reviews"
          description={
            allReviews.length
              ? `${overallAverage.toFixed(1)} average rating from ${allReviews.length} review${allReviews.length === 1 ? "" : "s"} — from the products people bought and the experience of shopping with us.`
              : "No reviews yet — be the first to leave one."
          }
          className="mx-auto"
        />

        <div className="flex justify-center">
          <Button onClick={() => setFormOpen((o) => !o)}>
            {formOpen ? "Cancel" : "Write a Store Review"}
          </Button>
        </div>

        {formOpen ? <WriteReviewForm onDone={() => setFormOpen(false)} /> : null}

        <div className="flex justify-center gap-1 border-b border-border">
          <TabButton active={tab === "product"} onClick={() => setTab("product")}>
            Product Reviews ({productReviews.length})
          </TabButton>
          <TabButton active={tab === "shop"} onClick={() => setTab("shop")}>
            Shop Reviews ({shopReviews.length})
          </TabButton>
        </div>

        <ReviewList reviews={activeReviews} />
      </Container>
    </section>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`-mb-px border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
        active
          ? "border-foreground text-foreground"
          : "border-transparent text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function ReviewList({ reviews }: { reviews: ReviewApiItem[] }) {
  const [filter, setFilter] = useState<number | null>(null);

  const countByStar = useMemo(() => {
    const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    for (const r of reviews) {
      const star = Math.min(5, Math.max(1, Math.round(r.rating)));
      counts[star] = (counts[star] ?? 0) + 1;
    }
    return counts;
  }, [reviews]);

  const filtered = filter ? reviews.filter((r) => Math.round(r.rating) === filter) : reviews;

  if (!reviews.length) {
    return <p className="text-center text-muted-foreground">No reviews in this category yet.</p>;
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => setFilter(null)}
          className={`border px-4 py-2 text-sm font-medium uppercase tracking-widest2 transition-colors ${
            filter === null
              ? "border-foreground bg-foreground text-background"
              : "border-border text-foreground hover:bg-muted"
          }`}
        >
          All ({reviews.length})
        </button>
        {[5, 4, 3, 2, 1].map((star) =>
          countByStar[star] ? (
            <button
              key={star}
              type="button"
              onClick={() => setFilter(star)}
              className={`border px-4 py-2 text-sm font-medium uppercase tracking-widest2 transition-colors ${
                filter === star
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-foreground hover:bg-muted"
              }`}
            >
              {star}★ ({countByStar[star]})
            </button>
          ) : null,
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((review) => (
          <div key={review.id} className="flex h-full flex-col gap-4 border border-border bg-surface p-6">
            <RatingStars rating={review.rating} size={14} />
            <p className="flex-1 text-sm leading-relaxed text-foreground/90">
              &ldquo;{review.content}&rdquo;
            </p>
            <div className="flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
              <div className="flex flex-col gap-0.5">
                <span className="font-medium text-foreground">{review.customer_name}</span>
                {review.product_slug ? (
                  <Link href={`/products/${review.product_slug}`} className="text-accent hover:underline">
                    {review.product_name}
                  </Link>
                ) : null}
              </div>
              <span>{formatDate(review.created_at)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WriteReviewForm({ onDone }: { onDone: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await createReview({
        customer_name: name,
        customer_email: email || undefined,
        rating,
        content,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof HttpError ? err.message : "Failed to submit your review.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-2 border border-border bg-surface p-8 text-center">
        <p className="font-display text-lg font-semibold">Thank you!</p>
        <p className="text-sm text-muted-foreground">
          Your review has been submitted and will appear here once it&apos;s approved.
        </p>
        <button type="button" onClick={onDone} className="mt-2 text-sm text-accent hover:underline">
          Close
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full max-w-lg flex-col gap-4 border border-border bg-surface p-6"
    >
      <h3 className="font-display text-base font-semibold">Tell us about shopping with us</h3>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        minLength={2}
        placeholder="Your name"
        className="h-11 w-full border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email (opsional)"
        className="h-11 w-full border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
      />
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">Rating</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              aria-label={`${n} star${n === 1 ? "" : "s"}`}
              className={n <= rating ? "text-gold" : "text-border"}
            >
              ★
            </button>
          ))}
        </div>
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        minLength={5}
        rows={4}
        placeholder="How was shipping, packaging, and our support?"
        className="w-full border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
      />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button type="submit" disabled={loading}>
        {loading ? "Submitting…" : "Submit Review"}
      </Button>
    </form>
  );
}
