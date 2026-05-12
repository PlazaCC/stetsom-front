---
description: 'Use when styling any component, adding Tailwind classes, or writing CSS. Master checklist covering the full styling decision tree for Stetsom Front.'
applyTo: 'src/**/*.{ts,tsx,css}'
---

# Styling Practices

Siga esta hierarquia ao estilizar qualquer elemento. A ordem importa.

## 1. Cores — token semântico primeiro, nunca hardcode

❌ `text-[#565656]`, `bg-[rgb(18,18,18)]`, `border-[#ddd]`, `style={{ color: '#...' }}`  
✅ `text-muted-foreground`, `bg-brand-dark`, `border-zinc-200`

- Consulte `tailwind-v4.md` para a tabela completa de tokens de cor do projeto.
- Para novo tom que não existe: adicione em `src/app/globals.css` seguindo o padrão `:root { --x: valor } @theme inline { --color-x: var(--x) }`. Nunca espalhe hex/rgb nos componentes.

## 2. Dimensões — canonical class, nunca `[Npx]`

Tailwind v4 suporta decimais → `N px` = `N/4` units. **Não existe `[Npx]` que não tenha canônico** para h, w, p, m, gap, leading, max-*, min-*, inset, etc.

❌ `h-[45px]`, `px-[170px]`, `leading-[32px]`, `w-[250px]`  
✅ `h-11.25`, `px-42.5`, `leading-8`, `w-62.5`

Consulte `tailwind-canonical.md` para a tabela e a lista de exceções reais (`rounded-[Npx]`, `tracking-[Npx]`, `text-[Npx]` não-padrão, `shadow-[...]`).

## 3. Font sizes — escala nomeada ou token customizado

- Use a escala nomeada do Tailwind: `text-xs`, `text-sm`, `text-base` … `text-9xl`
- Para tamanhos específicos do Stetsom: `text-2xs`, `text-button-md`, `text-section-title`, `text-display-sm/lg/xl/2xl`
- `text-[Npx]` só é válido para tamanhos fora da escala nomeada (`text-[15px]`, `text-[32px]`, etc.) — esses ficam como arbitrários pois `text-` não usa a escala de espaçamento

## 4. Tipografia — fontes via classe, nunca inline

- `font-sans` → Barlow (corpo, parágrafos, labels)
- `font-sans-condensed font-black uppercase` → headings de impacto, specs técnicas ("3000W RMS")
- Nunca defina `fontFamily` via `style={{}}` ou `font-[...]`

## 5. Grays e utilitários padrão

- Prefira classes nativas do Tailwind: `zinc-200`, `zinc-400`, `zinc-500`, `neutral-400`, `white/10`
- Evite misturar escalas (`gray-*` e `zinc-*` no mesmo componente)
- Para superfícies escuras: `bg-brand-dark` (fundo principal) ou `bg-surface-elevated` (card elevado)

## 6. Antes de adicionar qualquer valor novo

1. Existe token no tema? → usa o token
2. É uma dimensão? → converte para canônico (`N/4`)
3. É uma cor sem token? → adiciona em `globals.css`, não no componente
4. O valor se repete em ≥ 2 lugares? → cria token; não copia o hardcode
