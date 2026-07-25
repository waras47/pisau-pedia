import { type Metadata } from "next";

import { categories, posts } from "@/entities/blog";

import { BlogIndex } from "@/widgets/blog-index";

export const metadata: Metadata = {
  title: "The Journal — Pisau Pedia",
  description: "Panduan seputar jenis pisau, pengasahan, dan perawatan baja dari Pisau Pedia.",
};

export default function JournalPage() {
  return <BlogIndex categories={categories} posts={posts} />;
}
