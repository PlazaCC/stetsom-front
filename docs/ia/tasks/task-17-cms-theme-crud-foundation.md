# task-17: CMS Theme Foundation + CRUD Component System

**Status:** REVIEW
**Branch:** feat/cms-theme-crud-foundation
**Created:** 2026-05-20
**Needs design pass:** NO (Figma já inspecionado via MCP durante brainstorm)

## Objective

Isolar o tema do CMS do site público via CSS scoping e construir os primitivos de CRUD reutilizáveis que tornam cada nova tela uma composição de blocos, não código do zero.

## Figma Reference

- **Final CMS page:** `huD41oTL0FAa7xsNEK8tAM` → node `1200:7895`
- **Login:** `1200:9627` — split panel, form branco + painel escuro `#323232` + imagem
- **Produtos (lista):** `1200:10270` — sidebar 240px + main panel 1097px, bg `#E8ECFB`
- **Produtos (wizard):** `1200:10501` — steps bar + form 731px + right panel 388px
- **Biblioteca:** `1200:8634` — padrão de listagem com tabela

## Tokens Figma (a implementar)

| Token CSS | Hex | oklch | Uso |
|---|---|---|---|
| `--cms-bg` | `#E8ECFB` | `oklch(0.94 0.019 261)` | Page background todas as telas |
| `--cms-bg-alt` | `#F2F3F7` | `oklch(0.96 0.008 258)` | Dashboard home |
| `--cms-panel` | `#FAFAFA` | `oklch(0.98 0 0)` | Sidebar + cards + panels |
| `--cms-border` | `#E4E4E7` | `oklch(0.90 0.002 264)` | Bordas de painel |
| `--cms-overlay` | `rgba(142,142,142,0.4)` | — | Overlay de modal/drawer |
| `--cms-active-item` | `#E7EEFD` | `oklch(0.95 0.028 249)` | Nav item ativo + tab ativo |
| `--cms-step-done` | `#16A34A` | `oklch(0.648 0.15 162)` | Círculo de step completo |
| `--cms-step-pending` | `#F4F4F5` | `oklch(0.97 0 0)` | Círculo de step pendente |

## Acceptance Criteria

- [x] `src/app/admin/admin.css` existe com seletor `.cms {}` sobrescrevendo 6 tokens shadcn — mudança no site público não afeta o CMS
- [x] `admin/layout.tsx` aplica `className="cms"` no wrapper raiz e importa `admin.css`
- [x] Sidebar: `w-60` (240px), shadow `0 0 8.8px rgba(0,0,0,0.2)`, `border-r border-border`, tokens via CSS vars sem hardcode
- [x] `AdminPanel` existe em `_components/admin-panel.tsx` — `bg-card border border-border rounded-[16px]`
- [x] `AdminListPage` + `AdminActionBar` + `AdminDataTable` + `AdminEmptyState` compostos e funcionais
- [x] `AdminWizardPage` + `AdminStepIndicator` + `AdminFormPage` + `AdminFormSection` existem
- [x] `AdminFileUpload` existe com variação básica (drop zone + preview de lista)
- [x] `AdminConfirmDialog` existe como modal overlay leve sem dependência extra
- [x] Página de login refatorada: layout split com form `#FAFAFA` à esquerda + painel `#323232` à direita
- [x] `docs/ia/figma/meta.json` atualizado com node IDs das telas CMS finais + tokens de design
- [x] `pnpm tsc --noEmit` e `pnpm lint` passam sem erros

## In Scope

- `src/app/admin/admin.css` — arquivo CSS com tema scoped `.cms {}`
- `:root` em `globals.css` — 8 tokens `--cms-*` como raw values
- `admin/layout.tsx` — refatoração: `className="cms"`, import do `admin.css`, padding correto
- `src/app/admin/login/page.tsx` — layout split fiel ao Figma
- `src/app/admin/_components/admin-panel.tsx` — card base
- `src/app/admin/_components/admin-page-header.tsx` — título + slot de ação
- `src/app/admin/_components/admin-sidebar.tsx` — sidebar refatorada (extrair de `layout.tsx`)
- `src/app/admin/_components/crud/admin-list-page.tsx`
- `src/app/admin/_components/crud/admin-action-bar.tsx`
- `src/app/admin/_components/crud/admin-data-table.tsx` (shadcn Table + TanStack)
- `src/app/admin/_components/crud/admin-search-input.tsx`
- `src/app/admin/_components/crud/admin-empty-state.tsx`
- `src/app/admin/_components/crud/admin-wizard-page.tsx`
- `src/app/admin/_components/crud/admin-step-indicator.tsx`
- `src/app/admin/_components/crud/admin-form-page.tsx`
- `src/app/admin/_components/crud/admin-form-section.tsx`
- `src/app/admin/_components/crud/admin-file-upload.tsx`
- `src/app/admin/_components/crud/admin-confirm-dialog.tsx`
- Páginas existentes (`produtos/page.tsx`, `usuarios/page.tsx`) atualizadas para usar os novos primitivos

## Out of Scope

- Implementar Mantine UI
- Páginas completas de Banners, Biblioteca, Histórico, Mensagens
- Formulários específicos de Produto com campos reais e validação
- Upload real de arquivos (somente UI)
- Dark mode do CMS

## Implementation Notes

### Isolamento de tema
- A class `.cms` no wrapper raiz é o ÚNICO mecanismo de isolamento — não criar arquivo CSS por componente
- Em `.cms {}`, redeclarar tokens shadcn (`--background`, `--card`, `--border`, `--sidebar`) com valores CMS
- Os tokens `--cms-*` em `:root` são as raw values; o `.cms {}` os usa via `var(--cms-*)`
- Assim `bg-background`, `bg-card`, `border-border` funcionam com valores diferentes dentro/fora do CMS

### Layout metrics do Figma
- Sidebar: `w-60` (240px), `h-screen`, x:0, y:0
- Conteúdo main: começa em x:287 → `pl-[47px]` ou `p-[47px]` no main
- Conteúdo y:117 → `pt-[117px]` mas como sidebar + main são flex, o padding do main é relativo → `pt-[29px]` (117 - 88 da topbar implícita)
- Painel principal: `w-[1097px]` ou `flex-1`
- Painel formulário (wizard): `w-[731px]`
- Painel contextual (right): `w-[388px]`

### Componentes
- `AdminPanel` — server component puro, só `cn()` + `className` passthrough
- `AdminDataTable` — genérico `<TData>` via TanStack Table (já instalado como `@tanstack/react-table`)
- `AdminWizardPage` — gerencia apenas layout; estado dos steps fica no page component pai
- `AdminStepIndicator` — step done: ícone `Check` verde (`#16A34A`), active: número `bg-brand text-white`, pending: número `bg-cms-step-pending text-zinc-500`
- `AdminFileUpload` — `<input type="file" hidden>` + label estilizado como drop zone, sem dependências extras
- `AdminConfirmDialog` — wrapper fino sobre shadcn `AlertDialog`, 15-20 linhas

### Tipografia CMS (Figma)
- `font-mono font-bold text-2xl` → títulos de painel (Geist Bold 24px)
- `font-mono text-xs font-medium` → labels de seção sidebar (Geist Medium 12px)
- `text-sm text-muted-foreground` → textos de tabela (Inter 14px)
