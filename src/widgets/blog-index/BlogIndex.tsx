import Link from "next/link";

import { Container } from "@/shared/ui/Container";
import { SectionHeading } from "@/shared/ui/SectionHeading";

import { type BlogCategory, type BlogPost, PostCard } from "@/entities/blog";

interface BlogIndexProps {
  categories: BlogCategory[];
  posts: BlogPost[];
}

export function BlogIndex({ categories, posts }: BlogIndexProps) {
  const categoryName = (slug: string) => categories.find((c) => c.slug === slug)?.name ?? slug;

  return (
    <article className="py-16">
      <Container className="flex flex-col gap-16">
        <SectionHeading
          eyebrow="Learn"
          title="The Journal"
          description="Guides on knife types, sharpening, and steel care — written to help you get more out of the knives you already own."
        />

        <section className="grid gap-4 sm:grid-cols-3">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/blogs/${c.slug}`}
              className="group flex flex-col gap-2 border border-border p-6 transition-colors hover:border-accent"
            >
              <h3 className="font-display text-xl font-semibold text-foreground transition-colors group-hover:text-accent">
                {c.name}
              </h3>
              <p className="text-sm text-muted-foreground">{c.description}</p>
            </Link>
          ))}
        </section>

        <section className="flex flex-col gap-8">
          <SectionHeading title="Latest Guides" />
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
