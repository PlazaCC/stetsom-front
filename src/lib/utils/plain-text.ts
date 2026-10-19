const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
};

/**
 * Turns the entities the API's HTML sanitizer writes into a plain-text field
 * (`A & B` is stored as `A &amp; B`) back into characters, so the text can be
 * rendered as a React text node or edited in a textarea. One pass, so an
 * escaped entity like `&amp;lt;` decodes to `&lt;`, not `<`.
 */
export function decodeHtmlEntities(text: string | null | undefined): string {
  if (!text) return "";
  return text.replace(
    /&(?:#(\d+)|#x([0-9a-f]+)|([a-z]+));/gi,
    (match, dec?: string, hex?: string, name?: string) => {
      if (name) return NAMED_ENTITIES[name.toLowerCase()] ?? match;
      const code = dec ? Number(dec) : Number.parseInt(hex!, 16);
      return code <= 0x10ffff ? String.fromCodePoint(code) : match;
    },
  );
}
