import { type MetadataRoute } from "next";

import { env } from "@/shared/config/env";
import { siteConfig } from "@/shared/config/site.config";

import { categories as blogCategories, posts as blogPosts } from "@/entities/blog/model/blog.data";
import { mainNav } from "@/entities/navigation/model/navigation.data";

// Static, always-known pages — safe even if the backend is unreachable
// during build (avoids failing the whole `next build`).
const STATIC_ROUTES = [
  "",
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

async function productSlugs(): Promise<string[]> {
  try {
    const res = await fetch(`${env.apiBaseUrl}/products?per_page=200`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    const items = (json.data ?? []) as Array<{ slug: string }>;
    return items.map((p) => p.slug);
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.siteUrl;
  const now = new Date();

  const entries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
  }));

  for (const handle of collectionHandlesFromNav()) {
    entries.push({ url: `${base}${handle}`, lastModified: now });
  }

  for (const category of blogCategories) {
    entries.push({ url: `${base}/blogs/${category.slug}`, lastModified: now });
  }
  for (const post of blogPosts) {
    entries.push({ url: `${base}/blogs/${post.categorySlug}/${post.slug}`, lastModified: now });
  }

  const slugs = await productSlugs();
  for (const slug of slugs) {
    entries.push({ url: `${base}/products/${slug}`, lastModified: now });
  }

  return entries;
}
