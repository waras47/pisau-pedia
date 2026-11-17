import { type Metadata } from "next";

import { env } from "@/shared/config/env";

import { type ReviewApiItem } from "@/entities/review/api/review.api";

import { Reviews } from "@/widgets/reviews";

export const metadata: Metadata = {
  title: "Customer Reviews — Pisau Pedia",
  description: "Real reviews from customers who bought our knives and accessories.",
};

async function getReviews(scope: "product" | "shop"): Promise<ReviewApiItem[]> {
  const res = await fetch(`${env.apiBaseUrl}/reviews?scope=${scope}&per_page=50`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  const json = await res.json();
  return json.data as ReviewApiItem[];
}

export default async function ReviewsPage() {
  const [productReviews, shopReviews] = await Promise.all([
    getReviews("product"),
    getReviews("shop"),
  ]);
  return <Reviews productReviews={productReviews} shopReviews={shopReviews} />;
}
