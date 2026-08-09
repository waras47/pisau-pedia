import { type Metadata } from "next";
import { notFound } from "next/navigation";

import {
  categories as staticCategories,
  getCategoryBySlug,
  getPostsByCategory,
  type BlogCategory,
  type BlogPost,
} from "@/entities/blog";
import { env } from "@/shared/config/env";

import { BlogCategoryListing } from "@/widgets/blog-category-listing";

interface CategoryPageProps {
  params: { category: string };
}

interface ApiPost {
  slug: string;
  category_slug: string;
  title: { id: string; en: string };
  excerpt?: { id: string; en: string };
  content?: { id: string; en: string };
  image?: string;
  reading_minutes: number;
  published_at?: string | null;
  created_at: string;
}

interface ApiCategory {
  id: string;
  slug: string;
  name: { id: string; en: string };
  description: { id: string; en: string };
}

function apiToPost(p: ApiPost): BlogPost {
  return {
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt ?? { id: "", en: "" },
    categorySlug: p.category_slug,
    readingMinutes: p.reading_minutes,
    publishedAt: p.published_at ?? p.created_at,
    image: p.image,
    content: {
      id: (p.content?.id ?? "").split("\n\n").filter(Boolean),
      en: (p.content?.en ?? "").split("\n\n").filter(Boolean),
    },
  };
}

function apiToCategory(c: ApiCategory): BlogCategory {
  return { slug: c.slug, name: c.name, description: c.description };
}

async function fetchCategoryData(
  slug: string,
): Promise<{ category: BlogCategory; posts: BlogPost[] } | null> {
  try {
    const catRes = await fetch(`${env.apiBaseUrl}/post-categories/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!catRes.ok) throw new Error("API error");
    const catJson = await catRes.json();
    const category = apiToCategory(catJson.data);

    const postRes = await fetch(
      `${env.apiBaseUrl}/posts?category=${slug}&status=published&per_page=50`,
      { next: { revalidate: 60 } },
    );
    if (!postRes.ok) throw new Error("API error");
    const postJson = await postRes.json();
    const posts: BlogPost[] = (postJson.data ?? []).map(apiToPost);

    return { category, posts };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const apiResult = await fetchCategoryData(params.category);
  const category = apiResult?.category ?? getCategoryBySlug(params.category);
  if (!category) return { title: "Not found" };
  return {
    title: `${category.name.id} — Pisau Pedia`,
    description: category.description.id,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const apiResult = await fetchCategoryData(params.category);

  if (apiResult) {
    return <BlogCategoryListing category={apiResult.category} posts={apiResult.posts} />;
  }

  // Fallback to static data
  const category = getCategoryBySlug(params.category);
  if (!category) notFound();

  const categoryPosts = getPostsByCategory(category.slug);
  return <BlogCategoryListing category={category} posts={categoryPosts} />;
}
