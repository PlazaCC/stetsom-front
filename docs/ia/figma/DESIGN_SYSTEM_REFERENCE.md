# Stetsom Front — Design System & Pattern Reference

Este documento é o **Oracle local** para Agentes de IA. Substitui consultas repetidas ao Figma MCP, convertendo dados brutos em padrões prontos para React (Next.js) + Tailwind CSS v4.

**Figma file:** `huD41oTL0FAa7xsNEK8tAM` | **Seção:** `Website` (node `1200:4302`)
**Mapa de páginas e seções:** `docs/ia/figma/PAGES_REFERENCE.md`
**Manifesto de assets locais:** `docs/ia/figma/assets-manifest.json`

## 1. Tokens de Cor (Color System)

A configuração oficial de tema está em `src/app/globals.css` dentro do bloco `@theme inline`.

| Token CSS                 | Tailwind          | Figma HEX | Uso por seção                                                |
| ------------------------- | ----------------- | --------- | ------------------------------------------------------------ |
| `var(--color-brand)`      | `bg-brand`        | `#E8132A` | CTAs primários, badges ativos, barra vermelha "nossas bases" |
| `var(--color-brand-dark)` | `bg-brand-dark`   | `#121212` | Seção "Qualidade Inovadora" (home), cards invertidos         |
| `var(--color-off-white)`  | `bg-off-white`    | `#F5F4F2` | Seções alternadas claras (FAQ, social medias, etc.)          |
| —                         | `bg-white`        | `#FFFFFF` | Header, cards, conteúdo principal                            |
| —                         | `bg-[#111111]`    | `#111111` | Footer (todas as páginas)                                    |
| —                         | `bg-[#DC2626]`    | `#DC2626` | Barra de stats/nossas bases (≈ `bg-brand`)                   |
| —                         | `bg-[#F8F8F8]`    | `#F8F8F8` | Área de info produto selecionado                             |
| —                         | texto `#B8B8B8`   | `#B8B8B8` | Texto secundário em fundos escuros                           |
| rgba(255,255,255,0.1)     | `border-white/10` | divider   | Bordas de seção/dividers                                     |

> Nunca use valores HEX arbitrários quando existe token CSS. Use `bg-brand` em vez de `bg-[#E8132A]`.

_Nota de Uso Contextual:_ Nunca aplique hardcoded cores HEX nas views (`bg-[#E8132A]`). Dependa SEMPRE das utilitárias Tailwind derivadas destas variáveis.

## 2. Tipografia (Typography)

As hierarquias de fonte mapeadas no Figma:

1. **Primary Sans**: `var(--font-barlow)` → `font-sans`
   - Corpo de texto, parágrafos, botões, labels, nav links (`fontWeight: 400, 18px`)
   - Subtítulos de seção (`fontWeight: 500, 20px`)

2. **Condensed Sans**: `var(--font-barlow-condensed)` → `font-sans-condensed`
   - Headings de impacto, títulos de página, valores de spec (`"3000W RMS"`)
   - Watermark BG "SOS": `font-sans-condensed font-black uppercase` — 263px desktop / 151px mobile, opacidade 8%
   - Título 404: `font-sans-condensed font-black uppercase text-[50px]`

| Uso                       | Classe Tailwind                                           |
| ------------------------- | --------------------------------------------------------- |
| Nav links                 | `font-sans text-lg text-[#565656]`                        |
| Body copy                 | `font-sans text-base font-normal`                         |
| Subtítulo hero            | `font-sans text-xl font-medium text-[#B8B8B8]`            |
| Section heading           | `font-sans-condensed font-black uppercase text-5xl`       |
| Spec values (RMS, Watts)  | `font-sans-condensed font-black uppercase`                |
| Watermark background text | `font-sans-condensed font-black uppercase opacity-[0.08]` |

## 3. Padrões de Layout e Espaçamento (Layout & Spacing)

Extraídos dos tokens `globalVars.styles` do Figma.

### Containers de Página

| Contexto        | Tailwind                                                                     | Figma token     |
| --------------- | ---------------------------------------------------------------------------- | --------------- |
| Desktop page    | `mx-auto max-w-[1440px] px-[170px]`                                          | `layout_GQAD44` |
| Mobile page     | `w-full px-5`                                                                | `layout_VA8JGO` |
| Desktop row nav | `flex flex-row justify-between items-center py-6`                            | `layout_LRI7ND` |
| Mobile row nav  | `flex flex-row justify-between items-center px-5 py-4`                       | `layout_7YFEAI` |
| Footer desktop  | `flex flex-row flex-wrap gap-x-[164px] gap-y-9 px-[100px] py-6 bg-[#111111]` | `layout_MQ9V8W` |
| Footer mobile   | `flex flex-col gap-9 px-5 py-6 bg-[#111111]`                                 | `layout_06C7QX` |

### Seções de Conteúdo

| Contexto                    | Tailwind                                                          | Figma token     |
| --------------------------- | ----------------------------------------------------------------- | --------------- |
| Seção padrão desktop        | `flex flex-col gap-6 px-[170px] py-12`                            | `layout_1ST56N` |
| Seção padrão mobile         | `flex flex-col gap-6 px-0 py-9`                                   | `layout_BD9UNP` |
| Hero banner desktop         | `relative w-full h-[700px]` (home)                                | `layout_RGY4BZ` |
| Hero banner desktop (inner) | `relative w-full h-[336px]` (produtos/suporte)                    | `layout_YA6EFF` |
| Grid de produtos desktop    | `flex flex-row gap-9 flex-wrap`                                   | `layout_QHQ145` |
| Timeline desktop            | `flex flex-row gap-9 px-0 py-12 w-[1100px]`                       | `layout_TL6P5T` |
| Stats bar (nossas bases)    | `flex flex-row justify-center items-center gap-9 py-1.5 bg-brand` | `layout_DH1V5O` |

### Espaçamentos Frequentes

- `gap-4` (16px) — gaps menores: breadcrumb, badges, nav links
- `gap-6` (24px) — gap padrão entre seções e cards
- `gap-9` (36px) — gap entre blocos maiores, footer columns
- `py-12` (48px) — padding vertical de seções desktop
- `py-9` (36px) — padding vertical de seções mobile

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

## 6. Assets Offline (Sem MCP em loop)

Para manter o fluxo local sem depender do Figma MCP a cada iteração:

- Use `docs/ia/figma/assets-manifest.json` como fonte de verdade para imagens locais.
- Resolva qualquer imagem por `styleRef` (ex: `fill_XJ1M1B`) ou por `nodeId`.
- Consuma `relativePath` do manifesto como URL pública (ex: `/figma-assets/raw/fill_XJ1M1B_d8060e22.png`).
- Consulte `dimensions` para definir placeholders e evitar layout shift.
- Só recorra ao MCP quando um novo node/style ainda não existir no manifesto.

### Imagens Principais Mapeadas

| Uso                         | imageRef (SHA)                             | Fill token                                    |
| --------------------------- | ------------------------------------------ | --------------------------------------------- |
| Hero home (carousel bg)     | `e95c6db48356b62dbb7aefdd2d4cfb3624c95d59` | `fill_QPGB3Q` (desk) / `fill_RT307M` (mobile) |
| Hero produtos/suporte/sobre | `6a0a1876e7a45ba7189675a049ad45fe670394d2` | `fill_QDUJ2M` / `fill_M5AJUV` / `fill_4DQMA5` |
| Produto detail (mobile bg)  | `935c60d8affac67c4de0490e01942f71b20a85f8` | `fill_LEJYBF`                                 |
| Fábrica / Mapa (sobre)      | `b3596ec5433f770d4d9fd82c2a7c2631bbf56674` | `fill_FH61XV` / `fill_UGV0H2`                 |
| Logo Stetsom                | `d8060e226208050ea1fe84f1fd0bd8e62d2a1beb` | `fill_XJ1M1B`                                 |

---

## 7. Estrutura de Páginas

Consulte `docs/ia/figma/PAGES_REFERENCE.md` para:

- Node IDs de cada frame (desktop + mobile) por página
- Lista de seções com node ID e background correspondente
- Componentes-chave por seção
- Referência cruzada de imagens por página

Resumo de frames principais:

| Página              | Desktop nodeId | Mobile nodeId |
| ------------------- | -------------- | ------------- |
| Home                | `1200:4584`    | `1200:4304`   |
| Produtos            | `1200:4982`    | `1200:4766`   |
| Produto Selecionado | `1200:5666`    | `1200:5391`   |
| Sobre               | `1200:6180`    | `1200:5944`   |
| Suporte             | `1200:6454`    | `1200:6785`   |
| 404                 | `1200:7086`    | `1200:7151`   |
