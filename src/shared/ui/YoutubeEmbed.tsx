import { getYoutubeVideoId } from "@/shared/lib/youtube";
import { cn } from "@/shared/lib/utils";

interface YoutubeEmbedProps {
  /** Any YouTube link or embed snippet; renders nothing if it isn't one. */
  url: string | null | undefined;
  title: string;
  className?: string;
}

export function YoutubeEmbed({ url, title, className }: YoutubeEmbedProps) {
  const videoId = getYoutubeVideoId(url);
  if (!videoId) return null;

  return (
    <div className={cn("relative aspect-video w-full overflow-hidden bg-black", className)}>
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0`}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        className="absolute inset-0 h-full w-full border-0"
      />
    </div>
  );
}
