# Admin Shell — Single Scroll Ownership

The admin shell owns the page scroll. `admin-shell.tsx` builds a fixed-viewport layout:

```
<div className="flex h-screen overflow-hidden">      ← root, fixed to the viewport, never scrolls
  <AdminSidebar />
  <div className="flex flex-1 flex-col overflow-hidden">
    <AdminTopbar />                                   ← lg:hidden, mobile only
    <main className="flex-1 overflow-y-auto ...">     ← the ONE scroll container
```

`<main>` is the only scroll container in the admin. The `<html>`, `<body>`, and every shell wrapper are fixed height or `overflow-hidden`. The window itself does not scroll.

## Rules

- Do not add a nested scroll inside an admin page. Avoid `overflow-y-auto`, `overflow-auto`, and `max-h-* overflow-*` on page content, and avoid `h-screen` / `100vh` / `100dvh` combined with `overflow` on inner containers. Each one yields a second scrollbar next to the shell's.
- Scroll to top by scrolling the shell, not the window. The window never scrolls here.

  ```ts
  // correct
  document.querySelector("main")?.scrollTo({ top: 0, behavior: "smooth" });
  // wrong — does nothing, the window is not the scroll container
  window.scrollTo(0, 0);
  ```

- Sticky asides use `sticky top-N self-start` and flow inside `<main>`. Size their content to fit the shell scroll.
- Embedded previews and iframes that flow inside `<main>` are sized to their content height, reported back over `postMessage`, never given a viewport-fixed inner scroll.

## Exception — the product editor split view

The product editor (`product-editor-layout.tsx`, mounted by `product-wizard/wizard.tsx`) is an intentional Elementor-style split view that fills `<main>` and does not let it scroll. It owns two independent scroll columns:

- The preview canvas on the left (`preview-canvas.tsx`) is a real viewport. Its iframe is `h-full` and scrolls internally — it does **not** report its height. The `[locale]/preview-produto/page.tsx` frame must not use `100vh`/`100dvh` content, but it does own its own scrollbar here.
- The 320px contextual panel on the right (`editor-panel.tsx`) scrolls independently.

This does not regress the rule's intent. The two scrollbars sit in separate columns, `<main>` itself stays `overflow-hidden`, and there is no accidental nesting. The split view fills the shell exactly, so the window still never scrolls.

## Why

Nested scroll containers inside the fixed shell produce two visible scrollbars side by side and break scroll-to-top. The product wizard preview regressed this once by giving its iframe a `100dvh` inner scroll. Keep the shell as the single scroll authority, except for the deliberate editor split view above.
