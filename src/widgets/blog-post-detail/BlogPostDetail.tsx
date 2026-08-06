"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { Container } from "@/shared/ui/Container";
import { PlaceholderImage } from "@/shared/ui/PlaceholderImage";
import { SectionHeading } from "@/shared/ui/SectionHeading";

import { type BlogCategory, type BlogPost, localize, PostCard } from "@/entities/blog";

import { useLocaleCurrency } from "@/features/locale-currency";

interface BlogPostDetailProps {
  post: BlogPost;
  category: BlogCategory;
  related: BlogPost[];
}

export function BlogPostDetail({ post, category, related }: BlogPostDetailProps) {
  const { locale, t } = useLocaleCurrency();
  const categoryName = localize(category.name, locale);
  const title = localize(post.title, locale);
  const date = new Date(post.publishedAt).toLocaleDateString(locale === "id" ? "id-ID" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <article className="py-16">
      <Container className="flex flex-col gap-12">
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link href="/blogs/journal" className="hover:text-foreground">
            {t("blog_eyebrow")}
          </Link>
          <ChevronRight size={12} />
          <Link href={`/blogs/${category.slug}`} className="hover:text-foreground">
            {categoryName}
          </Link>
          <ChevronRight size={12} />
          <span className="text-foreground">{title}</span>
        </nav>

        <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
          <div className="flex flex-col gap-3">
            <span className="font-accent text-base italic text-copper">{categoryName}</span>
            <h1 className="font-display text-3xl font-semibold tracking-tightest sm:text-4xl">{title}</h1>
            <span className="text-xs text-muted-foreground">
              {date} · {post.readingMinutes} {t("blog_min_read")}
            </span>
          </div>

          {post.image ? (
            <div className="aspect-video w-full overflow-hidden bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.image} alt={title} className="h-full w-full object-cover" />
            </div>
          ) : (
            <PlaceholderImage label={categoryName} ratio="video" />
          )}

          <div className="flex flex-col gap-5">
            {post.content[locale].map((paragraph, i) => (
              <p key={i} className="text-foreground/90 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {related.length > 0 ? (
          <section className="flex flex-col gap-8">
            <SectionHeading title={t("blog_more_in_guide")} />
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <PostCard key={p.slug} post={p} categoryName={categoryName} />
              ))}
            </div>
          </section>
        ) : null}
      </Container>
    </article>
  );
}
