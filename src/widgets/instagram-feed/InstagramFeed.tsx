import { env } from "@/shared/config/env";
import { getInstagramEmbedUrl, getInstagramHandle } from "@/shared/lib/instagram";
import { Container } from "@/shared/ui/Container";

import { InstagramFeedContent } from "./InstagramFeedContent";

// Site content key edited in admin → Site Contents → "Instagram Beranda".
const INSTAGRAM_FEED_KEY = "instagram_feed";
const MAX_POSTS = 4;

interface InstagramFeedSetting {
  account?: string;
  posts?: string[];
}

async function getInstagramFeed(): Promise<{ handle: string; posts: string[] } | null> {
  try {
    const res = await fetch(`${env.apiBaseUrl}/site-contents/${INSTAGRAM_FEED_KEY}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    const value = json?.data?.value as InstagramFeedSetting | undefined;
    const handle = getInstagramHandle(value?.account);
    if (!handle) return null;
    const posts = (Array.isArray(value?.posts) ? value.posts : [])
      .filter((p) => getInstagramEmbedUrl(p))
      .slice(0, MAX_POSTS);
    return { handle, posts };
  } catch {
    return null;
  }
}

export async function InstagramFeed() {
  const feed = await getInstagramFeed();
  // Hidden until an account is saved in admin.
  if (!feed) return null;

  return (
    // No bottom padding: CategoryBanners right below brings its own top padding.
    <section className="bg-surface pt-16">
      <Container>
        <InstagramFeedContent handle={feed.handle} posts={feed.posts} />
      </Container>
    </section>
  );
}
