const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;
const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "music.youtube.com",
  "youtube-nocookie.com",
  "www.youtube-nocookie.com",
]);

/**
 * Extracts the 11-char video ID from whatever an admin pastes: a watch link,
 * youtu.be short link, /embed/, /shorts/ or /live/ URL, or the full
 * `<iframe src="…">` snippet from YouTube's "Embed" dialog. Returns null for
 * anything that isn't a YouTube video, so callers never embed a raw value.
 */
export function getYoutubeVideoId(input: string | null | undefined): string | null {
  if (!input) return null;
  let raw = input.trim();

  const iframeSrc = raw.match(/<iframe[^>]*\ssrc=["']([^"']+)["']/i);
  if (iframeSrc?.[1]) raw = iframeSrc[1];
  if (!/^https?:\/\//i.test(raw)) raw = `https://${raw}`;

  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }

  const host = url.hostname.toLowerCase();
  let id: string | null = null;

  if (host === "youtu.be") {
    id = url.pathname.split("/")[1] ?? null;
  } else if (YOUTUBE_HOSTS.has(host)) {
    const [, first, second] = url.pathname.split("/");
    if (first === "watch") id = url.searchParams.get("v");
    else if (first === "embed" || first === "shorts" || first === "live" || first === "v") id = second ?? null;
  }

  return id && YOUTUBE_ID.test(id) ? id : null;
}
