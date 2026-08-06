"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { Container } from "@/shared/ui/Container";
import { SectionHeading } from "@/shared/ui/SectionHeading";

import { type BlogCategory, type BlogPost, localize, PostCard } from "@/entities/blog";

import { useLocaleCurrency } from "@/features/locale-currency";

interface BlogCategoryListingProps {
  category: BlogCategory;
  posts: BlogPost[];
}

export function BlogCategoryListing({ category, posts }: BlogCategoryListingProps) {
  const { locale, t } = useLocaleCurrency();
  const name = localize(category.name, locale);

  return (
    <article className="py-16">
      <Container className="flex flex-col gap-12">
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link href="/blogs/journal" className="hover:text-foreground">
            {t("blog_eyebrow")}
          </Link>
          <ChevronRight size={12} />
          <span className="text-foreground">{name}</span>
        </nav>

        <SectionHeading eyebrow={t("blog_eyebrow")} title={name} description={localize(category.description, locale)} />

        {posts.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} categoryName={name} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">{t("blog_no_guides")}</p>
        )}
      </Container>
    </article>
  );
}
