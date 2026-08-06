"use client";

import Link from "next/link";

import { Container } from "@/shared/ui/Container";
import { SectionHeading } from "@/shared/ui/SectionHeading";

import { type BlogCategory, type BlogPost, localize, PostCard } from "@/entities/blog";

import { useLocaleCurrency } from "@/features/locale-currency";

interface BlogIndexProps {
  categories: BlogCategory[];
  posts: BlogPost[];
}

export function BlogIndex({ categories, posts }: BlogIndexProps) {
  const { locale, t } = useLocaleCurrency();
  const categoryName = (slug: string) => {
    const category = categories.find((c) => c.slug === slug);
    return category ? localize(category.name, locale) : slug;
  };

  return (
    <article className="py-16">
      <Container className="flex flex-col gap-16">
        <SectionHeading
          eyebrow={t("blog_eyebrow")}
          title={t("blog_journal_title")}
          description={t("blog_journal_description")}
        />

        <section className="grid gap-4 sm:grid-cols-3">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/blogs/${c.slug}`}
              className="group flex flex-col gap-2 border border-border p-6 transition-colors hover:border-accent"
            >
              <h3 className="font-display text-xl font-semibold text-foreground transition-colors group-hover:text-accent">
                {localize(c.name, locale)}
              </h3>
              <p className="text-sm text-muted-foreground">{localize(c.description, locale)}</p>
            </Link>
          ))}
        </section>

        <section className="flex flex-col gap-8">
          <SectionHeading title={t("blog_latest_guides")} />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} categoryName={categoryName(post.categorySlug)} />
            ))}
          </div>
        </section>
      </Container>
    </article>
  );
}
