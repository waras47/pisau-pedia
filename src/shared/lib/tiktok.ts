const TIKTOK_HOSTS = new Set(["tiktok.com", "www.tiktok.com", "m.tiktok.com"]);
const SHORT_HOSTS = new Set(["vm.tiktok.com", "vt.tiktok.com"]);
const VIDEO_ID = /^\d{15,25}$/;

function toUrl(input: string): URL | null {
  let raw = input.trim();
  if (!/^https?:\/\//i.test(raw)) raw = `https://${raw}`;
  try {
    return new URL(raw);
  } catch {
    return null;
  }
}

/**
 * Extracts the numeric video ID from a TikTok link —
 * tiktok.com/@user/video/<id>, /embed/v2/<id>, /player/v1/<id> — or from the
 * "Embed" snippet (data-video-id / cite). Returns null for anything else.
 */
export function getTiktokVideoId(input: string | null | undefined): string | null {
  if (!input) return null;
  const fromSnippet = input.match(/data-video-id=["'](\d{15,25})["']/i)?.[1];
  if (fromSnippet) return fromSnippet;
  const cite = input.match(/cite=["']([^"']+)["']/i)?.[1];

  const url = toUrl(cite ?? input);
  if (!url || !TIKTOK_HOSTS.has(url.hostname.toLowerCase())) return null;
  const parts = url.pathname.split("/").filter(Boolean);
  const i = parts.findIndex((p) => p === "video" || p === "v2" || p === "v1");
  const id = i >= 0 ? parts[i + 1] : undefined;
  return id && VIDEO_ID.test(id) ? id : null;
}

/** Short share links (vm./vt.tiktok.com) hide the video ID behind a redirect. */
export function isTiktokShortLink(input: string | null | undefined): boolean {
  if (!input) return false;
  const url = toUrl(input);
  return !!url && SHORT_HOSTS.has(url.hostname.toLowerCase());
}
