import type { PageBlock, ProductCardItem } from "@/api/stetsom/model";

export function getPageBlock<T extends Record<string, unknown>>(
  blocks: PageBlock[],
  sectionId: string,
): Partial<T> {
  return (blocks.find((b) => b.section_id === sectionId)?.data ??
    {}) as Partial<T>;
}

// ── Home page ──────────────────────────────────────────────────────────────

export type HomeHeroBlockData = {
  label?: string;
  title?: string;
};

export type HomeFeaturedBlockData = {
  label?: string;
  title?: string;
  spotlightTitle?: string;
  ctaHref?: string;
  ctaLabel?: string;
  tabs?: Array<{ id: string; label: string; categorySlug?: string }>;
  products?: ProductCardItem[];
  spotlight?: ProductCardItem | null;
};

export type HomeHistoryBlockData = {
  image_url?: string;
  imageAlt?: string;
  label?: string;
  title?: string;
  subtitle?: string;
  ctaHref?: string;
  ctaLabel?: string;
};

export type HomeSocialBlockData = {
  handle?: string;
  title?: string;
  subtitle?: string;
  ctaHref?: string;
  ctaLabel?: string;
  posts?: Array<{ id: string; image: string; likes?: number; href?: string }>;
};

export type HomeFaqBlockData = {
  section?: {
    label?: string;
    title?: string;
    subtitle?: string;
    ctaLabel?: string;
    ctaHref?: string;
  };
  items?: Array<{ id: string; q: string; a: string }>;
};

// ── About page ─────────────────────────────────────────────────────────────

export type AboutHeroBlockData = {
  url?: string;
  imageAlt?: string;
  label?: string;
  title?: string;
  stats?: Array<{ value: string; label: string }>;
  milestones?: string[];
};

export type AboutQualityBlockData = {
  label?: string;
  title?: string;
  description?: string;
  image_url?: string;
  imageAlt?: string;
};

export type AboutValuesBlockData = {
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
  image_url?: string;
  badge?: string;
  label?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  watermarkText?: string;
};

export type SupportCardsBlockData = {
  items?: Array<{ title: string; description: string }>;
};

export type SupportContactBlockData = {
  label?: string;
  title?: string;
  description?: string;
  phone?: string;
  email?: string;
  whatsapp?: string;
};

export type SupportDocBlockData = {
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

export type SupportFaqBlockData = {
  section?: {
    label?: string;
    title?: string;
    subtitle?: string;
    supportButtonLabel?: string;
  };
  items?: Array<{ id: string; q: string; a: string }>;
};

export type SupportServiceCentersBlockData = {
  mapImage?: string;
};
