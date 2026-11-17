"use client";

import Link from "next/link";

import { PlaceholderImage } from "@/shared/ui/PlaceholderImage";

import { type BlogPost,localize } from "@/entities/blog/model/blog.types";

import { useLocaleCurrency } from "@/features/locale-currency";

interface PostCardProps {
  post: BlogPost;
  categoryName: string;
  className?: string;
}

export function PostCard({ post, categoryName, className }: PostCardProps) {
  const { locale, t } = useLocaleCurrency();

  const date = new Date(post.publishedAt).toLocaleDateString(locale === "id" ? "id-ID" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <Link
      href={`/blogs/${post.categorySlug}/${post.slug}`}
      className={`group flex w-full flex-col gap-3 ${className ?? ""}`}
    >
      {post.image ? (
        <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
          {/* Editorial/process photos, not product shots — mixed source
              orientations (portrait + landscape), so object-cover (crop to
              fill) reads cleaner in a uniform grid than object-contain
              (which would letterbox the portrait ones heavily). */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.image}
            alt={localize(post.title, locale)}
            className="h-full w-full object-cover"
          />
        </div>
      ) : (
        <PlaceholderImage label={categoryName} ratio="landscape" />
      )}

      <div className="flex flex-col gap-1.5">
        <span className="font-accent text-sm italic text-copper">{categoryName}</span>
        <h3 className="font-display text-lg font-semibold leading-snug text-foreground transition-colors group-hover:text-accent">
          {localize(post.title, locale)}
        </h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{localize(post.excerpt, locale)}</p>
        <span className="text-xs text-muted-foreground">
          {date} · {post.readingMinutes} {t("blog_min_read")}
        </span>
      </div>
    </Link>
  );
}
