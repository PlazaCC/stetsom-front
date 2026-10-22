import {
  defineBaseCommands,
  defineBaseKeymap,
  defineCommands,
  defineHistory,
  defineKeymap,
  defineMarkSpec,
  toggleMark,
  union,
} from "prosekit/core";
import { defineBold } from "prosekit/extensions/bold";
import { defineDoc } from "prosekit/extensions/doc";
import { defineHardBreak } from "prosekit/extensions/hard-break";
import { defineHeading } from "prosekit/extensions/heading";
import { defineItalic } from "prosekit/extensions/italic";
import { defineLink } from "prosekit/extensions/link";
import { defineList } from "prosekit/extensions/list";
import { defineParagraph } from "prosekit/extensions/paragraph";
import { definePlaceholder } from "prosekit/extensions/placeholder";
import { defineText } from "prosekit/extensions/text";
import { defineUnderline } from "prosekit/extensions/underline";

/** The semi-bold class the API sanitizer keeps on `<span>` (and nothing else). */
export const SEMIBOLD_CLASS = "font-semibold";

/**
 * Semi-bold (600) for technical copy, between body text and bold. Stored as a
 * span with one whitelisted class so the site styles it with no extra CSS.
 */
function defineSemibold() {
  return union(
    defineMarkSpec({
      name: "semibold",
      parseDOM: [
        { tag: `span.${SEMIBOLD_CLASS}` },
        {
          style: "font-weight",
          getAttrs: (value) => (value === "600" ? null : false),
        },
      ],
      toDOM: () => ["span", { class: SEMIBOLD_CLASS }, 0],
    }),
    defineCommands({
      toggleSemibold: () => toggleMark({ type: "semibold" }),
    }),
    defineKeymap({ "Mod-Shift-b": toggleMark({ type: "semibold" }) }),
  );
}

/**
 * Rich text for the product TEXT block: paragraphs, h3/h4 subheadings (the
 * block title is the h2), bold, semi-bold, italic, underline, lists and links.
 * Mirrors the API's block-text sanitize profile — anything else is dropped on
 * save.
 */
export function defineBlockTextExtension(placeholder: string) {
  return union(
    defineDoc(),
    defineText(),
    defineParagraph(),
    defineHeading(),
    defineList(),
    defineHardBreak(),
    defineBold(),
    defineSemibold(),
    defineItalic(),
    defineUnderline(),
    defineLink(),
    defineBaseKeymap(),
    defineBaseCommands(),
    defineHistory(),
    definePlaceholder({ placeholder }),
  );
}

export type BlockTextExtension = ReturnType<typeof defineBlockTextExtension>;
