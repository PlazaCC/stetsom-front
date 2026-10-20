import type { I18nLocale } from "@/app/admin/_components/crud/i18n-input";
import { isAllowedVideoLink } from "@/lib/video-embed";
import type { FieldSpec } from "./section-field-spec";

const LOCALES: I18nLocale[] = ["pt", "en", "es"];

export const VIDEO_LINK_ERROR =
  "Use um link do YouTube ou do Vimeo (ex.: https://www.youtube.com/watch?v=… ou https://vimeo.com/…).";

/** Locales whose value fails the field's `validate` rule (empty values pass). */
export function invalidLocales(
  field: Extract<FieldSpec, { kind: "i18n" }>,
  value: unknown,
): Partial<Record<I18nLocale, boolean>> {
  if (field.validate !== "video-link") return {};
  const byLocale: Partial<Record<I18nLocale, unknown>> =
    typeof value === "string"
      ? { pt: value }
      : value && typeof value === "object"
        ? (value as Partial<Record<I18nLocale, unknown>>)
        : {};

  const invalid: Partial<Record<I18nLocale, boolean>> = {};
  for (const locale of LOCALES) {
    const raw = byLocale[locale];
    if (typeof raw === "string" && raw.trim() && !isAllowedVideoLink(raw)) {
      invalid[locale] = true;
    }
  }
  return invalid;
}

/** Whether any validated field in the section draft holds an invalid value. */
export function hasInvalidFields(
  fields: FieldSpec[],
  data: Record<string, unknown>,
): boolean {
  return fields.some((field) => {
    if (field.kind === "i18n") {
      return Object.keys(invalidLocales(field, data[field.key])).length > 0;
    }
    if (field.kind === "group") {
      const group = data[field.key];
      return (
        !!group &&
        typeof group === "object" &&
        hasInvalidFields(field.fields, group as Record<string, unknown>)
      );
    }
    if (field.kind === "list") {
      const items = data[field.key];
      return (
        Array.isArray(items) &&
        items.some(
          (item) =>
            !!item &&
            typeof item === "object" &&
            hasInvalidFields(field.itemFields, item as Record<string, unknown>),
        )
      );
    }
    return false;
  });
}
