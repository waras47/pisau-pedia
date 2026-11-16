import { type MetadataRoute } from "next";

import { env } from "@/shared/config/env";
import { siteConfig } from "@/shared/config/site.config";

import { categories as blogCategories, posts as blogPosts } from "@/entities/blog/model/blog.data";
import { mainNav } from "@/entities/navigation/model/navigation.data";

// Static, always-known pages — safe even if the backend is unreachable
// during build (avoids failing the whole `next build`).
const STATIC_ROUTES = [
  "",
  "/policies/terms",
  "/policies/privacy",
  "/policies/refund",
  "/pages/about",
  "/pages/faq",
  "/pages/reviews",
  "/pages/sharpening-repairs",
  "/pages/engraving-request",
  "/pages/configurator",
  "/blogs/journal",
];

// Collection handles are already defined once in the mega-menu nav data —
// walk it instead of maintaining a second, easily-stale copy of the list.
function collectionHandlesFromNav(): string[] {
  const handles = new Set<string>();
  for (const item of mainNav) {
    if (item.href.startsWith("/collections/")) handles.add(item.href);
    for (const column of item.columns ?? []) {
      for (const link of column.links) {
        if (link.href.startsWith("/collections/")) handles.add(link.href);
      }
    }
  }
  return Array.from(handles);
}

// Dibuat saat diminta (bukan saat build): di CI backend tidak bisa diakses,
// sehingga sitemap hasil build dulu berisi 0 produk. Sekarang setiap
// permintaan /sitemap.xml membaca produk & artikel terbaru dari backend.
export const dynamic = "force-dynamic";

interface ApiList<T> {
  data?: T[];
  meta?: { page?: number; total_pages?: number };
}

async function fetchAll<T>(path: string, maxPages = 10): Promise<T[]> {
  const out: T[] = [];
  for (let page = 1; page <= maxPages; page++) {
    try {
      const sep = path.includes("?") ? "&" : "?";
      const res = await fetch(`${env.apiBaseUrl}${path}${sep}page=${page}`, { cache: "no-store" });
      if (!res.ok) break;
      const json = (await res.json()) as ApiList<T>;
      out.push(...(json.data ?? []));
      const totalPages = Number(json.meta?.total_pages ?? 1);
      if (page >= totalPages) break;
    } catch {
      break;
    }
  }
  return out;
}

const seg = (value: string) => encodeURIComponent(value);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.siteUrl;
  const now = new Date();
  const seen = new Set<string>();
  const entries: MetadataRoute.Sitemap = [];
  const add = (path: string, lastModified: Date = now) => {
    const url = `${base}${path}`;
    if (seen.has(url)) return;
    seen.add(url);
    entries.push({ url, lastModified });
  };

  for (const path of STATIC_ROUTES) add(path);
  for (const handle of collectionHandlesFromNav()) add(handle);

  // Artikel bawaan (data statis)
  for (const category of blogCategories) add(`/blogs/${seg(category.slug)}`);
  for (const post of blogPosts) add(`/blogs/${seg(post.categorySlug)}/${seg(post.slug)}`);

  const [products, postCategories, posts] = await Promise.all([
    fetchAll<{ slug: string }>("/products?per_page=100"),
    fetchAll<{ slug: string }>("/post-categories?per_page=100"),
    fetchAll<{ slug: string; category_slug: string; status?: string; published_at?: string | null; created_at?: string }>(
      "/posts?status=published&per_page=100",
    ),
  ]);

  for (const p of products) if (p.slug) add(`/products/${seg(p.slug)}`);

  // Kategori & artikel yang dibuat lewat admin
  for (const c of postCategories) if (c.slug) add(`/blogs/${seg(c.slug)}`);
  for (const post of posts) {
    if (!post.slug || !post.category_slug) continue;
    if (post.status && post.status !== "published") continue;
    const date = new Date(post.published_at ?? post.created_at ?? now);
    add(`/blogs/${seg(post.category_slug)}/${seg(post.slug)}`, isNaN(date.getTime()) ? now : date);
  }

  return entries;
}
