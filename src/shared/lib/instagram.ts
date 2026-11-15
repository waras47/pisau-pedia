const IG_HOSTS = new Set(["instagram.com", "www.instagram.com", "m.instagram.com"]);
const HANDLE = /^[A-Za-z0-9._]{1,30}$/;
const SHORTCODE = /^[A-Za-z0-9_-]{5,64}$/;
// Top-level paths that are Instagram pages, not account handles.
const RESERVED = new Set(["p", "reel", "reels", "tv", "explore", "stories", "accounts", "direct"]);

function toUrl(input: string): URL | null {
  let raw = input.trim();
  if (!/^https?:\/\//i.test(raw)) raw = `https://${raw}`;
  try {
    const url = new URL(raw);
    return IG_HOSTS.has(url.hostname.toLowerCase()) ? url : null;
  } catch {
    return null;
  }
}

/**
 * Normalises what an admin types for the account — "pisaupedia",
 * "@pisaupedia" or "https://instagram.com/pisaupedia/" — to the bare handle.
 */
export function getInstagramHandle(input: string | null | undefined): string | null {
  if (!input) return null;
  const trimmed = input.trim().replace(/^@/, "");
  if (HANDLE.test(trimmed)) return trimmed;
  const url = toUrl(trimmed);
  const first = url?.pathname.split("/")[1];
  return first && HANDLE.test(first) && !RESERVED.has(first.toLowerCase()) ? first : null;
}

export function instagramProfileUrl(handle: string): string {
  return `https://www.instagram.com/${handle}/`;
}

/**
 * Turns a post/reel link (or the "Embed" blockquote snippet) into Instagram's
 * official embed iframe URL. Returns null for anything else, so the raw
 * value is never placed in an iframe.
 */
export function getInstagramEmbedUrl(input: string | null | undefined): string | null {
  if (!input) return null;
  const permalink = input.match(/data-instgrm-permalink=["']([^"']+)["']/i)?.[1] ?? input;
  const url = toUrl(permalink);
  if (!url) return null;
  const parts = url.pathname.split("/").filter(Boolean);
  // Accept /p/CODE, /reel/CODE, /tv/CODE and /<handle>/p/CODE.
  const i = parts.findIndex((part) => part === "p" || part === "reel" || part === "tv");
  const code = i >= 0 ? parts[i + 1] : undefined;
  if (!code || !SHORTCODE.test(code)) return null;
  const kind = parts[i] === "reel" ? "reel" : "p";
  return `https://www.instagram.com/${kind}/${code}/embed/`;
}
