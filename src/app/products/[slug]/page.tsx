import { type Metadata } from "next";
import { notFound } from "next/navigation";

import {
  allProducts,
  getProductBySlug,
  getRelatedProducts,
} from "@/entities/product";
import { ProductDetail } from "@/widgets/product-detail";

interface ProductPageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return allProducts.map((product) => ({ slug: product.slug }));
}

export function generateMetadata({ params }: ProductPageProps): Metadata {
  const product = getProductBySlug(params.slug);
  if (!product) return { title: "Product not found" };
  return {
    title: `${product.name} — Kissaki Knives`,
    description: product.description ?? product.category,
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

  const related = getRelatedProducts(product);

  return <ProductDetail product={product} related={related} />;
}
