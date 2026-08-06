import { type Metadata } from "next";
import { notFound } from "next/navigation";

import { getCategoryBySlug, getPostBySlug, getRelatedPosts, posts } from "@/entities/blog";

import { BlogPostDetail } from "@/widgets/blog-post-detail";

interface PostPageProps {
  params: { category: string; slug: string };
}

export function generateStaticParams() {
  return posts.map((p) => ({ category: p.categorySlug, slug: p.slug }));
}

export function generateMetadata({ params }: PostPageProps): Metadata {
  const post = getPostBySlug(params.slug);
  if (!post || post.categorySlug !== params.category) return { title: "Not found" };
  return {
    title: `${post.title.id} — Pisau Pedia`,
    description: post.excerpt.id,
  };
}

export default function PostPage({ params }: PostPageProps) {
  const post = getPostBySlug(params.slug);
  if (!post || post.categorySlug !== params.category) notFound();

  const category = getCategoryBySlug(post.categorySlug);
  if (!category) notFound();

  const related = getRelatedPosts(post);

  return <BlogPostDetail post={post} category={category} related={related} />;
}
