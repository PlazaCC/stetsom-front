---
description: 'Use when styling any component, adding Tailwind classes, or writing CSS. Covers static vs dynamic decision, leading scale, gradients, section spacing, CVA variants, icon sizes.'
applyTo: 'src/**/*.{ts,tsx,css}'
---

# Styling Practices

See `tailwind.md` for token reference (colors, typography, canonical formula).

## Static vs Dynamic — className vs style={{}}

| Type | Criterion | How to style |
|---|---|---|
| **Static** | Fixed value, no props/state/data dependency | Tailwind class + token |
| **Dynamic** | Derived from prop, state, or API response | `style={{}}` — required |
| **Semi-static** | Same fixed value in 2+ places | Create token in `globals.css` |

```tsx
// ✅ Legitimate style={{}}
style={{ left: `${leftPercent}%` }}
style={{ backgroundImage: `url(${img})` }}
style={{ color: statusColorMap[status] }}

// ❌ Never style={{}} for static values
style={{ color: '#E8132A' }}  // → className="text-brand"
style={{ padding: '40px' }}   // → className="p-10"
```

## Before Adding Any New Value

1. Token exists in theme? → use the token
2. Dimension? → convert to canonical (`N/4`)
3. Color without token? → add to `globals.css`, not inline
4. Repeats ≥ 2 places? → create token; don't copy hardcode

## Font Sizes

- Tailwind named scale: `text-xs`, `text-sm`, `text-base` … `text-9xl`
- Stetsom custom: `text-2xs`, `text-button-md`, `text-section-title`, `text-display-sm/lg/xl/2xl`
- `text-[Npx]` only for sizes outside the named scale (`text-[15px]`, `text-[32px]`, etc.)

## Leading (line-height) — Canonical Scale

| Use | Class | Value |
|---|---|---|
| Compact headings | `leading-tight` | 1.25 |
| Normal headings | `leading-snug` | 1.375 |
| Body text | `leading-normal` | 1.5 |
| Descriptive / long-form | `leading-relaxed` | 1.625 |
| Spaced text | `leading-loose` | 2.0 |

Never `leading-[1.6]`, `leading-[1.7]` — use the canonical equivalent.

## Gradients

Prefer Tailwind: `bg-linear-to-t from-black/65 to-transparent`. Use `style={{}}` only for radial or complex gradients without native Tailwind support. Custom CSS gradient classes must be defined in `globals.css` with a comment identifying the use. Never use `style` inline in one component and a Tailwind class in another for the same effect.

## Vertical Spacing — Section Scale

| Level | Classes | When |
|---|---|---|
| Card / inner gap | `py-4` / `py-6` | Inner card padding, light separator |
| Small section | `py-8` / `py-10` | Support blocks, section footers |
| Standard section | `py-16` | Most content sections |
| Hero / main | `py-20` / `py-24` | Hero, spotlight sections |

Avoid `py-12` and `py-14` (gray zone) — use `py-10` or `py-16`.

## CVA for Multi-Variant Components

Use `cva` from `class-variance-authority` when a component has ≥ 2 visual variants. Reference: `src/components/ui/button.tsx`.

```tsx
// ✅
const badgeVariants = cva("inline-flex items-center rounded-full px-2.5 py-0.5 text-2xs font-semibold", {
  variants: { variant: { default: "bg-brand text-white", outline: "border border-brand text-brand" } },
  defaultVariants: { variant: "default" },
})
// ❌ Nested ternaries — fragile and unreadable
```

## Icon Sizes

| Context | Class |
|---|---|
| Inline (button, badge, tag) | `size-4` |
| Navigation / header | `size-5` |
| Card / feature | `size-6` / `size-8` |
| Decorative / hero | `size-16`+ |

Always import icons from `lucide-react`. Never import SVG inline for icons that exist in Lucide.

## No `!important`

Never use `!important` in components or inline styles. To override third-party library styles (Swiper, etc.): use a dedicated CSS block in `globals.css` with a comment identifying the library and reason. Prefer selector specificity over `!important`.
