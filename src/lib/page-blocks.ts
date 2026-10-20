import type { I18nString, PageBlock } from "@/api/stetsom/model";
import { toApiLocale } from "@/lib/api/i18n-utils";
import { isAllowedVideoLink } from "@/lib/video-embed";

export function getPageBlock<T extends Record<string, unknown>>(
  blocks: PageBlock[],
  sectionId: string,
): Partial<T> {
  return (blocks.find((b) => b.section_id === sectionId)?.data ??
    {}) as Partial<T>;
}

export type FaqItem = { id: string; q: string; a: string };

// ── Home page ──────────────────────────────────────────────────────────────

export type HomeHeroBlockData = {
  label?: string;
  title?: string;
};

export type HomeHistoryBlockData = {
  hidden?: boolean;
  image_url?: string;
  imageAlt?: string;
  label?: string;
  title?: string;
  subtitle?: string;
  ctaHref?: string;
  ctaLabel?: string;
};

export type HomeSocialBlockData = {
  hidden?: boolean;
  handle?: string;
  title?: string;
  subtitle?: string;
  ctaHref?: string;
  ctaLabel?: string;
  posts?: Array<{ id: string; image: string; likes?: number; href?: string }>;
};

export type FaqBlockData = {
  hidden?: boolean;
  section?: {
    label?: string;
    title?: string;
    subtitle?: string;
    ctaLabel?: string;
    ctaHref?: string;
    maxItems?: number;
  };
};

// ── About page ─────────────────────────────────────────────────────────────

export type AboutHeroBlockData = {
  hidden?: boolean;
  url?: string;
  imageAlt?: string;
  label?: string;
  title?: string;
  foundedYear?: string;
  stats?: Array<{ value: string; label: string }>;
  milestones?: string[];
};

export type AboutQualityBlockData = {
  hidden?: boolean;
  label?: string;
  title?: string;
  description?: string;
  /** Poster for the background video; fallback when no video is set. */
  image_url?: string;
  imageAlt?: string;
  /** Muted background loop. */
  video_url?: string;
  /** Uploaded video opened by the Play button; defaults to `video_url`. */
  fullVideo_url?: string;
  /**
   * YouTube/Vimeo link for the Play modal; wins over `fullVideo_url`. The CMS
   * stores one per locale (`{ pt, en?, es? }`) and the public API resolves it
   * to the request locale (falling back to `pt`); legacy blocks hold a string.
   */
  fullVideoLink?: string | I18nString;
  playLabel?: string;
};

/**
 * Video opened by the "Quem somos" Play button for `locale`: localized link →
 * PT link → uploaded file. Links outside YouTube/Vimeo are skipped. Returns
 * `undefined` so the hero can fall back to the background loop, then the image.
 */
export function resolveQualityPlayerVideo(
  data: Pick<AboutQualityBlockData, "fullVideoLink" | "fullVideo_url">,
  locale: string,
): string | undefined {
  const link = data.fullVideoLink;
  const candidates =
    typeof link === "string"
      ? [link]
      : link
        ? [link[toApiLocale(locale)], link.pt]
        : [];
  return (
    candidates.find((url): url is string => !!url && isAllowedVideoLink(url)) ||
    data.fullVideo_url ||
    undefined
  );
}

export type AboutValuesBlockData = {
  hidden?: boolean;
  items?: Array<{
    id?: string;
    icon: string;
    title: string;
    description: string;
  }>;
  bases?: Array<{
    id?: string;
    icon: string;
    title: string;
    description: string;
  }>;
};

export type AboutTimelineBlockData = {
  hidden?: boolean;
  events?: Array<{
    year: number | string;
    title: string;
    description: string;
    image_url?: string;
    imageAlt?: string;
    shortTitle?: string;
  }>;
};

export type AboutSocialBlockData = HomeSocialBlockData & {
  permalink?: string;
  media_type?: string;
  media_url?: string;
  caption?: string;
  username?: string;
  timestamp?: string;
};

export type AboutFactoryBlockData = {
  hidden?: boolean;
  image_url?: string;
  imageAlt?: string;
  label?: string;
  title?: string;
  description?: string;
  buttonLabel?: string;
  buttonHref?: string;
};

// ── Support page ───────────────────────────────────────────────────────────

export type SupportHeroBlockData = {
  hidden?: boolean;
  image_url?: string;
  badge?: string;
  label?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  watermarkText?: string;
};

export type SupportCardsBlockData = {
  hidden?: boolean;
  items?: Array<{ title: string; description: string }>;
};

export type SupportContactBlockData = {
  hidden?: boolean;
  label?: string;
  title?: string;
  description?: string;
  phone?: string;
  email?: string;
  whatsapp?: string;
};

export type SupportDocBlockData = {
  hidden?: boolean;
  categories?: Array<{
    id: string;
    title: string;
    label: string;
    slug: string;
  }>;
  files?: Array<{
    id: string;
    name?: string;
    file_url: string;
    type: string;
    version: number;
    fileSize?: string;
    category_slug?: string;
  }>;
};

export type SupportServiceCentersBlockData = {
  hidden?: boolean;
  mapImage?: string;
};
