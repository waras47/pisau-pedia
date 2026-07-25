import { type Metadata } from "next";
import { notFound } from "next/navigation";

import { categories, getCategoryBySlug, getPostsByCategory } from "@/entities/blog";

import { BlogCategoryListing } from "@/widgets/blog-category-listing";

interface CategoryPageProps {
  params: { category: string };
}

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export function generateMetadata({ params }: CategoryPageProps): Metadata {
  const category = getCategoryBySlug(params.category);
  if (!category) return { title: "Not found" };
  return {
    title: `${category.name} — Pisau Pedia`,
    description: category.description,
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = getCategoryBySlug(params.category);
  if (!category) notFound();

  const categoryPosts = getPostsByCategory(category.slug);

  return <BlogCategoryListing category={category} posts={categoryPosts} />;
}
