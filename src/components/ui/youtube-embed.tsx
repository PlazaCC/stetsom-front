import { cn } from "@/lib/utils";
import { getYouTubeEmbedUrl } from "@/lib/utils/product";

interface YouTubeEmbedProps {
  /** Any YouTube URL shape (watch, youtu.be, embed, shorts). */
  url: string;
  /** Accessible title for the iframe. */
  title?: string;
  className?: string;
}

/**
 * Responsive 16:9 embedded YouTube player. Renders nothing when the URL isn't a
 * recognizable YouTube link.
 */
export function YouTubeEmbed({ url, title, className }: YouTubeEmbedProps) {
  const embedUrl = getYouTubeEmbedUrl(url);
  if (!embedUrl) return null;

  return (
    <div
      className={cn(
        "relative aspect-video w-full overflow-hidden rounded-xl bg-brand-dark",
        className,
      )}
    >
      <iframe
        src={embedUrl}
        title={title ?? "YouTube video player"}
        className="absolute inset-0 h-full w-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}
