# Handoff: Stetsom Design System

## Overview
Implementação do design system da Stetsom — marca brasileira de áudio automotivo — em um projeto React com **shadcn/ui** e **Tailwind CSS**. Cobre tokens de cor, tipografia, espaçamento, e overrides dos componentes shadcn para seguir a identidade visual da marca.

Os arquivos HTML em `../ui_kits/website/index.html` são **protótipos de referência** criados para visualização — não copie o HTML diretamente. O objetivo é recriar essas telas usando os componentes shadcn e o sistema Tailwind do seu projeto.

## Fidelidade
**High-fidelity** — os protótipos têm cores, tipografia, espaçamento e interações finais. Recrie pixel a pixel usando shadcn + Tailwind.

---

## 1 · Tailwind Config

Cole no seu `tailwind.config.ts` (dentro de `theme.extend`):

```ts
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          red:    "rgb(232, 19, 42)",   // Accent principal — CTAs, labels, ícones
          black:  "rgb(9, 9, 11)",       // Fundo mais escuro
          dark:   "rgb(18, 18, 18)",     // Seções escuras, footer
          dark2:  "rgb(24, 24, 27)",     // Cards escuros
        },
        gray: {
          900:   "rgb(44, 44, 44)",
          800:   "rgb(54, 54, 54)",
          700:   "rgb(86, 86, 86)",
          600:   "rgb(102, 102, 102)",
          500:   "rgb(113, 113, 122)",
          400:   "rgb(133, 133, 133)",
          300:   "rgb(184, 184, 184)",
          200:   "rgb(217, 217, 217)",
          100:   "rgb(241, 241, 241)",
          50:    "rgb(245, 244, 242)",   // Off-white — FAQ, seções neutras
        },
      },
      fontFamily: {
        display: ["Barlow Condensed", "sans-serif"], // Headlines, ALL CAPS
        body:    ["Barlow", "sans-serif"],            // Corpo, nav, labels
      },
      fontSize: {
        // Display scale (Barlow Condensed)
        "hero": ["90px", { lineHeight: "1",    fontWeight: "900" }],
        "h1":   ["60px", { lineHeight: "1.07", fontWeight: "900" }],
        "h2":   ["40px", { lineHeight: "1",    fontWeight: "700" }],
        "h3":   ["30px", { lineHeight: "1",    fontWeight: "700" }],
        "stat": ["40px", { lineHeight: "1",    fontWeight: "700" }],
        // Body scale (Barlow)
        "body-lg": ["18px", { lineHeight: "1.5", fontWeight: "400" }],
        "body":    ["16px", { lineHeight: "1.5", fontWeight: "400" }],
        "body-sm": ["14px", { lineHeight: "1.5", fontWeight: "400" }],
        "caption": ["12px", { lineHeight: "1.4", fontWeight: "500" }],
        "label":   ["16px", { lineHeight: "1",   fontWeight: "500" }],
      },
      borderRadius: {
        none: "0px",
        sm:   "4px",
        md:   "8px",
        lg:   "20px",    // Product gallery cards
        full: "9999px",  // Pills, dot indicators
        // Sobrescreve os padrões shadcn:
        DEFAULT: "8px",
      },
      boxShadow: {
        "text-dark":  "0px 0px 4.8px rgba(0,0,0,0.25)",
        "card":       "0px 8.5px 14.4px rgba(0,0,0,0.5)",
        "component":  "0px 0px 6.2px rgba(0,0,0,0.5)",
      },
      spacing: {
        // Tailwind já cobre a maioria — esses são os valores específicos do DS
        "container-pad": "170px",  // Padding horizontal das seções desktop
        "section":       "48px",   // Padding vertical de seção
      },
      maxWidth: {
        "content": "1100px",  // Largura máxima do conteúdo
        "site":    "1440px",  // Largura máxima do site
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## 2 · Global CSS

Cole no seu `src/app/globals.css` (ou equivalente):

```css
/* ── Fonts ──────────────────────────────────────────────────── */
/* Baixe os arquivos TTF de Google Fonts:
   https://fonts.google.com/specimen/Barlow
   https://fonts.google.com/specimen/Barlow+Condensed
   e coloque em public/fonts/ */

@font-face {
  font-family: "Barlow Condensed";
  src: url("/fonts/BarlowCondensed-Regular.ttf");
  font-weight: 400;
  font-display: swap;
}
@font-face {
  font-family: "Barlow Condensed";
  src: url("/fonts/BarlowCondensed-Medium.ttf");
  font-weight: 500;
  font-display: swap;
}
@font-face {
  font-family: "Barlow Condensed";
  src: url("/fonts/BarlowCondensed-Bold.ttf");
  font-weight: 700;
  font-display: swap;
}
@font-face {
  font-family: "Barlow Condensed";
  src: url("/fonts/BarlowCondensed-ExtraBold.ttf");
  font-weight: 800;
  font-display: swap;
}
@font-face {
  font-family: "Barlow Condensed";
  src: url("/fonts/BarlowCondensed-Black.ttf");
  font-weight: 900;
  font-display: swap;
}
@font-face {
  font-family: "Barlow";
  src: url("/fonts/Barlow-Regular.ttf");
  font-weight: 400;
  font-display: swap;
}
@font-face {
  font-family: "Barlow";
  src: url("/fonts/Barlow-Medium.ttf");
  font-weight: 500;
  font-display: swap;
}
@font-face {
  font-family: "Barlow";
  src: url("/fonts/Barlow-SemiBold.ttf");
  font-weight: 600;
  font-display: swap;
}
@font-face {
  font-family: "Barlow";
  src: url("/fonts/Barlow-Bold.ttf");
  font-weight: 700;
  font-display: swap;
}

/* ── shadcn CSS Variables — tema Stetsom ────────────────────── */
:root {
  --background:         255 255 255;
  --foreground:         9 9 11;
  --card:               255 255 255;
  --card-foreground:    9 9 11;
  --popover:            255 255 255;
  --popover-foreground: 9 9 11;

  /* Primary = brand red */
  --primary:            232 19 42;
  --primary-foreground: 255 255 255;

  /* Secondary = dark */
  --secondary:          18 18 18;
  --secondary-foreground: 255 255 255;

  --muted:              241 241 241;
  --muted-foreground:   102 102 102;

  --accent:             241 241 241;
  --accent-foreground:  18 18 18;

  --destructive:        220 38 38;
  --destructive-foreground: 255 255 255;

  --border:             217 217 217;
  --input:              217 217 217;
  --ring:               232 19 42;

  --radius: 0.5rem;  /* 8px — padrão dos cards */
}

.dark {
  --background:         9 9 11;
  --foreground:         255 255 255;
  --card:               18 18 18;
  --card-foreground:    255 255 255;
  --muted:              44 44 44;
  --muted-foreground:   184 184 184;
  --border:             44 44 44;
  --input:              44 44 44;
}

/* ── Utilitários de marca ───────────────────────────────────── */
.section-label {
  @apply flex items-center gap-2;
}
.section-label::before {
  content: "";
  @apply block w-6 h-px bg-brand-red flex-shrink-0;
}
.section-label span {
  @apply font-display font-medium text-sm uppercase tracking-wide text-brand-red;
}

/* Títulos de seção sempre em maiúsculas */
.section-title {
  @apply font-display font-bold uppercase leading-none;
}
```

---

## 3 · Overrides de Componentes shadcn

### Button (`components/ui/button.tsx`)

```tsx
import { cva } from "class-variance-authority";

const buttonVariants = cva(
  // Base — sharp, industrial, sem border-radius
  "inline-flex items-center justify-center gap-2 font-display font-bold uppercase tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Vermelho sólido — CTA principal
        default:     "bg-brand-red text-white hover:bg-red-700",
        // Escuro — "Garantia" nav button
        dark:        "bg-brand-dark text-white hover:bg-brand-black",
        // Outline — ações secundárias
        outline:     "border border-brand-dark text-brand-dark bg-transparent hover:bg-gray-100",
        // Ghost para links de texto
        ghost:       "text-brand-red bg-transparent hover:underline",
        // Destructive
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      },
      size: {
        sm:   "h-9 px-4 text-sm",    // 36px
        md:   "h-10 px-5 text-sm",   // 40px
        lg:   "h-12 px-8 text-base", // 48px — hero CTAs
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export { buttonVariants };
// resto do componente shadcn padrão...
```

### Badge (`components/ui/badge.tsx`)

```tsx
const badgeVariants = cva(
  "inline-flex items-center font-display font-bold uppercase text-xs",
  {
    variants: {
      variant: {
        default:  "bg-brand-red text-white px-2 py-0.5",
        dark:     "bg-brand-dark text-white px-2 py-0.5",
        outline:  "border border-gray-200 text-gray-700 px-2 py-0.5",
        new:      "bg-brand-red text-white px-2 py-0.5",  // "Novo"
      },
    },
    defaultVariants: { variant: "default" },
  }
);
```

### Card (`components/ui/card.tsx`)

```tsx
// Stetsom card — borda sutil, sem shadow por padrão
// Classe: rounded-md border border-gray-200 bg-white
// Hover: border-brand-red (via className condicional)

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-md border border-gray-200 bg-white transition-colors",
      className
    )}
    {...props}
  />
));
```

---

## 4 · Padrão "Section Label"

Use este componente em toda seção do site:

```tsx
// components/stetsom/SectionLabel.tsx
interface SectionLabelProps {
  label: string;       // Ex: "NOVIDADES"
  title: string;       // Ex: "CONHEÇA A PRATICIDADE"
  subtitle?: string;
  dark?: boolean;
}

export function SectionLabel({ label, title, subtitle, dark }: SectionLabelProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <div className="w-6 h-px bg-brand-red flex-shrink-0" />
        <span className="font-display font-medium text-label uppercase text-brand-red">
          {label}
        </span>
      </div>
      <h2 className={cn(
        "font-display font-bold text-h2 uppercase leading-none mt-0.5",
        dark ? "text-white" : "text-brand-dark"
      )}>
        {title}
      </h2>
      {subtitle && (
        <p className={cn(
          "font-body text-body mt-1",
          dark ? "text-gray-300" : "text-gray-600"
        )}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
```

---

## 5 · Layout das Seções

```tsx
// Wrapper padrão de seção (desktop)
<section className="px-[170px] py-12 max-w-site mx-auto">
  <div className="max-w-content mx-auto">
    {/* conteúdo */}
  </div>
</section>

// Seção escura
<section className="bg-brand-dark px-[170px] py-12">
  ...
</section>

// Seção off-white (FAQ, neutras)
<section className="bg-gray-50 px-[170px] py-12">
  ...
</section>
```

---

## 6 · Tipografia — Regras de Uso

| Elemento | Fonte | Peso | Tamanho | Caixa |
|---|---|---|---|---|
| Hero | Barlow Condensed | 900 | 90px | UPPERCASE |
| H1 | Barlow Condensed | 900 | 60px | UPPERCASE |
| H2 seção | Barlow Condensed | 700 | 40px | UPPERCASE |
| Section label | Barlow Condensed | 500 | 16px | UPPERCASE + vermelho |
| Stat número | Barlow Condensed | 700 | 40px | — |
| Nav links | Barlow | 600 | 16px | — |
| Body | Barlow | 400 | 16px | — |
| Captions | Barlow | 500 | 12–14px | — |
| CTA buttons | Barlow Condensed | 700 | 13–16px | UPPERCASE |

---

## 7 · Páginas & Componentes

| Rota | Componentes principais |
|---|---|
| `/` (Home) | Hero com carrossel, grid de Novidades, strip Nossa História + stats, Social grid, FAQ Accordion |
| `/produtos` | Hero, barra de filtros + busca, grid 4 colunas de ProductCard |
| `/produtos/[slug]` | Breadcrumb, galeria de imagens com thumbnails, tabela de specs, produtos relacionados |
| `/sobre` | Hero, texto + grid de stats, seção de valores |
| `/suporte` | Hero escuro, 3 cards de suporte, FAQ, mapa de distribuidores |

Veja o protótipo completo em `../ui_kits/website/index.html` para referência de layout, copy e interações.

---

## 8 · Assets

Copie de `../assets/` para `public/` do seu projeto:

| Arquivo | Uso |
|---|---|
| `logo.png` | Logotipo (158×35px) — nav e footer |
| `brand-image.png` | Logotipo marca (246×49px) — footer |
| `about-bg.png` | Foto fábrica/equipe — seção "Nossa História" |
| `products-hero.png` | Background hero página Produtos |
| `product-image.png` | Foto amplificador |
| `product-image-2.png` | Foto produto variante |

Fontes: copie de `../fonts/` para `public/fonts/`

---

## 9 · Referências

- Protótipo interativo: `../ui_kits/website/index.html`
- CSS tokens: `../colors_and_type.css`
- Documentação de design: `../README.md`
