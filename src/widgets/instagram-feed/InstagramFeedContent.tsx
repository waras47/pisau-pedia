"use client";

import { Instagram } from "lucide-react";

import { instagramProfileUrl } from "@/shared/lib/instagram";
import { InstagramEmbed } from "@/shared/ui/InstagramEmbed";
import { SectionHeading } from "@/shared/ui/SectionHeading";

import { useLocaleCurrency } from "@/features/locale-currency/model/LocaleProvider";

interface InstagramFeedContentProps {
  handle: string;
  posts: string[];
}

export function InstagramFeedContent({ handle, posts }: InstagramFeedContentProps) {
  const { t } = useLocaleCurrency();
  const profileUrl = instagramProfileUrl(handle);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-end">
        <SectionHeading
          eyebrow={`@${handle}`}
          title={t("instagram_title")}
          description={t("instagram_desc")}
        />
        <a
          href={profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 bg-accent px-6 font-body text-sm font-medium uppercase tracking-widest2 text-accent-foreground transition-opacity hover:opacity-90"
        >
          <Instagram size={16} />
          {t("instagram_follow")}
        </a>
      </div>

      {posts.length > 0 ? (
        <div className="grid items-start gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {posts.map((post, i) => (
            <InstagramEmbed key={`${post}-${i}`} url={post} title={`Instagram @${handle} ${i + 1}`} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
