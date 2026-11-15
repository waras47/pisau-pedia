"use client";

import { useEffect, useRef, useState } from "react";

import { getInstagramEmbedUrl } from "@/shared/lib/instagram";
import { cn } from "@/shared/lib/utils";

interface InstagramEmbedProps {
  /** Instagram post/reel link; renders nothing if it isn't one. */
  url: string | null | undefined;
  title: string;
  className?: string;
}

const INITIAL_HEIGHT = 520;

/**
 * Instagram's official post embed. The iframe reports its content height via
 * postMessage ({ type: "MEASURE", details: { height } }) — the same signal
 * Instagram's own embed.js uses — so the frame fits the post without
 * loading that script.
 */
export function InstagramEmbed({ url, title, className }: InstagramEmbedProps) {
  const src = getInstagramEmbedUrl(url);
  const ref = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(INITIAL_HEIGHT);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin !== "https://www.instagram.com") return;
      if (event.source !== ref.current?.contentWindow) return;
      try {
        const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        const next = Number(data?.details?.height);
        if (data?.type === "MEASURE" && next > 0) setHeight(Math.ceil(next));
      } catch {
        // Not an Instagram measure message.
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  if (!src) return null;

  return (
    <iframe
      ref={ref}
      src={src}
      title={title}
      loading="lazy"
      scrolling="no"
      allow="encrypted-media"
      allowTransparency
      style={{ height }}
      className={cn("w-full overflow-hidden rounded-md border border-border bg-white", className)}
    />
  );
}
