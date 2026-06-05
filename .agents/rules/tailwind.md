---
description: 'Use when writing styles, utility classes, or CSS. Covers all Tailwind v4 tokens (color, typography, spacing), canonical class formula, and the no-hardcode rule.'
applyTo: 'src/**/*.{ts,tsx,css}'
---

# Tailwind CSS v4

No `tailwind.config.*` — all config in `src/app/globals.css` inside `@theme inline`. Never use arbitrary color values — always a token from the tables below.

## Color Tokens

| Class | Value | Use |
|---|---|---|
| `bg-brand` / `text-brand` | Stetsom red | CTAs, active links, highlights |
| `bg-brand-dark` / `text-brand-dark` | `#121212` | Dark backgrounds (footer, hero, header) |
| `bg-off-white` | `#F5F4F2` | Alternating light sections |
| `bg-card` | `#F8F8F8` | Product cards, subtle surfaces |
| `bg-muted` | `#F0F0F0` | Image placeholders, muted bg |
| `text-muted-foreground` | `#565656` | Nav links, copyright, secondary text |
| `text-text-subtle` | `#666666` | Descriptive text on light bg |
| `text-text-subtle-dark` | `#B8B8B8` | Secondary text on dark bg |
| `bg-surface-elevated` | `#1F1F1F` | Elevated surface in dark context |
| `text-icon-muted` | `#767676` | Muted icons |
| `text-foreground` | near-black | Primary text |

Grays: prefer `zinc-200`, `zinc-400`, `neutral-400`, `white/10`. Don't mix `gray-*` and `zinc-*` in the same component. Missing color → add to `globals.css`, never spread hex in components.

## Typography Tokens

| Class | Size | Use |
|---|---|---|
| `text-2xs` | 11px | Small labels, badges |
| `text-button-md` | 13px | Medium buttons, footer copyright |
| `text-section-title` | 22px | Card headings (support, bases) |
| `text-display-sm` | 40px | SectionLabel heading |
| `text-display-lg` | 56px | Timeline year heading lg |
| `text-display-xl` | 64px | Hero heading md |
| `text-display-2xl` | 80px | Timeline year heading xl |

- `font-sans` → Barlow (body, paragraphs, labels)
- `font-sans-condensed font-black uppercase` → impact headings, technical specs ("3000W RMS"), background watermarks
- Never set `fontFamily` via `style={{}}` or `font-[...]`

## Spacing Tokens

| Class | Value | Use |
|---|---|---|
| `gap-logo-nav` | 51px | Gap between logo and nav |

Page layout: `Container` component — `px-8 lg:px-42.5 max-w-360 mx-auto`. Breakpoints: mobile-first (`sm:`, `md:`, `lg:`).

## Canonical Classes — No `[Npx]`

Formula: `N px` → `N/4` Tailwind units (1 unit = 0.25rem = 4px).

```
h-[45px]  → h-11.25    px-[170px] → px-42.5     leading-[32px] → leading-8
h-[200px] → h-50       w-[250px]  → w-62.5      max-w-[360px]  → max-w-90
h-[400px] → h-100      w-[400px]  → w-100       max-w-[1440px] → max-w-360
```

**Real exceptions** (keep as arbitrary):
- `rounded-[Npx]` — project overrides `--radius`; `rounded-lg` ≠ 8px here
- `tracking-[Npx]` — letter-spacing uses `em` scale, no canonical
- `text-[15px]`, `text-[28px]`, `text-[32px]` etc. — font-size doesn't use spacing scale
- `shadow-[...]` — composite shadows have no canonical
- Inline opacity: `text-white/[0.04]`

## @theme inline Declaration Order

`--text-*` tokens MUST be declared **last** in the `@theme inline` block — after all shadcn/ui tokens — so custom sizes override any `@theme` imported by packages (`shadcn/tailwind.css`, `tw-animate-css`).
