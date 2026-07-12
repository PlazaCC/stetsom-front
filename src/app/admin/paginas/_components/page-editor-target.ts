import type { HomePageViewData } from "@/app/[locale]/(site)/_components/home-page-view";
import type { AboutPageViewData } from "@/app/[locale]/(site)/sobre/_components/about-page-view";
import type { SupportPageViewData } from "@/app/[locale]/(site)/suporte/_components/support-page-view";

export type PagePreviewModel =
  | { pageId: "home"; data: HomePageViewData }
  | { pageId: "about"; data: AboutPageViewData }
  | { pageId: "support"; data: SupportPageViewData };

export const PAGE_PREVIEW_READY = "stetsom-page-preview-ready";
export const PAGE_PREVIEW_MODEL = "stetsom-page-preview-model";
export const PAGE_PREVIEW_SELECTION = "stetsom-page-preview-selection";
export const PAGE_PREVIEW_INTENT = "stetsom-page-preview-intent";

export type PageEditorTarget = string | null;

export function parsePageEditorTarget(raw: string | null): PageEditorTarget {
  if (!raw?.startsWith("section:")) return null;
  return raw.slice("section:".length);
}
