"use client";

import DOMPurify from "dompurify";
import { cn } from "@/lib/utils";
import { isRichTextContent } from "@/lib/utils/block-text";
import { decodeHtmlEntities } from "@/lib/utils/plain-text";

/** Server content is sanitized by the API. Sanitize again in the browser for CMS drafts. */
export function RichText({
  content,
  className,
  headingLevel,
}: {
  content?: string;
  className?: string;
  headingLevel?: 1 | 2 | 3;
}) {
  const value = content ?? "";
  if (!isRichTextContent(value)) {
    return (
      <div
        role={headingLevel ? "heading" : undefined}
        aria-level={headingLevel}
        className={cn("whitespace-pre-line", className)}
      >
        {decodeHtmlEntities(value)}
      </div>
    );
  }
  const html = value;
  const safe =
    typeof window === "undefined"
      ? html
      : DOMPurify.sanitize(html, {
          ALLOWED_TAGS: [
            "p",
            "br",
            "strong",
            "b",
            "em",
            "i",
            "u",
            "s",
            "ul",
            "ol",
            "li",
            "a",
            "h2",
            "h3",
            "h4",
            "h5",
            "span",
          ],
          ALLOWED_ATTR: ["href", "target", "rel", "class"],
          ALLOW_UNKNOWN_PROTOCOLS: false,
        });
  return (
    <div
      suppressHydrationWarning
      role={headingLevel ? "heading" : undefined}
      aria-level={headingLevel}
      className={cn(
        "[&_a]:underline [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-0 [&_ul]:list-disc [&_ul]:pl-5",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: safe }}
    />
  );
}
