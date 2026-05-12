# task-13: Design Token Foundation — Tokens de cor, tipografia e espaçamento

**Status:** DONE
**Priority:** 1 — Fundação; deve ser executada antes de qualquer componente novo
**Branch:** feat/task-02-header-figma-fidelity
**Created:** 2026-05-12
**Needs design pass:** NO

## Objective

Criar/ajustar todos os tokens de design em `globals.css` seguindo **o padrão shadcn** (valores definidos em `:root`, referenciados via `var()` em `@theme inline`), e substituir todos os valores hardcoded nos componentes já criados.

## Abordagem correta — padrão shadcn

A abordagem NÃO é criar tokens arbitrários com nomes descritivos de cor (`--nav-link`, `--footer-bg`, etc.). A abordagem correta é:

1. **Remapear tokens semânticos shadcn existentes** para os valores do design Stetsom (ex: `--muted-foreground` passa a ser `#565656` para links de nav)
2. **Adicionar tokens necessários** seguindo o mesmo padrão `:root` → `@theme inline var()`, com nomes semânticos (não de cor)
3. **Usar Tailwind built-ins** onde os valores coincidem (`bg-zinc-100`, `text-zinc-500`, etc.)
4. **Adicionar tokens de tipografia** (`--text-2xs`, `--text-button-md`, etc.) como extensões de utilidade Tailwind v4 em `@theme inline`

## O que foi implementado

### `globals.css` — `:root` remapeamentos

```css
/* Tokens shadcn remapeados para valores Stetsom */
--card: oklch(0.975 0 0);              /* #F8F8F8 — bg-card para product cards, surfaces */
--muted: oklch(0.942 0 0);             /* #F0F0F0 — bg-muted para placeholder bg */
--muted-foreground: oklch(0.37 0 0);   /* #565656 — text-muted-foreground para nav links, copyright */

/* Tokens Stetsom adicionados (padrão :root → @theme inline var()) */
--text-subtle: oklch(0.42 0 0);        /* rgb(102,102,102) — text-text-subtle */
--text-subtle-dark: oklch(0.73 0 0);   /* rgb(184,184,184) — text-text-subtle-dark */
--surface-elevated: oklch(0.22 0 0);   /* rgb(31,31,31) — bg-surface-elevated */
--icon-muted: oklch(0.50 0 0);         /* #767676 — text-icon-muted */
```

### `globals.css` — `@theme inline` adições

```css
/* Corrigido: tokens existentes agora usam var() em vez de valor direto */
--color-text-subtle: var(--text-subtle);
--color-text-subtle-dark: var(--text-subtle-dark);
--color-surface-elevated: var(--surface-elevated);
--color-icon-muted: var(--icon-muted);

/* Tipografia — tamanhos não presentes no Tailwind default */
--text-2xs: 0.6875rem;        /* 11px */
--text-button-md: 0.8125rem;  /* 13px */
--text-section-title: 1.375rem; /* 22px */
--text-display-sm: 2.5rem;    /* 40px */
--text-display-lg: 3.5rem;    /* 56px */
--text-display-xl: 4rem;      /* 64px */
--text-display-2xl: 5rem;     /* 80px */

/* Espaçamento */
--spacing-logo-nav: 3.1875rem;   /* 51px — gap logo↔nav no header */
```

## Mapeamento completo hardcoded → token

| Hardcoded | Substituído por | Origem |
|---|---|---|
| `text-[#565656]` / `text-[rgb(86,86,86)]` | `text-muted-foreground` | shadcn remapeado |
| `bg-[rgb(17,17,17)]` / `bg-[rgb(9,9,11)]` | `bg-brand-dark` | token existente |
| `text-[rgb(184,184,184)]` | `text-text-subtle-dark` | token Stetsom |
| `text-[rgb(102,102,102)]` | `text-text-subtle` | token Stetsom |
| `bg-[rgb(248,248,248)]` | `bg-card` | shadcn remapeado |
| `bg-[rgb(240,240,240)]` | `bg-muted` | shadcn remapeado |
| `bg-[rgb(40,40,40)]` | `bg-surface-elevated` | token Stetsom |
| `border-[rgb(80,80,80)]` | `border-zinc-600` | Tailwind built-in |
| `border-[rgb(44,44,44)]` | `border-white/10` | Tailwind opacity |
| `border-[#999999]` | `border-neutral-400` | Tailwind built-in |
| `text-[rgb(133,133,133)]` | `text-zinc-400` | Tailwind built-in |
| `bg-[rgb(244,244,245)]` | `bg-zinc-100` | Tailwind built-in |
| `text-[#09090B]` | `text-foreground` | shadcn token |
| `text-[rgb(113,113,122)]` | `text-zinc-500` | Tailwind built-in |
| `color='var(--color-icon-muted)'` (inline) | `text-icon-muted` (class) | token Stetsom |
| `gap-[51px]` | `gap-logo-nav` | spacing token |
| `text-[11px]` | `text-2xs` | tipografia custom |
| `text-[13px]` | `text-button-md` | tipografia custom |
| `text-[18px]` | `text-lg` | Tailwind built-in |
| `text-[14px]` | `text-sm` | Tailwind built-in |
| `text-[12px]` | `text-xs` | Tailwind built-in |
| `text-[22px]` | `text-section-title` | tipografia custom |
| `text-[40px]` | `text-display-sm` | tipografia custom |
| `text-[48px]` | `text-5xl` | Tailwind built-in |
| `text-[56px]` | `text-display-lg` | tipografia custom |
| `text-[60px]` | `text-6xl` | Tailwind built-in |
| `text-[64px]` | `text-display-xl` | tipografia custom |
| `text-[72px]` | `text-7xl` | Tailwind built-in |
| `text-[80px]` | `text-display-2xl` | tipografia custom |

## Acceptance Criteria — Status

- [x] `grep -rn 'text-\[#\|bg-\[#\|border-\[#\|text-\[rgb\|bg-\[rgb\|border-\[rgb' src/` retorna zero resultados
- [x] Tokens em `:root` + `@theme inline` seguem o padrão shadcn com `var()` references
- [x] Todos os hardcoded da auditoria substituídos
- [x] Tailwind built-ins usados onde possível
- [x] `pnpm tsc --noEmit` passa sem erros novos
