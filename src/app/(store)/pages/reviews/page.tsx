import { type Metadata } from "next";

import { env } from "@/shared/config/env";

import { type ReviewApiItem } from "@/entities/review/api/review.api";

import { Reviews } from "@/widgets/reviews";

export const metadata: Metadata = {
  title: "Customer Reviews — Kissaki Knives",
  description: "Real reviews from customers who bought our knives and accessories.",
};

async function getReviews(): Promise<ReviewApiItem[]> {
  const res = await fetch(`${env.apiBaseUrl}/reviews?per_page=50`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return [];
  const json = await res.json();
  return json.data as ReviewApiItem[];
}

export default async function ReviewsPage() {
  const reviews = await getReviews();
  return <Reviews reviews={reviews} />;
}
