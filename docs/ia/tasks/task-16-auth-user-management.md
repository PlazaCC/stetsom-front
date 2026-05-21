# task-16: Auth JWT + User Management (CMS Admin)

**Status:** REVIEW
**Branch:** feat/auth-user-management
**Created:** 2026-05-19
**Needs design pass:** NO (derivado dos padrões do CMS — sem Figma para esta tela)

## Objective

Implementar autenticação real com JWT (cookie httpOnly), proteger todas as rotas `/admin/*` com guard no proxy, e criar a tela de gerenciamento de usuários seguindo o padrão provider/mock/contract do projeto.

## Acceptance Criteria

- [x] `POST /api/auth/login` com credenciais corretas seta cookie `admin_token` httpOnly e retorna `AuthPayload`
- [x] `POST /api/auth/login` com credenciais erradas retorna 401 com `INVALID_CREDENTIALS`
- [x] Acessar qualquer rota `/admin/*` sem cookie → redireciona para `/admin/login`
- [x] Após login bem-sucedido → redireciona para `/admin`
- [x] `POST /api/auth/logout` limpa o cookie e redireciona para `/admin/login`
- [x] `/admin/usuarios` exibe tabela com os 3 usuários mock (nome, email, role, status, último login)
- [x] Botão "Novo usuário" abre modal com formulário (nome, e-mail, senha, role, ativo)
- [x] Salvar novo usuário → aparece na tabela (mock in-memory)
- [x] Botão "Editar" abre modal preenchido com os dados do usuário
- [x] Desativar/ativar usuário altera o badge de status na tabela sem reload
- [x] `pnpm tsc --noEmit` e `pnpm lint` passam sem erros

## In Scope

### Camada de contratos (`src/lib/api/contracts.ts`)
- `UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR'`
- `AdminUser { id, name, email, role, is_active, created_at, updated_at, last_login? }`
- `LoginCredentials { email, password }`
- `AuthPayload { token, user: Pick<AdminUser, id|name|email|role>, expires_at }`
- `AdminUsersPayload { items: AdminUser[], total: number }`
- `CreateAdminUserInput { name, email, password, role }`
- `UpdateAdminUserInput { name?, role?, is_active? }`

### Mock data (`src/lib/mock/admin-cms.ts`)
- Array `MOCK_ADMIN_USERS` com 3 fixtures:
  - `usr-1`: Luis Bovo, dark.luismtns@gmail.com, SUPER_ADMIN, ativo
  - `usr-2`: Editor Stetsom, editor@stetsom.com.br, EDITOR, ativo
  - `usr-3`: Admin Inativo, antigo@stetsom.com.br, ADMIN, inativo
- Credenciais mock: qualquer e-mail existente + senha `stetsom2026`
- Token mock retornado: string JWT fake (não assinado, apenas estrutura base64 válida)

### Provider contract (`src/lib/api/provider-contract.ts`)
- `login(credentials: LoginCredentials): Promise<AuthPayload>`
- `logout(): Promise<void>`
- `getAdminUsers(): Promise<AdminUsersPayload>`
- `createAdminUser(input: CreateAdminUserInput): Promise<AdminUser>`
- `updateAdminUser(id: string, input: UpdateAdminUserInput): Promise<AdminUser>`

### Mock provider (`src/lib/api/providers/mock-provider.ts`)
- `login()`: verifica email em `MOCK_ADMIN_USERS` + senha fixa `stetsom2026`, retorna `AuthPayload` ou lança 401
- `getAdminUsers()`: retorna cópia do array in-memory (mutável durante sessão)
- `createAdminUser()`: push no array, retorna novo usuário com UUID gerado
- `updateAdminUser()`: atualiza campo no array, retorna usuário atualizado

### Remote provider (`src/lib/api/providers/remote-provider.ts`)
- Stubs HTTP para `POST /auth/login`, `DELETE /auth/logout`, `GET /admin/users`, `POST /admin/users`, `PATCH /admin/users/:id`

### Endpoints (`src/lib/api/endpoints.ts`)
```ts
authLogin: '/api/auth/login',
authLogout: '/api/auth/logout',
adminUsers: '/api/admin/users',
```

### API Routes (Next.js)
- `src/app/api/auth/login/route.ts`: POST → provider.login() → set-cookie httpOnly + JSON response
- `src/app/api/auth/logout/route.ts`: POST → clear cookie → 204
- `src/app/api/admin/users/route.ts`: GET (lista) + POST (criar)
- `src/app/api/admin/users/[id]/route.ts`: PATCH (editar) + DELETE (desativar/excluir)

### Auth Guard (`src/proxy.ts`)
```ts
// Adicionar no proxy() antes de handleLocale:
if (request.nextUrl.pathname.startsWith('/admin') &&
    !request.nextUrl.pathname.startsWith('/admin/login')) {
  const token = request.cookies.get('admin_token')
  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }
}
```

### Client e Hooks
- `src/lib/api/client.ts`: `loginAdmin()`, `logoutAdmin()`, `fetchAdminUsers()`, `createAdminUser()`, `updateAdminUser()`
- `src/lib/api/server.ts`: `getAdminUsersPayload()`
- `src/hooks/use-admin.ts`: `useAdminUsers()`, `useAdminLogin()`, `useAdminUserMutations()`

### Páginas
- `src/app/admin/login/page.tsx`: formulário email + senha, sem sidebar, logo centralizado, submit → POST /api/auth/login
- `src/app/admin/usuarios/page.tsx`: tabela de usuários + modal criar/editar (shadcn Dialog)

### Sidebar
- Adicionar link "Usuários" (`/admin/usuarios`) ao nav do `src/app/admin/layout.tsx`
- Visível apenas se role === 'SUPER_ADMIN' (ler de cookie decodificado ou context)

## Out of Scope

- Refresh token / expiração real do JWT (backend gerencia isso)
- Validação de assinatura JWT no frontend (delegado ao Fastify)
- Reset de senha por e-mail
- Permissões granulares por rota (role-based guards além do guard básico de autenticação)
- Histórico de login / audit log (cobre a tela Histórico da task-15)
- Design Figma formal (layout derivado do CMS pattern já implementado)
- Paginação de usuários (mock tem apenas 3 — sem necessidade agora)

## Implementation Notes

### Padrão obrigatório de extensão do mock

Todo dado novo DEVE seguir a cadeia:
```
contracts.ts → mock/admin-cms.ts → provider-contract.ts → mock-provider.ts → remote-provider.ts → server.ts → client.ts → endpoints.ts → api/route.ts → hooks → page
```

Nunca criar dados hardcoded em componentes. Nunca bypassar o provider.

### Design da tela /admin/usuarios (sem Figma)

Seguir os tokens visuais do CMS:
- Background: `bg-[#F2F3F7]` (igual ao Home do CMS)
- Header da seção: título `font-sans-condensed font-black uppercase text-brand-dark` + botão brand
- Tabela: mesma estrutura da tabela de produtos em `/admin/produtos`
- Status badge: `bg-emerald-50 text-emerald-700` (ativo) / `bg-amber-50 text-amber-700` (inativo)
- Role badge: `bg-zinc-100 text-zinc-700 rounded-full px-2 py-0.5 text-2xs`
- Modal: shadcn `Dialog` + `DialogContent` com formulário

### Design da tela /admin/login (sem Figma)

- Layout: tela cheia `min-h-screen bg-brand-dark flex items-center justify-center`
- Card central: `bg-white rounded-lg p-10 w-full max-w-sm shadow-lg`
- Logo Stetsom no topo do card (variant dark → logo branca não funciona, usar variant light ou adaptar)
- Campos: e-mail (type=email) + senha (type=password)
- Botão submit: `btn-primary` brand red, full width
- Mensagem de erro inline (sem toast) quando 401

### Cookie de autenticação

```ts
// Na API route de login:
response.cookies.set('admin_token', payload.token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: 60 * 60 * 8, // 8 horas
})
```

### Token mock (JWT fake estruturalmente válido)

```ts
// Base64 header.payload.signature (não verificado pelo frontend)
const mockToken = [
  btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' })),
  btoa(JSON.stringify({ sub: user.id, email: user.email, role: user.role, exp: Date.now() + 8 * 3600000 })),
  'mock-signature'
].join('.')
```

### Sidebar — link Usuários

Adicionar ao nav do `src/app/admin/layout.tsx`:
```tsx
{ href: '/admin/usuarios', label: 'Usuários', icon: Users }
```
Visibilidade: mostrar sempre no mock (role guard real depende do backend).
