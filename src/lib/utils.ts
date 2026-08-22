import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: [
        "display-sm",
        "display-lg",
        "display-xl",
        "display-2xl",
        "section-title",
        "2xs",
        "button-md",
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Fallback matching the mobile value of `--header-height` in globals.css. */
const HEADER_HEIGHT_FALLBACK = 64;

/**
 * Current header height in px, read from the `--header-height` token so
 * programmatic scrolling stays in sync with the responsive header (64px
 * mobile / 100px from `md`). Returns the mobile fallback on the server.
 */
export function getHeaderHeight() {
  if (typeof window === "undefined") return HEADER_HEIGHT_FALLBACK;

  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--header-height")
    .trim();
  const value = Number.parseFloat(raw);
  if (Number.isNaN(value)) return HEADER_HEIGHT_FALLBACK;

  return raw.endsWith("rem")
    ? value *
        Number.parseFloat(getComputedStyle(document.documentElement).fontSize)
    : value;
}
