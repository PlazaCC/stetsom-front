import type { RichTextProfile } from "./extension";

/**
 * Which keys of a page block's `data` bag hold rich text, and with which
 * profile.
 *
 * **Must stay in sync with `PROFILE_BY_KEY` in the API**
 * (`src/domains/pages/utils/sanitize-block-data.ts`). The bag is freeform, so
 * neither side can derive this from a schema — the editor uses it to pick the
 * toolbar, the API uses it to pick the sanitizer. A key present on one side only
 * means the operator gets formatting that is silently stripped on save, or
 * markup that is stored but never offered.
 */
export const BLOCK_RICH_TEXT_KEYS: Record<string, RichTextProfile> = {
  description: "content",
  subtitle: "inline",
  a: "content",
};

export function blockRichTextProfile(key: string): RichTextProfile | undefined {
  return BLOCK_RICH_TEXT_KEYS[key];
}
