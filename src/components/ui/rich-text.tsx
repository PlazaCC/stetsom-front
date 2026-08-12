import { cn } from "@/lib/utils";

interface RichTextProps {
  /** HTML authored in the CMS, sanitized by the API at save time. */
  html?: string | null;
  /** Element to render. Inline fields should pass `span`. */
  as?: "div" | "p" | "span";
  className?: string;
}

/**
 * Renders a rich-text field from the CMS.
 *
 * The API sanitizes on write — see `lib/sanitize-html.ts` there — which is the
 * same trust boundary the legal pages rely on. Renders nothing when empty, so
 * callers do not need their own guard.
 */
export function RichText({ html, as = "div", className }: RichTextProps) {
  if (!html || !html.trim()) return null;

  const Tag = as;
  return (
    <Tag
      className={cn(
        "[&_a]:text-brand [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5",
        className,
      )}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: admin-authored HTML sanitized at save time
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
