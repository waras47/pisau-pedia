import { type Metadata } from "next";

import { env } from "@/shared/config/env";

import { type ProductApiItem } from "@/entities/product/api/product.api";
import { type Product } from "@/entities/product/model/product.types";

import { CollectionListing } from "@/widgets/collection-listing";

interface SearchPageProps {
  searchParams: { q?: string };
}

async function getSearchResults(query: string): Promise<ProductApiItem[]> {
  if (!query.trim()) return [];
  const res = await fetch(
    `${env.apiBaseUrl}/products?search=${encodeURIComponent(query)}&per_page=50`,
    { cache: "no-store" },
  );
  if (!res.ok) return [];
  const json = await res.json();
  return (json.data as ProductApiItem[]) ?? [];
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
    stock: p.stock,
    weight: p.weight,
    image: p.image,
  };
}

export function generateMetadata({ searchParams }: SearchPageProps): Metadata {
  const q = searchParams.q ?? "";
  return { title: q ? `Hasil pencarian "${q}" — Kissaki Knives` : "Cari — Kissaki Knives" };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const q = searchParams.q ?? "";
  const products = await getSearchResults(q);

  return (
    <CollectionListing
      title={q ? `Hasil pencarian untuk "${q}"` : "Cari produk"}
      description={
        q
          ? `${products.length} produk ditemukan.`
          : "Masukkan kata kunci pada kolom pencarian di atas."
      }
      products={products.map(toProduct)}
    />
  );
}
