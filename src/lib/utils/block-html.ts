import DOMPurify from "dompurify";
import { scopeBlockCss } from "./product";

export interface SanitizedBlockHtml {
  /** Markup safe to inject, without its `<style>` elements. */
  html: string;
  /** The `<style>` contents, every selector prefixed with the block scope. */
  css: string;
  /** True when DOMPurify dropped something (scripts, iframes, `on*`…). */
  removedContent: boolean;
}

/**
 * Sanitizes the free-HTML block for the browser (DOMPurify needs a DOM).
 *
 * `FORCE_BODY` keeps a leading `<style>`: without it the parser moves the
 * style into `<head>` and DOMPurify returns only the body, so HTML that starts
 * with its CSS lost it. The styles are then lifted out and scoped to the
 * block, so author CSS cannot restyle the rest of the page.
 */
export function sanitizeBlockHtml(
  rawHtml: string,
  scope: string,
): SanitizedBlockHtml {
  const fragment = DOMPurify.sanitize(rawHtml, {
    USE_PROFILES: { html: true },
    FORCE_BODY: true,
    RETURN_DOM_FRAGMENT: true,
  });
  const removedContent = DOMPurify.removed.length > 0;

  const styles = Array.from(fragment.querySelectorAll("style"));
  const css = styles.map((style) => style.textContent ?? "").join("\n");
  for (const style of styles) style.remove();

  const container = document.createElement("div");
  container.append(fragment);

  return {
    html: container.innerHTML,
    css: scopeBlockCss(css, scope),
    removedContent,
  };
}
