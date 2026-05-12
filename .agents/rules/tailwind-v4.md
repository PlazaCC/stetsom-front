---
description: 'Use when writing styles, utility classes, or CSS. Covers Tailwind CSS v4 conventions and Stetsom brand tokens.'
applyTo: 'src/**/*.{ts,tsx,css}'
---

# Tailwind CSS v4

- Sem `tailwind.config.*` — toda configuração fica em `src/app/globals.css` dentro de `@theme inline`
- Tokens de cor da marca: `bg-brand` (vermelho), `bg-brand-dark` (preto), `bg-off-white` (branco suave), `text-brand`, `text-brand-dark`
- Nunca use valores arbitrários de cor como `bg-[#E8132A]` — verifique o token CSS primeiro
- Tipografia: `font-sans` (Barlow, corpo), `font-sans-condensed` (Barlow Condensed, headings e specs técnicas)
- Use `font-sans-condensed font-black uppercase` para headings de impacto e números de spec (ex: "3000W RMS")
- Layout de página: `px-8 lg:px-[170px] max-w-[1440px] mx-auto` — padrão de container
- Breakpoints responsivos: mobile-first; use `sm:`, `md:`, `lg:` para adaptar layout
