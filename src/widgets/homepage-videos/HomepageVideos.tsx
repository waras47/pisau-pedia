import { env } from "@/shared/config/env";
import { getYoutubeVideoId } from "@/shared/lib/youtube";
import { Container } from "@/shared/ui/Container";

import { type HomepageVideo,HomepageVideoGrid } from "./HomepageVideoGrid";

// Site content key edited in admin → Site Contents → "Video YouTube Beranda".
export const HOMEPAGE_VIDEOS_KEY = "homepage_videos";
const MAX_VIDEOS = 3;

async function getHomepageVideos(): Promise<HomepageVideo[]> {
  try {
    const res = await fetch(`${env.apiBaseUrl}/site-contents/${HOMEPAGE_VIDEOS_KEY}`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const json = await res.json();
    const items = json?.data?.value as HomepageVideo[] | undefined;
    if (!Array.isArray(items)) return [];
    // Empty or non-YouTube slots are skipped, so admins can fill 1–3 videos.
    return items.filter((v) => getYoutubeVideoId(v?.url)).slice(0, MAX_VIDEOS);
  } catch {
    return [];
  }
}

export async function HomepageVideos() {
  const videos = await getHomepageVideos();
  if (videos.length === 0) return null;

  return (
    // No bottom padding: CategoryBanners right below brings its own top padding.
    <section className="bg-surface pt-16">
      <Container>
        <HomepageVideoGrid videos={videos} />
      </Container>
    </section>
  );
}
