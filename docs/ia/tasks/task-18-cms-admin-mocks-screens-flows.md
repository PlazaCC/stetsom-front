# task-18: CMS Admin — Mocks Completos + Telas e Fluxos Restantes

**Status:** REVIEW
**Branch:** feat/cms-admin-mocks-screens-flows
**Created:** 2026-05-20
**Needs design pass:** NO
**Depends on:** task-17 (CMS Theme Foundation + CRUD Component System)

## Objective

Expandir o CMS admin com todos os mocks necessários, as 5 telas vazias do sidebar, o fluxo completo de criação/edição de produto (wizard multi-step) e os componentes de suporte que faltam para manter consistência e replicação.

## Acceptance Criteria

- [x] Todos os novos tipos (`Banner`, `LibraryAsset`, `ContactMessage`, `AuditEntry`, `CmsConfig`, `CmsProductDetailPayload`) definidos em `contracts.ts` e exportados
- [x] Mocks criados com dados realistas (UUIDs, datas ISO, URLs válidas) para cada entidade nova
- [x] Wizard de produto (`/admin/produtos/novo`) com 3 steps usando `AdminWizardPage` + `AdminStepIndicator`; step 2 usa `AdminBlockBuilder`
- [x] Tela de edição (`/admin/produtos/[id]`) reutiliza a mesma estrutura do wizard com dados pré-preenchidos via mock
- [x] `/admin/banners` — lista com reordenamento (`AdminSortableRow`) e toggle ativo/inativo (`AdminStatusToggle`)
- [x] `/admin/biblioteca` — galeria de assets com `AdminFileUpload` integrado para adicionar novos
- [x] `/admin/mensagens` — lista de mensagens; clicar abre detalhe em `AdminDrawer`
- [x] `/admin/configuracoes` — formulário de dados da empresa usando `AdminFormPage` + `AdminFormSection`
- [x] `/admin/historico` — tabela com filtro por usuário/tipo usando `AdminListPage` + `AdminDataTable`
- [x] `AdminPagination` integrado em todas as tabelas que possuem paginação
- [x] `pnpm tsc --noEmit` e `pnpm lint` passam sem erros
- [x] `docs/ia/context.json` atualizado ao final

## In Scope

### Contratos e Mocks
- Tipos novos em `src/lib/api/contracts.ts`: `Banner`, `LibraryAsset`, `ContactMessage`, `AuditEntry`, `CmsCategory`, `CmsSubcategory`
- `MOCK_CMS_CATEGORIES` — categorias com subcategorias aninhadas
- `MOCK_CMS_PRODUCTS_DETAIL` — produtos completos com `blocks[]` e `files[]` para edição
- `MOCK_CMS_BANNERS` — banners com imagem, link, status ativo/inativo, ordem
- `MOCK_CMS_LIBRARY_ASSETS` — assets de biblioteca (imagens/PDFs com type, size, url)
- `MOCK_CMS_MESSAGES` — mensagens do formulário de contato (nome, email, assunto, lido/não lido)
- `MOCK_CMS_AUDIT_LOG` — entradas de histórico (quem, o quê, quando, entidade afetada)

### Telas Novas
- `/admin/produtos/novo` — wizard 3 steps: (1) Info básica, (2) Blocos de conteúdo, (3) Arquivos e publicação
- `/admin/produtos/[id]` — mesma wizard pré-preenchida (edição)
- `/admin/banners` — lista de banners com reordenamento e toggle
- `/admin/biblioteca` — galeria de assets com upload
- `/admin/mensagens` — lista de mensagens com drawer de detalhe
- `/admin/configuracoes` — formulário de configurações da empresa
- `/admin/historico` — log de atividades com filtros

### Componentes CRUD Novos
- `AdminPagination` — navegação de páginas para `AdminDataTable` (props: `page`, `pageSize`, `total`, `onPageChange`)
- `AdminStatusToggle` — switch ativo/inativo inline em linhas de tabela
- `AdminDrawer` — painel lateral deslizante (`fixed right-0 top-0 h-screen` com transition)
- `AdminBlockBuilder` — editor de blocos de produto (add/remove/reorder; tipos: TEXT, IMAGE, VIDEO)
- `AdminSortableRow` — linha de tabela com drag-to-reorder nativo (sem lib externa)
- `AdminRichText` — textarea com preview markdown básico para blocos TEXT
- `AdminTagInput` — campo de tags add/remove inline (para especificações de produto)

## Out of Scope

- Backend real (Fastify API) — tudo permanece em mock
- Autenticação real — login continua com mock
- Upload real de arquivos — `AdminFileUpload` mantém apenas UI
- Internacionalização das telas admin — CMS opera somente em PT-BR
- Editor 3D ou embed de vídeo real
- Permissões granulares por role (EDITOR vs ADMIN) — UI não bloqueia rotas por ora
- Categorias CRUD (tela de gerenciar categorias) — separar em task futura

## Implementation Notes

### Wizard de Produto (mais complexo)
- Step 1 — Info básica: nome, slug (auto-gerado), categoria, subcategoria (dependente), status, descrição, thumbnail URL, video URL, launch_date
- Step 2 — Blocos: `AdminBlockBuilder` usa `useState` local para lista de blocos; cada bloco tem `type` + subform que varia; drag-to-reorder com `draggable` nativo
- Step 3 — Arquivos: `AdminFileUpload` para uploads + listagem de arquivos existentes; botão "Publicar" / "Salvar rascunho"
- Na edição (`/admin/produtos/[id]`): busca dados via `useQuery(['cms-product', id])` com mock retornando `MOCK_CMS_PRODUCTS_DETAIL[id]`

### AdminBlockBuilder
- Localização: `src/app/admin/_components/crud/admin-block-builder.tsx`
- Subcomponentes internos por tipo: `TextBlockForm`, `ImageBlockForm`, `VideoBlockForm`
- Estado: `blocks: DraftBlock[]` com `{ id: string, type: BlockType, data: Record<string, unknown>, order: number }`
- Ações: "Adicionar bloco" (dropdown com tipos), "Remover" (por bloco), drag handle para reordenar

### AdminSortableRow
- Usar `draggable` HTML nativo + `onDragStart`, `onDragOver`, `onDrop`
- Sem dependência de `@dnd-kit` ou similar

### AdminDrawer
- Overlay semi-transparente (não bloqueia interação fora)
- Largura: `w-[480px]`; entra da direita com `translate-x-full` → `translate-x-0`
- Fechar: botão X interno + clicar no overlay

### AdminPagination
- UI: `← Anterior | 1 2 3 ... N | Próximo →`
- Não renderiza se `total <= pageSize`
- Integrar no `AdminDataTable` como prop `pagination?`

### Mocks Realistas
- Reutilizar produtos do `catalog.ts` como base, adicionando `blocks[]` e `files[]` compatíveis
- Banners: 3–4 entradas com status misto (2 ativos, 1 inativo)
- Mensagens: 6–8 entradas, metade lidas / metade não lidas
- Histórico: 10–15 entradas com ações variadas (CREATE, UPDATE, DELETE, LOGIN)

### Estimativa de Arquivos
| Área | Estimativa |
|---|---|
| Contratos + mocks | ~4 arquivos |
| Telas novas | ~8 arquivos |
| Componentes CRUD novos | ~7 arquivos |
| **Total** | **~19 arquivos** |
