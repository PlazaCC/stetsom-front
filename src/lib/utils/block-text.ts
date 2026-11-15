/**
 * The TEXT block used to hold plain text and now holds the rich-text editor's
 * HTML. Markup always starts with a tag, so that is the line between the two —
 * the API draws the same line before sanitizing.
 */
export function isRichTextContent(content: string): boolean {
  return content.trimStart().startsWith("<");
}

/** Shared by the editor and the site so the two read the same. */
export const BLOCK_TEXT_PROSE =
  "[&_a]:text-brand [&_a]:underline [&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:font-sans-condensed [&_h2]:text-display-xl [&_h2]:leading-none [&_h2]:font-black [&_h2]:text-brand-dark [&_h3]:mt-5 [&_h3]:mb-2 [&_h3]:font-sans-condensed [&_h3]:text-display-lg [&_h3]:leading-none [&_h3]:font-black [&_h3]:text-brand-dark [&_h4]:mt-4 [&_h4]:mb-1.5 [&_h4]:font-sans-condensed [&_h4]:text-display-sm [&_h4]:leading-none [&_h4]:font-black [&_h4]:text-brand-dark [&_h5]:mt-4 [&_h5]:mb-1.5 [&_h5]:font-sans-condensed [&_h5]:text-section-title [&_h5]:leading-none [&_h5]:font-black [&_h5]:text-brand-dark [&_li]:my-1 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-3 [&_strong]:font-bold [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-6 [&>:first-child]:mt-0 [&>:last-child]:mb-0";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Turns legacy plain text into editor HTML: blank lines split paragraphs and
 * single line breaks become `<br>`, which is how the site displayed it.
 */
export function plainTextToBlockHtml(text: string): string {
  if (!text.trim()) return "";
  return text
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.replace(/^\n+|\n+$/g, ""))
    .filter((paragraph) => paragraph.trim())
    .map(
      (paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, "<br>")}</p>`,
    )
    .join("");
}

/** The editor's seed: HTML as is, legacy plain text converted. */
export function toBlockTextHtml(content: string): string {
  return isRichTextContent(content) ? content : plainTextToBlockHtml(content);
}
