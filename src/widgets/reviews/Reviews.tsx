"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { Container } from "@/shared/ui/Container";
import { SectionHeading } from "@/shared/ui/SectionHeading";

import { RatingStars } from "@/entities/product/ui/RatingStars";
import { type ReviewApiItem } from "@/entities/review/api/review.api";

interface ReviewsProps {
  reviews: ReviewApiItem[];
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function Reviews({ reviews }: ReviewsProps) {
  const [filter, setFilter] = useState<number | null>(null);

  const averageRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const filtered = useMemo(
    () => (filter ? reviews.filter((r) => Math.round(r.rating) === filter) : reviews),
    [reviews, filter],
  );

  const countByStar = useMemo(() => {
    const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    for (const r of reviews) {
      const star = Math.min(5, Math.max(1, Math.round(r.rating)));
      counts[star] = (counts[star] ?? 0) + 1;
    }
    return counts;
  }, [reviews]);

  return (
    <section className="py-16">
      <Container className="flex flex-col gap-12">
        <SectionHeading
          align="center"
          eyebrow="What customers say"
          title="Customer Reviews"
          description={
            reviews.length
              ? `${averageRating.toFixed(1)} average rating from ${reviews.length} review${reviews.length === 1 ? "" : "s"}, across every knife and accessory we sell.`
              : "No reviews yet — be the first to leave one after your order arrives."
          }
          className="mx-auto"
        />

        {reviews.length ? (
          <>
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
                        <Link
                          href={`/products/${review.product_slug}`}
                          className="text-accent hover:underline"
                        >
                          {review.product_name}
                        </Link>
                      ) : null}
                    </div>
                    <span>{formatDate(review.created_at)}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : null}
      </Container>
    </section>
  );
}
