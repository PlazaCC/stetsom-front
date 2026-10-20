export type VideoSource =
  | { kind: "file"; src: string }
  | { kind: "embed"; provider: "youtube" | "vimeo"; src: string };

const YOUTUBE_ID = /^[\w-]{11}$/;

/**
 * Classifies a CMS video URL: YouTube/Vimeo links become autoplaying embed
 * URLs; anything else is treated as a direct file (mp4/webm).
 */
export function resolveVideoSource(rawUrl: string): VideoSource | null {
  const value = rawUrl.trim();
  if (!value) return null;

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    // Relative paths (e.g. "/videos/x.mp4") are direct files.
    return value.startsWith("/") ? { kind: "file", src: value } : null;
  }

  const host = url.hostname.replace(/^(www\.|m\.)/, "");

  if (
    host === "youtu.be" ||
    host.endsWith("youtube.com") ||
    host === "youtube-nocookie.com"
  ) {
    const id = getYoutubeId(url, host);
    if (!id) return null;
    const params = new URLSearchParams({
      autoplay: "1",
      rel: "0",
      playsinline: "1",
    });
    const start = url.searchParams.get("t") ?? url.searchParams.get("start");
    if (start) params.set("start", String(Number.parseInt(start, 10) || 0));
    return {
      kind: "embed",
      provider: "youtube",
      src: `https://www.youtube-nocookie.com/embed/${id}?${params}`,
    };
  }

  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const segments = url.pathname.split("/").filter(Boolean);
    const idIndex = segments.findIndex((s) => /^\d+$/.test(s));
    if (idIndex === -1) return null;
    const id = segments[idIndex];
    const params = new URLSearchParams({ autoplay: "1" });
    // Unlisted videos carry a privacy hash: vimeo.com/<id>/<hash> or ?h=<hash>.
    const hash = url.searchParams.get("h") ?? segments[idIndex + 1];
    if (hash && /^[\da-f]+$/i.test(hash)) params.set("h", hash);
    return {
      kind: "embed",
      provider: "vimeo",
      src: `https://player.vimeo.com/video/${id}?${params}`,
    };
  }

  return { kind: "file", src: value };
}

function getYoutubeId(url: URL, host: string): string | null {
  const candidate =
    host === "youtu.be"
      ? url.pathname.slice(1)
      : (url.searchParams.get("v") ??
        url.pathname.match(/^\/(?:embed|shorts|live|v)\/([^/?]+)/)?.[1]);
  return candidate && YOUTUBE_ID.test(candidate) ? candidate : null;
}

/**
 * Whether a CMS "video link" is from an allowed embed provider (YouTube or
 * Vimeo). Direct files go through the uploaded-video field instead.
 */
export function isAllowedVideoLink(rawUrl: string): boolean {
  return resolveVideoSource(rawUrl)?.kind === "embed";
}
