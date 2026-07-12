import { type Metadata } from "next";
import { notFound } from "next/navigation";

import { type ProductApiItem } from "@/entities/product/api/product.api";
import { type Product } from "@/entities/product/model/product.types";
import { CollectionListing } from "@/widgets/collection-listing";
import { env } from "@/shared/config/env";

interface CollectionPageProps {
  params: { handle: string };
}

interface CategoryApiItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
}

async function getCategory(slug: string): Promise<CategoryApiItem | null> {
  const res = await fetch(`${env.apiBaseUrl}/categories/${slug}`, { next: { revalidate: 60 } });
  if (!res.ok) return null;
  const json = await res.json();
  return json.data as CategoryApiItem;
}

async function getProductsInCategory(slug: string): Promise<ProductApiItem[]> {
  const res = await fetch(`${env.apiBaseUrl}/products?category=${slug}&per_page=50`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return [];
  const json = await res.json();
  return json.data as ProductApiItem[];
}

function toProduct(p: ProductApiItem): Product {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    category: p.category ?? "",
    price: p.price,
    compareAtPrice: p.compare_at_price,
    currency: p.currency,
    rating: p.rating,
    reviewCount: p.review_count,
    maker: p.maker,
    badge: p.badge as Product["badge"],
    image: p.image,
  };
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const category = await getCategory(params.handle);
  if (!category) return { title: "Collection not found" };
  return {
    title: `${category.name} — Kissaki Knives`,
    description: category.description,
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const category = await getCategory(params.handle);
  if (!category) notFound();

  const products = await getProductsInCategory(params.handle);

  return (
    <CollectionListing
      title={category.name}
      description={category.description}
      products={products.map(toProduct)}
    />
  );
}
