import { defineBasicExtension } from "prosekit/basic";
import { union } from "prosekit/core";
import { defineHorizontalRule } from "prosekit/extensions/horizontal-rule";
import { definePlaceholder } from "prosekit/extensions/placeholder";

/**
 * Slim rich-text extension for legal pages: headings, emphasis, lists, links,
 * blockquote and a horizontal rule. Deliberately excludes images, tables, code,
 * math and mentions — legal documents are prose.
 */
export function defineLegalExtension(placeholder: string) {
  return union(
    defineBasicExtension(),
    defineHorizontalRule(),
    definePlaceholder({ placeholder }),
  );
}

export type LegalExtension = ReturnType<typeof defineLegalExtension>;
