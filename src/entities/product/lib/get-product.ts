import {
  accessories,
  engravings,
  featuredProducts,
  japaneseKnives,
  monthlyPick,
  newArrivals,
} from "@/entities/product/model/product.data";
import { type Product } from "@/entities/product/model/product.types";

/** Gabungan seluruh katalog. Nanti diganti query CMS/API by slug. */
export const allProducts: Product[] = [
  ...japaneseKnives,
  ...accessories,
  ...engravings,
  ...featuredProducts,
  ...newArrivals,
  monthlyPick,
];

export function getProductBySlug(slug: string): Product | undefined {
  return allProducts.find((product) => product.slug === slug);
}

/** Produk lain di kategori sama (untuk "You may also like"). */
export function getRelatedProducts(product: Product, limit = 4): Product[] {
  const seen = new Set<string>();
  return allProducts
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .filter((p) => (seen.has(p.slug) ? false : seen.add(p.slug)))
    .slice(0, limit);
}
