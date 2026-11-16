import { getTiktokVideoId } from "@/shared/lib/tiktok";
import { cn } from "@/shared/lib/utils";

interface TiktokEmbedProps {
  /** Any TikTok video link or embed snippet; renders nothing if it isn't one. */
  url: string | null | undefined;
  title: string;
  className?: string;
}

/** TikTok's official embed player (vertical 9:16), built from the video ID only. */
export function TiktokEmbed({ url, title, className }: TiktokEmbedProps) {
  const videoId = getTiktokVideoId(url);
  if (!videoId) return null;

  return (
    <div className={cn("relative aspect-[9/16] w-full max-w-[325px] overflow-hidden rounded-md bg-black", className)}>
      <iframe
        src={`https://www.tiktok.com/player/v1/${videoId}?music_info=0&description=1&rel=0`}
        title={title}
        loading="lazy"
        allow="encrypted-media; fullscreen; picture-in-picture"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        className="absolute inset-0 h-full w-full border-0"
      />
    </div>
  );
}
