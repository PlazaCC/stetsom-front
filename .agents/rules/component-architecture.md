---
description: 'Use when creating, moving, or refactoring React components. Covers component folder structure (components/ui vs components vs _components), dummy/presentational components, composable vs monolithic pattern, file size limits, !important prohibition, and subcomponent extraction.'
applyTo: 'src/**/*.{ts,tsx}'
---

# Component Architecture

---

## Estrutura de Pastas — Três Destinos

```
src/components/ui/        ← Primitivos globais reutilizáveis
src/components/           ← Infraestrutura (providers, wrappers)
src/app/[rota]/_components/ ← Co-localizados na rota
```

### `src/components/ui/` — Primitivos globais

- Destino de `shadcn add` e de extensões de primitivos shadcn
- Componentes dummy reutilizáveis em 2+ rotas
- Sem lógica de negócio, sem chamadas a hooks de dados
- Exemplos corretos: `button.tsx`, `navigation-menu.tsx`, `product-card.tsx`, `container.tsx`

```tsx
// ✅ Componente em components/ui/ — dummy, sem efeitos colaterais
export function ProductCard({ product, className }: ProductCardProps) {
  return <div className={cn("...", className)}>...</div>
}
```

### `src/components/` — Infraestrutura

- Apenas componentes sem UI visual própria: providers, wrappers de contexto, feature flags
- Exemplos corretos: `query-provider.tsx`, `theme-provider.tsx`
- Nunca criar componentes visuais aqui

### `src/app/[rota]/_components/` — Co-localizados

- Seções específicas de uma única rota
- Podem conter lógica de dados (hooks, queries) porque são containers de rota
- Não devem ser importados por outras rotas
- Se um componente de `_components/` for usado por 2+ rotas → mover para `components/ui/`

---

## Componentes Dummy (Apresentacionais)

Componentes em `components/ui/` devem ser apresentacionais:

- Recebem dados via props, renderizam UI
- Sem `useQuery`, `useCatalogProducts`, ou outros hooks de dados
- Sem efeitos colaterais de negócio
- `useRouter` e `usePathname` apenas em componentes de navegação explícitos (Header, LanguageSwitcher)

```tsx
// ❌ Lógica de dados em primitivo
export function FeaturedProducts() {
  const { data } = useCatalogProducts() // dados devem vir de props
  ...
}

// ✅ Dados chegam via props — container na rota faz o fetch
export function FeaturedProducts({ products }: FeaturedProductsProps) {
  return <div>...</div>
}
```

---

## Composição — Quando Agrupar Primitivos

Agrupar primitivos em `components/ui/` **somente** quando o grupo é composable: múltiplas partes intercambiáveis que fazem sentido usadas individualmente.

**Referência positiva:** `navigation-menu.tsx` expõe `NavigationMenuRoot`, `NavigationMenuList`, `NavigationMenuItem`, `NavigationMenuTrigger`, `NavigationMenuContent` — cada parte é usável de forma independente.

```tsx
// ✅ Composable — partes separadas e independentes
<NavigationMenuRoot>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuTrigger>Produtos</NavigationMenuTrigger>
      <NavigationMenuContent>...</NavigationMenuContent>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenuRoot>
```

**Nunca** agrupar lógica de uma feature específica dentro de um primitivo de `components/ui/`.

---

## Tamanho de Arquivo e Extração de Subcomponentes

| Situação | Ação |
|---|---|
| Arquivo > 150 linhas | Avaliar extração de subcomponentes |
| Subcomponente com estado/efeito próprio | Extrair para arquivo separado obrigatoriamente |
| Subcomponente puramente visual sem lógica, não reutilizável | Pode ficar no arquivo como função auxiliar interna (abaixo do export principal) |
| Subcomponente reutilizável em 2+ lugares | Sempre extrair para arquivo próprio em `components/ui/` |

**Exemplo de subcomponente interno legítimo** (sem lógica, não reutilizável):
```tsx
// Ao final do arquivo, após o export principal
function CategoryItem({ name, image }: { name: string; image: string }) {
  return <div className="flex items-center gap-2">...</div>
}
```

**Exemplo de extração obrigatória** (tem estado próprio):
```tsx
// ❌ MobileDrawer com useState embutido no Header — extrair
// ✅ src/components/ui/mobile-drawer.tsx
```

---

## Proibição de `!important`

**Nunca** usar `!important` em componentes React ou em estilos de componentes.

```tsx
// ❌ Em className
<div className="!text-brand !bg-white" />

// ❌ Em style inline
<div style={{ color: 'red !important' }} />
```

**Para sobrescrever estilos de bibliotecas terceiras** (Swiper, etc.): isolar em bloco CSS dedicado em `globals.css` com comentário identificando a biblioteca e o motivo:

```css
/* Swiper pagination — overrides necessários por especificidade da lib */
.hero-carousel .swiper-pagination-bullet {
  /* usar especificidade de seletor, não !important quando possível */
  width: 10px;
  height: 10px;
}
```

Preferir aumentar especificidade de seletor em vez de `!important`. Reservar `!important` apenas quando a biblioteca force inline styles (caso raro — documentar com comentário).

---

## Padrão Composable vs Monolítico

| Padrão | Onde usar | Exemplo |
|---|---|---|
| **Composable** | `components/ui/` | `navigation-menu.tsx`, `accordion.tsx` |
| **Atômico** | `components/ui/` | `button.tsx`, `product-card.tsx`, `container.tsx` |
| **Monolítico (container)** | `_components/` de rota | `catalog-content.tsx`, `hero-carousel.tsx` |

**Regra simples:** se alguém vai `import` o componente em `components/ui/` e usá-lo em contextos diferentes, ele deve ser composable ou atômico — nunca um bloco monolítico cheio de lógica de negócio.
