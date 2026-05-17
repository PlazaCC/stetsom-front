---
description: 'Use when adding UI text, translations, locale routing, language switching, or any user-facing string. Covers next-intl v4 usage, locale threading, mock data globalization, and the current backend-less architecture.'
applyTo: 'src/**/*.{ts,tsx}'
---

# i18n & Multi-language Guidelines

## Biblioteca: next-intl v4

Este projeto usa **next-intl v4** com App Router, RSC-first, `localePrefix: 'always'`.

- Locales suportados: `pt-BR` (padrão), `en`, `es`
- Todas as URLs têm prefixo: `/pt-BR/produtos`, `/en/produtos`, `/es/produtos`
- Arquivos de configuração: `src/i18n/routing.ts`, `src/i18n/request.ts`, `src/i18n/navigation.ts`
- Mensagens: `src/i18n/messages/{pt-BR,en,es}.json`

---

## Regras de uso de traduções

### Server Components (async)
```ts
import { getTranslations } from 'next-intl/server'
const t = await getTranslations('Namespace')
```

### Client Components (`'use client'`)
```ts
import { useTranslations } from 'next-intl'
const t = useTranslations('Namespace')
```

### Locale atual
- **Server Component**: `import { getLocale } from 'next-intl/server'` → `await getLocale()`
- **Client Component**: `import { useLocale } from 'next-intl'` → `useLocale()`

### Links e navegação locale-aware
- **Sempre** importar `Link`, `useRouter`, `usePathname` de `@/i18n/navigation` — nunca de `next/link` ou `next/navigation` diretamente
- O `Link` de `@/i18n/navigation` adiciona o prefixo de locale automaticamente

---

## Todo texto visível ao usuário vai nos arquivos de mensagem

- **Nunca** hardcode strings em PT (ou qualquer idioma) em componentes
- Todo texto UI — labels, placeholders, títulos, mensagens de erro, aria-labels — deve estar em `src/i18n/messages/*.json`
- Ao adicionar um novo namespace ou chave, adicionar nos **3 arquivos** simultaneamente (pt-BR, en, es)
- Conteúdo dinâmico vindo da API/mock (nomes de produtos, descrições) é localizado na camada de dados, não nos arquivos de mensagem

---

## Namespaces de mensagens — estrutura atual

| Namespace | Arquivo de origem | Cobertura |
|---|---|---|
| `Nav` | header.tsx | Links de nav + menu de categorias |
| `Header` | header.tsx | Placeholder de busca |
| `Footer` | footer.tsx | Colunas, copyright, links legais |
| `Catalog` | catalog-content.tsx, catalog-sidebar.tsx | Tudo no catálogo |
| `ProductDetail` | product-detail-content.tsx, block-renderer.tsx | Página de produto |
| `Support.*` | suporte/_components/* | Contato, FAQ, documentação, postos |
| `About` | sobre/page.tsx, our-foundations.tsx | Página sobre |
| `NotFound` | not-found.tsx | Página 404 |
| `LanguageSwitcher` | language-switcher.tsx | Labels do seletor |
| `Meta` | layouts | Títulos e descrições SEO |

---

## Locale threading pela stack de dados

O locale flui de cima para baixo sem context global:

```
[locale] page param
  → server.ts (tryGetLocale / param explícito)
    → provider-contract.ts (locale?: string em todos os métodos)
      → mock-provider.ts / remote-provider.ts
        → catalog-i18n.ts / site-i18n.ts / support-i18n.ts
```

- `server.ts` usa `tryGetLocale()` (wrapper seguro de `getLocale()`) para RSC
- API routes não têm contexto next-intl — leem locale do query param `?locale=xx`
- React Query hooks incluem locale na `queryKey` para re-fetch automático na troca

---

## Status atual: back-end simulado com mocks

**O back-end Fastify ainda não existe.** Todo dado da API é gerado localmente no código.

### Arquitetura dos mocks
```
src/lib/mock/
  catalog.ts          → dados base (PT-BR, slugs, IDs, assets)
  catalog-i18n.ts     → getCatalogCategoriesForLocale / getCatalogProductsForLocale / getCatalogBlocksForLocale
  site.ts             → dados base home/about
  site-i18n.ts        → getHomeHeroSlides / getAboutHeroSection / ... (locale-aware)
  support.ts          → dados base suporte
  support-i18n.ts     → getSupportPayloadForLocale (locale-aware)
```

### Regras para mocks localizados
- `src/lib/mock/*.ts` contém os dados em PT-BR como fonte de verdade
- `src/lib/mock/*-i18n.ts` exporta funções `get*ForLocale(locale?: string)` com variantes EN/ES
- O `mock-provider.ts` chama sempre as funções `-i18n`, nunca os arrays brutos, para dados visíveis ao usuário
- Badge de produto: traduzir (`LANÇAMENTO` → `NEW`/`LANZAMIENTO`, `DESTAQUE` → `FEATURED`/`DESTACADO`)
- Nomes de produtos (brand names como "ST-4000EQ") não são traduzidos
- Slugs e IDs nunca são traduzidos — são sempre em formato URL-safe inglês/neutro

### Quando o back-end real chegar
- Trocar o provider em `src/lib/api/provider.ts` de `createMockCmsProvider` para `createRemoteCmsProvider`
- O `remote-provider.ts` já envia `?locale=xx` em todos os endpoints
- Os arquivos de mock ficam intactos — servem como contrato e referência

---

## Filtro de produtos por mercado

`Product.markets?: string[]` — campo opcional para ocultar produtos em determinados locales:

```ts
markets: ['pt-BR']          // visível apenas no Brasil
markets: ['en', 'es']       // visível em EN e ES, oculto em PT-BR
markets: undefined           // visível em todos (comportamento padrão)
```

A filtragem ocorre em `isVisibleInLocale()` no `mock-provider.ts`.

---

## Checklist ao adicionar novo conteúdo traduzível

- [ ] String adicionada nos 3 arquivos de mensagem (pt-BR · en · es)
- [ ] Componente usa `useTranslations` (client) ou `getTranslations` (server)
- [ ] Se vier de mock: função `-i18n.ts` criada/atualizada com variantes EN/ES
- [ ] Se vier de API route: rota aceita `?locale=xx` e passa para `server.ts`
- [ ] React Query queryKey inclui locale se o dado muda por idioma
- [ ] `pnpm tsc --noEmit` e `pnpm lint` passam sem erros
