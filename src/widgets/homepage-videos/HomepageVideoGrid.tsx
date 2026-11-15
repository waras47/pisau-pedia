"use client";

import { localized } from "@/shared/lib/localized";
import { YoutubeEmbed } from "@/shared/ui/YoutubeEmbed";

import { useLocaleCurrency } from "@/features/locale-currency/model/LocaleProvider";

export interface HomepageVideo {
  url: string;
  title?: string;
  title_id?: string;
  title_en?: string;
  [key: string]: string | undefined;
}

export function HomepageVideoGrid({ videos }: { videos: HomepageVideo[] }) {
  const { locale } = useLocaleCurrency();

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {videos.map((video, i) => {
        const title = localized(video, "title", locale);
        return (
          <figure key={`${video.url}-${i}`} className="flex flex-col gap-3">
            <YoutubeEmbed url={video.url} title={title || `Video Pisau Pedia ${i + 1}`} />
            {title ? (
              <figcaption className="font-display text-base font-medium">{title}</figcaption>
            ) : null}
          </figure>
        );
      })}
    </div>
  );
}
