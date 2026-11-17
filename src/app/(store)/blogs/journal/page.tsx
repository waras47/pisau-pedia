import { type Metadata } from "next";

import {
  categories as staticCategories,
  posts as staticPosts,
  type BlogCategory,
  type BlogPost,
} from "@/entities/blog";
import { env } from "@/shared/config/env";

import { BlogIndex } from "@/widgets/blog-index";

export const metadata: Metadata = {
  title: "The Journal — Pisau Pedia",
  description: "Panduan seputar jenis pisau, pengasahan, dan perawatan baja dari Pisau Pedia.",
};

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

async function fetchData(): Promise<{ categories: BlogCategory[]; posts: BlogPost[] }> {
  try {
    const [catRes, postRes] = await Promise.all([
      fetch(`${env.apiBaseUrl}/post-categories`, { next: { revalidate: 60 } }),
      fetch(`${env.apiBaseUrl}/posts?per_page=50`, { next: { revalidate: 60 } }),
    ]);

    if (!catRes.ok || !postRes.ok) throw new Error("API error");

    const catJson = await catRes.json();
    const postJson = await postRes.json();

    const apiCategories: BlogCategory[] = (catJson.data ?? []).map(apiToCategory);
    const apiPosts: BlogPost[] = (postJson.data ?? []).map(apiToPost);

    if (apiPosts.length > 0) {
      return {
        categories: apiCategories.length > 0 ? apiCategories : staticCategories,
        posts: apiPosts,
      };
    }
  } catch {
    // fall through to static data
  }

  return { categories: staticCategories, posts: staticPosts };
}

export default async function JournalPage() {
  const { categories, posts } = await fetchData();
  return <BlogIndex categories={categories} posts={posts} />;
}
