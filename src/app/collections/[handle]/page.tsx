import { type Metadata } from "next";
import { notFound } from "next/navigation";

import { japaneseKnives } from "@/entities/product";
import { CollectionListing } from "@/widgets/collection-listing";

interface CollectionPageProps {
  params: { handle: string };
}

// "Database" koleksi sederhana. Nanti ganti dengan fetch ke CMS/API.
const collections = {
  "japanese-knives": {
    eyebrow: "Handcrafted in Japan",
    title: "Japanese Knives",
    description:
      "Traditional carbon and stainless blades, forged by independent makers and finished by hand.",
    products: japaneseKnives,
  },
} as const;

type CollectionHandle = keyof typeof collections;

export function generateMetadata({ params }: CollectionPageProps): Metadata {
  const collection = collections[params.handle as CollectionHandle];
  if (!collection) return { title: "Collection not found" };
  return {
    title: `${collection.title} — Kissaki Knives`,
    description: collection.description,
  };
}

export function generateStaticParams() {
  return Object.keys(collections).map((handle) => ({ handle }));
}

export default function CollectionPage({ params }: CollectionPageProps) {
  const collection = collections[params.handle as CollectionHandle];
  if (!collection) notFound();

  return (
    <CollectionListing
      eyebrow={collection.eyebrow}
      title={collection.title}
      description={collection.description}
      products={collection.products}
    />
  );
}
