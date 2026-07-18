import { type Metadata } from "next";

import { categories, posts } from "@/entities/blog";

import { BlogIndex } from "@/widgets/blog-index";

export const metadata: Metadata = {
  title: "The Journal — Kissaki Knives",
  description: "Guides on knife types, sharpening, and steel care from Kissaki Knives.",
};

export default function JournalPage() {
  return <BlogIndex categories={categories} posts={posts} />;
}
