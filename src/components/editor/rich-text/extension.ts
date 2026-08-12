import {
  defineBaseCommands,
  defineBaseKeymap,
  defineHistory,
  union,
} from "prosekit/core";
import { defineBlockquote } from "prosekit/extensions/blockquote";
import { defineBold } from "prosekit/extensions/bold";
import { defineCode } from "prosekit/extensions/code";
import { defineDoc } from "prosekit/extensions/doc";
import { defineHardBreak } from "prosekit/extensions/hard-break";
import { defineItalic } from "prosekit/extensions/italic";
import { defineLink } from "prosekit/extensions/link";
import { defineList } from "prosekit/extensions/list";
import { defineParagraph } from "prosekit/extensions/paragraph";
import { definePlaceholder } from "prosekit/extensions/placeholder";
import { defineStrike } from "prosekit/extensions/strike";
import { defineText } from "prosekit/extensions/text";
import { defineUnderline } from "prosekit/extensions/underline";

/**
 * Editor capabilities, deliberately mirroring the API's sanitize profiles
 * (`lib/sanitize-html.ts`).
 *
 * The alignment matters: the server is the boundary, and anything the editor can
 * produce but the profile forbids would be stripped on save with no feedback.
 * `prosekit/basic` is not used here — it bundles headings, images, tables and
 * code blocks, none of which survive these profiles.
 */

/** Schema, keymap and history — the minimum a working editor needs. */
function defineBase(placeholder: string) {
  return union(
    defineDoc(),
    defineText(),
    defineParagraph(),
    defineHardBreak(),
    defineBaseKeymap(),
    defineBaseCommands(),
    defineHistory(),
    definePlaceholder({ placeholder }),
  );
}

/** Emphasis and links — shared by both profiles. */
function defineInlineMarks() {
  return union(
    defineBold(),
    defineItalic(),
    defineUnderline(),
    defineStrike(),
    defineLink(),
  );
}

/**
 * Prose inside an existing layout: paragraphs, lists, blockquote, inline code.
 * Matches the `content` sanitize profile.
 */
export function defineContentExtension(placeholder: string) {
  return union(
    defineBase(placeholder),
    defineInlineMarks(),
    defineList(),
    defineBlockquote(),
    defineCode(),
  );
}

/**
 * A single run of text: emphasis and links only, no block structure.
 * Matches the `inline` sanitize profile.
 */
export function defineInlineExtension(placeholder: string) {
  return union(defineBase(placeholder), defineInlineMarks());
}

export type ContentExtension = ReturnType<typeof defineContentExtension>;
export type InlineExtension = ReturnType<typeof defineInlineExtension>;

/** Which capability set a field gets. Mirrors the API profile names. */
export type RichTextProfile = "content" | "inline";
