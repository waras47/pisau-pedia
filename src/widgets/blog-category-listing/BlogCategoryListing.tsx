import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { Container } from "@/shared/ui/Container";
import { SectionHeading } from "@/shared/ui/SectionHeading";

import { type BlogCategory, type BlogPost, PostCard } from "@/entities/blog";

interface BlogCategoryListingProps {
  category: BlogCategory;
  posts: BlogPost[];
}

export function BlogCategoryListing({ category, posts }: BlogCategoryListingProps) {
  return (
    <article className="py-16">
      <Container className="flex flex-col gap-12">
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link href="/blogs/journal" className="hover:text-foreground">
            Learn
          </Link>
          <ChevronRight size={12} />
          <span className="text-foreground">{category.name}</span>
        </nav>

        <SectionHeading eyebrow="Learn" title={category.name} description={category.description} />

        {posts.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} categoryName={category.name} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No guides in this category yet.</p>
        )}
      </Container>
    </article>
  );
}
