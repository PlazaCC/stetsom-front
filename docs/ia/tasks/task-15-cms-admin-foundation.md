# task-15: CMS Admin Foundation

**Status:** REVIEW
**Branch:** feat/cms-base
**Created:** 2026-05-19
**Needs design pass:** YES (sidebar layout e nav visual — node IDs mapeados abaixo)

## Objective

Consolidar as rotas `/admin` e `/cms` em uma única área administrativa `/admin`, estruturar a sidebar com as 8 seções do Figma CMS, e documentar os node IDs para os agents de IA.

## Acceptance Criteria

- [x] Acessar `/admin` exibe o dashboard existente sem erros
- [x] Acessar `/admin/produtos` exibe a tabela de produtos (migrada de `/cms/page.tsx`)
- [x] Acessar `/cms` retorna 404 ou redireciona para `/admin` (sem rota órfã)
- [x] O sidebar em `/admin/layout.tsx` contém links para as 8 seções do Figma (Home, Produtos, Banners, Biblioteca, Mensagens, Configurações, Histórico, Autenticação)
- [x] Os diretórios vazios `src/app/[locale]/admin/` e `src/app/[locale]/cms/` estão removidos
- [x] `proxy.ts` exclui `/admin` explicitamente do matcher do locale middleware
- [x] `docs/ia/figma/FIGMA_GRAPH.md` e `docs/ia/figma/CMS_PAGES.md` documentam todos os node IDs do CMS
- [x] `pnpm tsc --noEmit` e `pnpm lint` passam sem erros

## In Scope

- Consolidação da rota: `/admin` canônica, remoção de `src/app/cms/`
- Migração do conteúdo de `cms/page.tsx` para `admin/produtos/page.tsx`
- Remoção dos diretórios vazios `[locale]/admin/` e `[locale]/cms/`
- Atualização do sidebar nav em `src/app/admin/layout.tsx` com os 8 links do CMS
- Atualização do `src/proxy.ts` para excluir `/admin` do locale matcher
- Criação de `docs/ia/figma/CMS_PAGES.md` com mapa completo de node IDs do CMS

## Out of Scope

- Implementação das páginas de cada seção (Banners, Biblioteca, Mensagens, etc.)
- Auth real (login page + guard) — task-16
- Integração com backend Fastify
- Decisão sobre Mantine UI (usar shadcn/ui existente por enquanto)

## Implementation Notes

### Padrão obrigatório de extensão do mock

Todo dado novo DEVE seguir a cadeia completa — nunca hardcodar dados em componentes:

```
contracts.ts → mock/admin-cms.ts → provider-contract.ts → mock-provider.ts
  → remote-provider.ts → server.ts → client.ts → endpoints.ts
  → api/route.ts → hooks → page
```

O mock deve se comportar como a API real se comportaria: filtros, paginação e payloads tipados. Os dados do Figma são a fonte de verdade para o conteúdo do mock (textos, labels, estrutura de seções).

### O que precisa ser mockado nesta task

A task-15 toca apenas no **rearranjo estrutural das rotas**. O mock existente (`ADMIN_DASHBOARD_PAYLOAD` em `admin-cms.ts` e `getCmsProductsPayload` no mock-provider) já está funcional. A única adição necessária é garantir que o `AdminDashboardPayload` reflita os dados reais do Figma (Home do CMS, node `1090:20239`):

**`src/lib/mock/admin-cms.ts` — verificar/atualizar:**
- `title`: "Painel Administrativo" (confirmar com Figma node `1090:20239`)
- `metrics`: manter dinâmico (activeProducts/discontinuedProducts já calculados do mock de catálogo)
- `recentActivities`: 3 entradas realistas em PT-BR com acentuação correta

**`src/lib/api/endpoints.ts` — adicionar:**
```ts
adminUsers: '/api/admin/users',   // placeholder para task-16
```

Não implementar o endpoint ainda — apenas registrar a constante para que a task-16 não cause conflito de naming.

### Rotas a criar / migrar / deletar

| Ação | De | Para |
|---|---|---|
| Mover | `src/app/cms/page.tsx` | `src/app/admin/produtos/page.tsx` |
| Deletar | `src/app/cms/` (todo o dir) | — |
| Deletar | `src/app/[locale]/admin/` (vazio) | — |
| Deletar | `src/app/[locale]/cms/` (vazio) | — |
| Atualizar | `src/app/admin/layout.tsx` | Adicionar nav com 8 links |
| Atualizar | `src/proxy.ts` | Excluir `/admin` do matcher |

### Sidebar nav (baseado no Figma CMS `1090:25868`)

Links na ordem do Figma:
- `/admin` → Home (Dashboard)
- `/admin/produtos` → Produtos
- `/admin/banners` → Banners
- `/admin/biblioteca` → Biblioteca
- `/admin/mensagens` → Central de Mensagens
- `/admin/configuracoes` → Configurações
- `/admin/historico` → Histórico

### proxy.ts matcher — excluir /admin

```ts
matcher: ["/((?!_next|_vercel|api|admin|figma-assets|favicon\\.ico|.*\\..*).*)"]
```

### Figma CMS — Node IDs de referência

**Seção raiz do CMS:** `1090:25868` (fileKey: `huD41oTL0FAa7xsNEK8tAM`)

| Seção | Tela | Node ID |
|---|---|---|
| Home | Dashboard | `1090:20239` |
| Produtos | Lista | `1090:20858` |
| Produtos | Novo / Dados gerais | `1090:21089` |
| Produtos | Novo / Especificações | `1090:21314` |
| Produtos | Novo / Arquivos e Manual 1 | `1090:21570` |
| Produtos | Novo / Arquivos e Manual 2 | `1090:21707` |
| Produtos | Novo / Arquivos e Manual 3 | `1090:21847` |
| Produtos | Novo / Conclusão | `1090:22031` |
| Banners | Lista | `1090:18485` |
| Banners | Visualizar | `1090:18798` |
| Banners | Registrar | `1090:19051` |
| Biblioteca | Manuais | `1090:19222` |
| Biblioteca | Arquivos 3D | `1090:19352` |
| Biblioteca | Manuais / Editar | `1090:19483` |
| Biblioteca | Arquivos 3D / Upload | `1090:19662` |
| Biblioteca | Fotos | `1090:19827` |
| Biblioteca | Fotos / Interação | `1090:20008` |
| Central de Mensagens | Tela 1 | `1090:20407` |
| Central de Mensagens | Tela 2 | `1090:20527` |
| Central de Mensagens | Tela 3 | `1090:20659` |
| Configurações | Configurações | `1090:18287` |
| Histórico | Histórico | `1489:4759` |
| Autenticação | Login | `1090:20215` |
