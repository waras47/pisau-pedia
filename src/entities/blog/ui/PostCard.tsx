import Link from "next/link";

import { PlaceholderImage } from "@/shared/ui/PlaceholderImage";

import { type BlogPost } from "@/entities/blog/model/blog.types";

interface PostCardProps {
  post: BlogPost;
  categoryName: string;
  className?: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

export function PostCard({ post, categoryName, className }: PostCardProps) {
  return (
    <Link
      href={`/blogs/${post.categorySlug}/${post.slug}`}
      className={`group flex w-full flex-col gap-3 ${className ?? ""}`}
    >
      {post.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.image} alt={post.title} className="aspect-[4/3] w-full object-cover" />
      ) : (
        <PlaceholderImage label={categoryName} ratio="landscape" />
      )}

      <div className="flex flex-col gap-1.5">
        <span className="font-accent text-sm italic text-copper">{categoryName}</span>
        <h3 className="font-display text-lg font-semibold leading-snug text-foreground transition-colors group-hover:text-accent">
          {post.title}
        </h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
        <span className="text-xs text-muted-foreground">
          {formatDate(post.publishedAt)} · {post.readingMinutes} min read
        </span>
      </div>
    </Link>
  );
}
