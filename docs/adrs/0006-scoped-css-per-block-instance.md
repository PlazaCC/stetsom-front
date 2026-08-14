# 0006: Scoped CSS per block instance

Status: Accepted

## Context

Product pages are built from CMS-authored content blocks, and editors need to apply custom CSS to an individual block without that rule leaking to every other block of the same type on the page, or to other pages.

## Decision

Every block root is an `<article>` carrying `id` and `data-block-scope`, set to `customId` when present or the automatic `block_id` otherwise. An editor writes plain CSS targeting the block's BEM classes in the Styling tab, and at render time every selector is prefixed with `[data-block-scope="<id>"]`, so the rule only matches that one block instance.

```css
/* Authored in the Styling tab */
.blockText__paragraph {
  color: #e8132a;
}

/* Injected on the page */
[data-block-scope="meu-id"] .blockText__paragraph {
  color: #e8132a;
}
```

`@media`, `@supports`, and `@container` rules are scoped recursively. `@keyframes` and `@font-face` pass through unscoped, since they declare named resources rather than selectors. `BlockRenderer` resolves the scope and injects the scoped `<style>` tag; `scopeBlockCss` performs the prefixing.

## Consequences

Editors get per-instance CSS without naming-collision risk across blocks, at the cost of a render-time string transform on every block with `customCss`. The full block type reference, `BlockStyle` fields, and rendering pipeline are documented in `docs/product-blocks.md`.
