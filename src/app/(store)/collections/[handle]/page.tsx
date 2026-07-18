import { type Metadata } from "next";
import { notFound, redirect } from "next/navigation";

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

// "knives", "sharpening", and "accessories" are storefront-level groupings
// used in nav/footer/hero links — they don't map 1:1 to a single category
// row. Sharpening has no product category at all (it's a service, handled by
// /pages/sharpening-repairs), "accessories" is an English alias for the
// "aksesoris" category, and "knives" aggregates every knife-type category.
const KNIFE_TYPE_SLUGS = ["gyuto", "santoku", "bunka", "nakiri", "petty"];
const ACCESSORIES_CATEGORY_SLUG = "aksesoris";
const SHARPENING_REDIRECT = "/pages/sharpening-repairs";

function resolveCategorySlug(handle: string): string {
  return handle === "accessories" ? ACCESSORIES_CATEGORY_SLUG : handle;
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

async function getKnivesCollection(): Promise<ProductApiItem[]> {
  const results = await Promise.all(KNIFE_TYPE_SLUGS.map((slug) => getProductsInCategory(slug)));
  return results.flat();
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
  if (params.handle === "sharpening") return { title: "Sharpening & Repairs — Pisau Pedia" };
  if (params.handle === "knives") {
    return {
      title: "Japanese Knives — Pisau Pedia",
      description: "Semua tipe pisau dapur Jepang — Gyuto, Santoku, Bunka, Nakiri, dan Petty.",
    };
  }

  const category = await getCategory(resolveCategorySlug(params.handle));
  if (!category) return { title: "Collection not found" };
  return {
    title: `${category.name} — Pisau Pedia`,
    description: category.description,
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  if (params.handle === "sharpening") redirect(SHARPENING_REDIRECT);

  if (params.handle === "knives") {
    const products = await getKnivesCollection();
    return (
      <CollectionListing
        title="Japanese Knives"
        description="Semua tipe pisau dapur Jepang — Gyuto, Santoku, Bunka, Nakiri, dan Petty."
        products={products.map(toProduct)}
      />
    );
  }

  const slug = resolveCategorySlug(params.handle);
  const category = await getCategory(slug);
  if (!category) notFound();

  const products = await getProductsInCategory(slug);

  return (
    <CollectionListing
      title={category.name}
      description={category.description}
      products={products.map(toProduct)}
    />
  );
}
