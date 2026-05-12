# Stetsom Front — Design System & Pattern Reference

Este documento serve como a **Bela de Verdade** (Oracle) local para os Agentes de IA. Ele substitui a necessidade de iterar sobre a API do Figma (MCP) o tempo todo, convertendo as definições brutas do JSON do Figma em padrões abstratos fáceis de aplicar em React (Next.js) + Tailwind CSS v4.

## 1. Tokens de Cor (Color System)

A configuração oficial de tema encontra-se sempre baseada em `src/app/globals.css` utilizando o padrão `@theme inline`.

- **Primary / Brand Red**: `var(--color-brand)` -> `bg-brand` / `text-brand`
  - _Uso_: Call-to-actions principais, badges de destaque, elementos interativos ativos. (Figma equivalente: `#E8132A` aproximações em backgrounds escuros)
- **Brand Dark**: `var(--color-brand-dark)` -> `bg-brand-dark` / `text-brand-dark`
  - _Uso_: Backgrounds primários modo escuro, cards de produto invertidos, painel Footer. (Figma equivalente: `#121212`, `#222222`, `#444444` usados em grids)
- **Off White**: `var(--color-off-white)` -> `bg-off-white` / `text-off-white`
  - _Uso_: Contrastes para texto, sub-textos em painéis pretos. (Figma equivalente: `#F5F4F2`, `#FFFFFF`, ou rgba(255, 255, 255, 0.1) / branco com opacidade para dividers).

_Nota de Uso Contextual:_ Nunca aplique hardcoded cores HEX nas views (`bg-[#E8132A]`). Dependa SEMPRE das utilitárias Tailwind derivadas destas variáveis.

## 2. Tipografia (Typography)

As hierarquias de fonte mapeadas no Figma:

1.  **Primary Sans**: `var(--font-barlow)` -> `font-sans`
    - _Uso_: Corpo de texto, parágrafos, botões e labels gerais.
2.  **Condensed Sans**: `var(--font-barlow-condensed)` -> `font-sans-condensed`
    - _Uso_: Títulos, Headings em páginas, banners impactantes, valores de número RMS ex: "3000W RMS".

## 3. Padrões de Layout e Espaçamento (Layout & Spacing)

Extraídos dos estilos globais do Figma (ex: `layout_OWFNHZ`, `layout_TA6G3L`):

- **Paddings Horizontais Universais**: Telas responsivas possuem geralmente `px-5` (20px ou `1.25rem` convertendo) ou usam o wrapper `<Container>` de `src/components/ui/container.tsx`.
- **Alinhamento (Row/Column)**:
  - Vários componentes no Figma usam Flexbox com espaçamento entre elementos (alinhamentos space-between, gap 16px/1rem -> `gap-4`).
  - _Sintaxe Tailwind Preferida_: `flex flex-col items-center gap-4` para verticais e `flex flex-row items-center justify-between` para horizontais (headers, navigations).
- **Max Widths**: Viewports mobile definidos como `375px` na raiz do frame são abstraídos para design responsivo (`w-full max-w-[375px]` em componentes restritos, ou dependendo da grid do browser para fluidos).

## 4. Componentes Primitivos (Component Mapping)

Baseado no dump de `components.json`:

### 4.1. Buttons

Variantes abstraídas dos component sets (`21:210`, `21:4062`, etc):

- **Size**: `xs`, `sm`, `md`, `big` (Mapeie para propriedades tailwind fixas no componente de botão, ex: `h-8 px-3 text-xs` para `sm`).
- **Variants**:
  - `Primary` (bg-brand text-white)
  - `Outline` (border-brand text-brand ou border-gray/white text-white baseado no contexto dark)
  - `Ghost` / `Default` (Sem fundo para tabs ou seleção).
- **States**: Normal, Hover, Selected=True/False (Mapeado no frontend usando `data-[state=active]` Radix/Base-ui ou classes `hover:bg-brand/90`).

### 4.2. Ícones

O Figma utiliza a biblioteca **Lucide Icons** explicitamente.

- _Ícones Notáveis Mapeados_: `search`, `plus`, `arrow-right`, `chevron-down`, `check`, `panel-left`, `refresh-ccw`, `sliders-horizontal`, `blocks`.
- _Uso_: `<ArrowRight className="size-4" />` importado de `lucide-react`.

### 4.3. Navigation & Feedback

- **Accordion** (ID: `890:10459`): Use o componente base do shadcn já presente em `src/components/ui/accordion.tsx`.
- **Breadcrumb** (ID: `74:11593`): Navegação hierárquica baseada em Flexbox + Chevrons.
- **Badges** (`1036:9871`, `size=xs`, `size=normal`): Componente de pílulas para RMS/características técnicas. Mapear para um `<Badge>` genérico com `rounded-full px-2 py-0.5 text-xs bg-muted text-muted-foreground` tipicamente.

## 5. Práticas de "Hand-off" (Como a IA deve proceder)

Em vez de deduzir pelo código base do backend:

1. Acesse os artefatos `docs/ia/figma/*.json` somente para inspecionar novos IDs caso este arquivo não contemple uma nova regra.
2. Use `<Container>` para limitar o wrap da tela nas seções.
3. Seções devem ter nomes semânticos correspondentes ao Figma e separadas em `_components/` (ex: `hero-carousel.tsx`, `nossa-historia.tsx`).
4. Quebre Layouts usando Flex e Grid sistematicamente usando espaçamentos consistentes do Tailwind v4 (`gap-4`, `gap-8`, `p-6`).
