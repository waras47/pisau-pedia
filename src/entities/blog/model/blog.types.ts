export interface BlogCategory {
  slug: string;
  name: string;
  description: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  categorySlug: string;
  readingMinutes: number;
  publishedAt: string; // ISO date
  content: string[]; // paragraphs
  image?: string;
}
