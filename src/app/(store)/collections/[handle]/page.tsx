import { type Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { env } from "@/shared/config/env";

import { type ProductApiItem } from "@/entities/product/api/product.api";
import { type Product } from "@/entities/product/model/product.types";

import { CollectionListing } from "@/widgets/collection-listing";

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
// /pages/sharpening-repairs), "accessories" aggregates the generic
// "aksesoris" bucket plus every accessory sub-category split out of it, and
// "knives" aggregates every knife-type category.
const KNIFE_TYPE_SLUGS = ["gyuto", "k-tip-gyuto", "slicer", "petty", "deba", "bunka", "yanagiba", "honesuki", "kiritsuke", "taiwan", "santoku", "nakiri"];
const ACCESSORY_SLUGS = [
  "aksesoris",
  "cutting-boards",
  "knife-bags",
  "knife-holders",
  "scissors",
  "peelers",
  "chopsticks",
];
const SHARPENING_REDIRECT = "/pages/sharpening-repairs";

// "By Usage" nav links (Multi-Purpose / Vegetable / Slicing) don't have their
// own DB category — a product only belongs to one category, so re-tagging
// e.g. Santoku knives as "multi-purpose" would remove them from the "By
// Type" nav that already works. Instead these aggregate over the existing
// shape categories that fit the usage, same pattern as KNIFE_TYPE_SLUGS.
interface CollectionApiItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
  categories: { id: string; slug: string }[];
}

async function getCollection(slug: string): Promise<CollectionApiItem | null> {
  const res = await fetch(`${env.apiBaseUrl}/collections/${slug}`, { cache: "no-store" });
  if (!res.ok) return null;
  const json = await res.json();
  return json.data as CollectionApiItem;
}

// "Bestsellers" / "New Arrivals" / "On Sale" aren't categories either — they
// read off existing product data (rating for bestsellers, the `badge` field
// for the other two) rather than a `category_id`.
const BADGE_VIEWS: Record<string, { title: string; description: string; badge: string }> = {
  "new-arrivals": {
    title: "New Arrivals",
    description: "The latest additions to the catalog.",
    badge: "new",
  },
  sale: {
    title: "On Sale",
    description: "Selected knives and accessories at a reduced price, while stock lasts.",
    badge: "sale",
  },
};

function resolveCategorySlug(handle: string): string {
  return handle === "accessories" ? "aksesoris" : handle;
}

async function getCategory(slug: string): Promise<CategoryApiItem | null> {
  const res = await fetch(`${env.apiBaseUrl}/categories/${slug}`, { cache: "no-store" });
  if (!res.ok) return null;
  const json = await res.json();
  return json.data as CategoryApiItem;
}

async function getProductsInCategory(slug: string): Promise<ProductApiItem[]> {
  const res = await fetch(`${env.apiBaseUrl}/products?category=${slug}&per_page=50`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  const json = await res.json();
  return json.data as ProductApiItem[];
}

async function getProductsInCategories(slugs: string[]): Promise<ProductApiItem[]> {
  const results = await Promise.all(slugs.map((slug) => getProductsInCategory(slug)));
  return results.flat();
}

async function getAllProducts(): Promise<ProductApiItem[]> {
  const res = await fetch(`${env.apiBaseUrl}/products?per_page=50`, { cache: "no-store" });
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
  if (params.handle === "sharpening") return { title: "Sharpening & Repairs — Pisau Pedia" };
  if (params.handle === "knives") {
    return {
      title: "Pisau Bergaya Jepang — Pisau Pedia",
      description: "Semua tipe pisau dapur Jepang buatan Pisau Pedia — Gyuto, K-Tip Gyuto, Slicer, Petty, Deba, Bunka, Yanagiba, Honesuki, Kiritsuke, dan lainnya.",
    };
  }
  if (params.handle === "accessories") {
    return {
      title: "Kitchen Accessories — Pisau Pedia",
      description: "Cutting boards, knife care, and kitchen tools that earn their keep.",
    };
  }
  const collection = await getCollection(params.handle);
  if (collection) {
    return { title: `${collection.name} — Pisau Pedia`, description: collection.description };
  }
  const badgeView = BADGE_VIEWS[params.handle];
  if (badgeView) {
    return { title: `${badgeView.title} — Pisau Pedia`, description: badgeView.description };
  }
  if (params.handle === "bestsellers") {
    return {
      title: "Bestsellers — Pisau Pedia",
      description: "Our most-loved knives and accessories, ranked by customer rating.",
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
    const products = await getProductsInCategories(KNIFE_TYPE_SLUGS);
    return (
      <CollectionListing
        title="Japanese Knives"
        description="Semua tipe pisau dapur Jepang — Gyuto, K-Tip Gyuto, Slicer, Deba, Bunka, Yanagiba, Honesuki, Kiritsuke, dan lainnya."
        products={products.map(toProduct)}
      />
    );
  }

  if (params.handle === "accessories") {
    const products = await getProductsInCategories(ACCESSORY_SLUGS);
    return (
      <CollectionListing
        title="Kitchen Accessories"
        description="Cutting boards, knife care, and kitchen tools that earn their keep."
        products={products.map(toProduct)}
      />
    );
  }

  const collectionData = await getCollection(params.handle);
  if (collectionData) {
    const slugs = collectionData.categories.map((c) => c.slug);
    const products = await getProductsInCategories(slugs);
    return (
      <CollectionListing
        title={collectionData.name}
        description={collectionData.description}
        products={products.map(toProduct)}
      />
    );
  }

  const badgeView = BADGE_VIEWS[params.handle];
  if (badgeView) {
    const products = (await getAllProducts()).filter((p) => p.badge === badgeView.badge);
    return (
      <CollectionListing
        title={badgeView.title}
        description={badgeView.description}
        products={products.map(toProduct)}
      />
    );
  }

  if (params.handle === "bestsellers") {
    const res = await fetch(`${env.apiBaseUrl}/products?per_page=50&sort=bestseller`, { cache: "no-store" });
    const products: ProductApiItem[] = res.ok ? (await res.json()).data : [];
    return (
      <CollectionListing
        title="Bestsellers"
        description="Produk terlaris berdasarkan jumlah penjualan."
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
