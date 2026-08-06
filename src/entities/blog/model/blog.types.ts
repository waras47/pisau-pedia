import { type Locale } from "@/shared/i18n/dictionaries";

export interface LocalizedText {
  id: string;
  en: string;
}

export function localize(value: LocalizedText, locale: Locale): string {
  return value[locale];
}

export interface BlogCategory {
  slug: string;
  name: LocalizedText;
  description: LocalizedText;
}

export interface BlogPost {
  slug: string;
  title: LocalizedText;
  excerpt: LocalizedText;
  categorySlug: string;
  readingMinutes: number;
  publishedAt: string; // ISO date
  content: { id: string[]; en: string[] }; // paragraphs
  image?: string;
}
