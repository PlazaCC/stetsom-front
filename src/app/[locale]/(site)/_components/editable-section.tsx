"use client";

/**
 * Wraps a rendered page section with a `data-editor-target` so the CMS page
 * editor's live-preview overlay can detect hover/click on it. Renders as a
 * bare fragment (no extra DOM node) when not in editor mode, so the real
 * public site's markup is unaffected.
 */
export function EditableSection({
  target,
  editable,
  children,
}: {
  target: string;
  editable: boolean;
  children: React.ReactNode;
}) {
  if (!editable) return <>{children}</>;
  return <div data-editor-target={target}>{children}</div>;
}
