import { type Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getCategoryBySlug,
  getPostBySlug,
  getRelatedPosts,
  type BlogCategory,
  type BlogPost,
} from "@/entities/blog";
import { env } from "@/shared/config/env";

import { BlogPostDetail } from "@/widgets/blog-post-detail";

interface PostPageProps {
  params: { category: string; slug: string };
}

interface ApiPost {
  slug: string;
  category_slug: string;
  category_name?: string;
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

interface ApiFetchResult {
  post: BlogPost;
  category: BlogCategory;
  related: BlogPost[];
}

async function fetchPostData(
  categorySlug: string,
  postSlug: string,
): Promise<ApiFetchResult | null> {
  try {
    const postRes = await fetch(`${env.apiBaseUrl}/posts/${postSlug}`, {
      next: { revalidate: 60 },
    });
    if (!postRes.ok) throw new Error("API error");
    const postJson = await postRes.json();
    const apiPost: ApiPost = postJson.data;

    if (apiPost.category_slug !== categorySlug) return null;

    const post = apiToPost(apiPost);

    // Fetch category
    const catRes = await fetch(`${env.apiBaseUrl}/post-categories/${categorySlug}`, {
      next: { revalidate: 60 },
    });
    if (!catRes.ok) throw new Error("API error");
    const catJson = await catRes.json();
    const category = apiToCategory(catJson.data);

    // Fetch related posts (same category, exclude current)
    const relatedRes = await fetch(
      `${env.apiBaseUrl}/posts?category=${categorySlug}&status=published&per_page=4`,
      { next: { revalidate: 60 } },
    );
    let related: BlogPost[] = [];
    if (relatedRes.ok) {
      const relatedJson = await relatedRes.json();
      related = (relatedJson.data ?? [])
        .map(apiToPost)
        .filter((p: BlogPost) => p.slug !== postSlug)
        .slice(0, 3);
    }

    return { post, category, related };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const apiResult = await fetchPostData(params.category, params.slug);
  const post = apiResult?.post ?? getPostBySlug(params.slug);
  if (!post || post.categorySlug !== params.category) return { title: "Not found" };
  return {
    title: `${post.title.id} — Pisau Pedia`,
    description: post.excerpt.id,
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const apiResult = await fetchPostData(params.category, params.slug);

  if (apiResult) {
    return (
      <BlogPostDetail
        post={apiResult.post}
        category={apiResult.category}
        related={apiResult.related}
      />
    );
  }

  // Fallback to static data
  const post = getPostBySlug(params.slug);
  if (!post || post.categorySlug !== params.category) notFound();

  const category = getCategoryBySlug(post.categorySlug);
  if (!category) notFound();

  const related = getRelatedPosts(post);
  return <BlogPostDetail post={post} category={category} related={related} />;
}
