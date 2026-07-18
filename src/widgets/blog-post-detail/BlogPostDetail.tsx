import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { Container } from "@/shared/ui/Container";
import { PlaceholderImage } from "@/shared/ui/PlaceholderImage";
import { SectionHeading } from "@/shared/ui/SectionHeading";

import { type BlogCategory, type BlogPost, PostCard } from "@/entities/blog";

interface BlogPostDetailProps {
  post: BlogPost;
  category: BlogCategory;
  related: BlogPost[];
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
}

export function BlogPostDetail({ post, category, related }: BlogPostDetailProps) {
  return (
    <article className="py-16">
      <Container className="flex flex-col gap-12">
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link href="/blogs/journal" className="hover:text-foreground">
            Learn
          </Link>
          <ChevronRight size={12} />
          <Link href={`/blogs/${category.slug}`} className="hover:text-foreground">
            {category.name}
          </Link>
          <ChevronRight size={12} />
          <span className="text-foreground">{post.title}</span>
        </nav>

        <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
          <div className="flex flex-col gap-3">
            <span className="font-accent text-base italic text-copper">{category.name}</span>
            <h1 className="font-display text-3xl font-semibold tracking-tightest sm:text-4xl">{post.title}</h1>
            <span className="text-xs text-muted-foreground">
              {formatDate(post.publishedAt)} · {post.readingMinutes} min read
            </span>
          </div>

          {post.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.image} alt={post.title} className="aspect-[16/9] w-full object-cover" />
          ) : (
            <PlaceholderImage label={category.name} ratio="wide" />
          )}

          <div className="flex flex-col gap-5">
            {post.content.map((paragraph, i) => (
              <p key={i} className="text-foreground/90 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {related.length > 0 ? (
          <section className="flex flex-col gap-8">
            <SectionHeading title="More in this guide" />
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <PostCard key={p.slug} post={p} categoryName={category.name} />
              ))}
            </div>
          </section>
        ) : null}
      </Container>
    </article>
  );
}
