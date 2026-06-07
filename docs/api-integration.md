# API Integration Guide

**Status:** Ativo
**Fonte de verdade para tipos:** `src/lib/api/contracts.ts`
**Especificação de endpoints:** OpenAPI via MCP (`mcp__stetsom-api-installation__search-openapi-operations`)

> Este documento cobre padrões, decisões arquiteturais e regras de integração — não lista endpoints. Para endpoints e schemas específicos, consulte o OpenAPI, que reflete o estado atual da API e pode mudar a qualquer momento.

---

## Visão Geral

O frontend se comunica com o **stetsom-api** (Fastify) exclusivamente através de uma camada de abstração chamada **CMS Provider**. Nunca chame `fetch()` diretamente em páginas ou hooks para dados gerenciados por essa camada.

```
Página / Hook
    ↓
CMS Provider  (src/lib/api/provider.ts)
    ↓ mock        ↓ remote
fixtures     stetsom-api (via BFF ou direto)
```

A troca entre mock e real é feita pela presença da variável `CMS_API_BASE_URL`:

```bash
# .env.local
CMS_API_BASE_URL=http://localhost:3333  # omitir para usar modo mock

# Ativa mock data (serve src/lib/mock/data/*.json — sem rede):
# USE_MOCK_DATA=1

# Credenciais para exportar dados admin via `pnpm mock:dump`:
# MOCK_DUMP_EMAIL=admin@stetsom.com.br
# MOCK_DUMP_PASSWORD=your-password
```

---

## 1. Camada BFF

Os route handlers em `src/app/api/` são uma camada BFF mínima. Eles existem por uma razão: **o browser não pode ler o cookie `admin_token`** (ele é `HttpOnly`), então o servidor precisa fazer o forward do token para a API.

**O que um route handler deve fazer:**
- Ler o cookie `admin_token` e adicionar `Authorization: Bearer <token>`
- Parsear e validar query params
- Para rotas de dados, chamar `getCmsProvider().metodo()` e retornar o resultado
- Para rotas de auth/upload, fazer forward direto para o `stetsom-api` preservando status e contrato de erro

**O que um route handler não deve fazer:**
- Conter lógica de negócio
- Transformar payloads de domínio no próprio route handler
- Fazer múltiplas chamadas para compor uma resposta

---

## 2. Autenticação

### Fluxo de login

```
1. POST /api/auth/login  { email, password }
   → { accessToken, refreshToken }

2. BFF armazena accessToken em cookie HttpOnly "admin_token"

3. Toda rota protegida lê esse cookie e envia:
   Authorization: Bearer <accessToken>

4. Quando o accessToken expira:
   POST /api/auth/refresh  { refreshToken }
   → { accessToken }
```

### Regras importantes

- **`admin_token` é `HttpOnly`** — inacessível via `document.cookie` ou JavaScript. Toda leitura é feita em server-side (Route Handlers, Server Components).
- **Logout é stateless** — `DELETE /api/auth/logout` não invalida o JWT no servidor. O token expira pelo TTL configurado (`JWT_ACCESS_EXPIRES`). Ao fazer logout, descarte os tokens no cliente e limpe o cookie.
- **Rotas públicas** não precisam de token: `/api/pages/*`, `/api/categories/`, `/api/products/` (listagem e detalhe), `/api/contact/`.
- **Rotas protegidas** exigem token: tudo sob `/api/dashboard/`, `/api/users/`, `/api/banners/`, `/api/library/`, `/api/messages/`, `/api/audit/`, `/api/config/`, `/api/upload/*`, `/api/products/admin*`.

---

## 3. Contrato de Erros

Toda resposta de erro da API segue exatamente este shape — nunca assuma texto puro:

```ts
// ApiErrorPayload
{
  error: {
    code: string    // identificador de máquina
    message: string // mensagem legível para o usuário
  }
}
```

Use `error.code` para branching programático, nunca `error.message` (que pode mudar):

```ts
if (err.error.code === "UNAUTHORIZED") {
  // redirecionar para login
} else if (err.error.code === "CONFLICT") {
  // mostrar mensagem de duplicidade
}
```

Mapeamento HTTP → code mais comuns:

| HTTP | `code` |
|------|--------|
| 401 | `UNAUTHORIZED` |
| 404 | `NOT_FOUND` |
| 409 | `CONFLICT` |
| 422 | `VALIDATION_ERROR` |
| 503 | `SERVICE_UNAVAILABLE` |

---

## 4. Paginação

A API usa **dois estilos de paginação** — saber qual o endpoint usa é essencial:

### Page-based (catálogo de produtos, CMS)

```ts
// Response
{ items: T[], total: number, page: number, pageSize: number, totalPages: number }

// Query params
?page=1&pageSize=20    // page: 1-indexed, padrão 1; pageSize: padrão 20, máx 100
```

### Offset-based (usuários, mensagens, auditoria, biblioteca, banners)

```ts
// Response
{ items: T[], total: number }

// Query params
?limit=50&offset=0    // limit: máx 200
```

Nunca misture os dois estilos em um mesmo endpoint. Ao criar um hook de listagem, verifique qual estilo o endpoint usa antes de implementar.

---

## 5. Modelo de Produto

O modelo de produto é mais rico do que um simples mapa de chave-valor. Entender a hierarquia evita erros de integração:

```
Product
├── variations[]          // variantes (ex: potências diferentes do mesmo modelo)
│   └── specs[]           // especificações técnicas ordenadas da variante
│       ├── attribute      // ex: "Potência RMS"
│       ├── value          // ex: "3000W"
│       └── order          // ordem de exibição
├── highlight_attributes[] // quais attributes mostrar no card/header do produto
├── blocks[]              // blocos de conteúdo ordenados (page builder)
│   └── type: IMAGE | VIDEO | HTML | MODEL3D | TEXT
└── files[]               // arquivos para download
    └── type: MANUAL | CATALOG | CERTIFICATE | IMAGE | OTHER
```

### Regras do modelo

- `blocks` são sempre ordenados por `order` (ascendente) — nunca renderize na ordem recebida sem ordenar
- `files.is_active` determina visibilidade — arquivos inativos não devem ser exibidos publicamente
- `files.version` incrementa por `product_id + type` — a versão mais alta é a atual
- `badge` é nullable — sempre verifique antes de renderizar
- `markets?: string[]` controla visibilidade por locale — ausente significa todos os locales; presente restringe à lista

### Especificações com variações

O campo `highlight_attributes` indica quais atributos de `specs` exibir em destaque (no card, no header). Use-o para filtrar o que mostrar na UI sem hardcodar nomes de atributos.

---

## 6. Upload de Arquivos

O upload usa uma abordagem de 3 etapas que envolve diretamente o S3 — sem passar o binário pelo servidor Node:

```
Etapa 1 — Presign
Browser → BFF (Next.js) → stetsom-api
POST /api/upload  { fileName, mimeType, sizeBytes, scope? }
← { uploadUrl, file_url, headers, assetType, expiresIn, ... }

Etapa 2 — PUT direto ao S3
Browser → S3
PUT {uploadUrl}
  Headers: presign.headers  ← incluir exatamente esses headers, nada mais
  Body: File binary
← 200 OK

Etapa 3 — Registro
Browser → BFF (Next.js) → stetsom-api
POST /api/upload/complete  { name, file_url, type, size_bytes, width?, height? }
← { asset: LibraryAsset }
```

### Por que não mandar `Authorization` ao S3?

A URL presignada já inclui a assinatura AWS (parâmetro `X-Amz-Signature`). O S3 valida a requisição comparando os headers recebidos com os headers listados em `X-Amz-SignedHeaders`. Qualquer header extra não listado na assinatura causa erro `SignatureDoesNotMatch`. Por isso, use **somente** `presign.headers` — nunca adicione `Authorization` ou outros headers.

### Valores importantes

- **`uploadUrl`** — URL presignada, expira em `expiresIn` segundos (padrão 15 min). Não reutilize.
- **`file_url`** — URL pública permanente. É este valor que deve ser salvo em campos de imagem de banners, produtos, blocos, etc.
- O asset **não existe na biblioteca** até que a Etapa 3 seja concluída com sucesso.

---

## 7. Page Payloads

As rotas de site (`/api/pages/home`, `/api/pages/about`, `/api/pages/catalog`, `/api/pages/support`) retornam **payloads completos** — um único request contém todos os dados necessários para renderizar a página inteira.

Essa é uma decisão arquitetural intencional: páginas RSC não devem fazer múltiplos fetches em cascata (waterfall). O backend compõe o payload e o frontend renderiza.

**Consequência:** se um dado está no payload, não busque-o separadamente. Se um dado que você precisa não está no payload, sinalize para o backend adicionar ao endpoint existente — não crie um novo fetch.

**Atenção:** esses endpoints retornam `503` (Service Unavailable) — não `404` — quando uma dependência de conteúdo está indisponível. Trate com um fallback gracioso, não com uma página de erro 404.

---

## 8. Roles de Usuário

O controle de acesso é **sempre server-side**. O frontend usa o role apenas para decisões de UI:

| Role | Permissões |
|------|-----------|
| `SUPER_ADMIN` | Acesso completo, incluindo gestão de usuários |
| `ADMIN` | Gestão de conteúdo; sem administração de usuários |
| `EDITOR` | Leitura e rascunho; sem publicação ou ações destrutivas |

---

## 9. Log de Auditoria

Cada entrada (`AuditEntry`) tem `action_sentence` — uma string pré-formatada legível. Renderize diretamente sem reformatar.

Actions possíveis: `CREATE | UPDATE | DELETE | LOGIN | LOGOUT | PUBLISH`

Para filtrar por entidade específica, use o query param `?entity=<nome>`.

---

## 10. Fonte de Verdade para Tipos

`src/lib/api/contracts.ts` é o arquivo TypeScript canônico para todos os shapes da API.

- Nunca defina shapes de API inline em componentes ou hooks — importe de `contracts.ts`
- Quando o schema do backend mudar, atualize `contracts.ts` primeiro e corrija os consumidores
- Os mocks em `src/lib/mock/` devem estar em conformidade com esses tipos — use-os como teste de compatibilidade
- O OpenAPI/MCP é a referência de runtime; `contracts.ts` é a referência de compilação. Mantenha-os sincronizados

---

## Arquivos relacionados

| Arquivo | Função |
|---|---|
| `src/lib/api/contracts.ts` | Tipos TypeScript — fonte de verdade |
| `src/lib/api/provider.ts` | Seleção mock vs remote |
| `src/lib/api/provider-contract.ts` | Interface `CmsProvider` |
| `src/lib/api/providers/remote-provider.ts` | Implementação HTTP |
| `src/lib/api/providers/mock-provider.ts` | Implementação com fixtures |
| `src/app/api/proxy/admin/[...resource]/route.ts` | Proxy BFF para rotas admin (via CmsProvider) |
| `src/app/api/proxy/catalog/[...resource]/route.ts` | Proxy BFF para rotas públicas de catálogo |
| `src/app/api/auth/login/route.ts` | BFF login (troca credenciais por cookies HttpOnly) |
| `src/app/api/auth/logout/route.ts` | BFF logout (limpa cookies) |
| `src/app/api/auth/refresh/route.ts` | BFF refresh token |
| `src/lib/api/route-utils.ts` | Helpers compartilhados para Route Handlers |
| `src/hooks/use-admin.ts` | Hooks TanStack Query para admin |
| `src/hooks/use-upload.ts` | Orquestração do upload 3 etapas |
| `src/app/api/upload/route.ts` | BFF presign (injeta auth token) |
| `src/app/api/upload/complete/route.ts` | BFF registro de asset |
