# CMS Admin — Figma Node Map

**Arquivo Figma:** Stetsom | CMS  
**FileKey:** `huD41oTL0FAa7xsNEK8tAM`  
**Seção raiz do CMS:** `1090:25868`  
**Rota admin:** `/admin` (sem locale prefix — não usa next-intl)

> Usar `get_figma_data(fileKey="huD41oTL0FAa7xsNEK8tAM", nodeId="<nodeId>", depth=3)` para inspecionar telas.

---

## Estrutura de Seções

### Autenticação (`1090:20214`)

| Tela | Node ID | Rota |
|---|---|---|
| Login | `1090:20215` | `/admin/login` |

---

### Home — Dashboard (`1090:20238`)

| Tela | Node ID | Rota |
|---|---|---|
| Dashboard | `1090:20239` | `/admin` |

---

### Produtos (`1090:20857`)

| Tela | Node ID | Rota |
|---|---|---|
| Lista de produtos | `1090:20858` | `/admin/produtos` |
| Novo produto / Dados gerais | `1090:21089` | `/admin/produtos/novo` (step 1) |
| Novo produto / Especificações técnicas | `1090:21314` | `/admin/produtos/novo` (step 2) |
| Novo produto / Arquivos e Manual 1 | `1090:21570` | `/admin/produtos/novo` (step 3a) |
| Novo produto / Arquivos e Manual 2 | `1090:21707` | `/admin/produtos/novo` (step 3b) |
| Novo produto / Arquivos e Manual 3 | `1090:21847` | `/admin/produtos/novo` (step 3c) |
| Novo produto / Conclusão | `1090:22031` | `/admin/produtos/novo` (step 4) |
| Exemplo edição de bloco | `1522:4918` | inline modal |
| Exemplo criação/edição de templates | `1522:4919` | inline modal |

---

### Banners (`1090:18484`)

| Tela | Node ID | Rota |
|---|---|---|
| Lista de banners | `1090:18485` | `/admin/banners` |
| Visualizar banner | `1090:18798` | `/admin/banners/[id]` |
| Registrar banner | `1090:19051` | `/admin/banners/novo` |

---

### Biblioteca (`1090:19221`)

| Tela | Node ID | Rota |
|---|---|---|
| Manuais | `1090:19222` | `/admin/biblioteca/manuais` |
| Arquivos 3D | `1090:19352` | `/admin/biblioteca/3d` |
| Manuais / Editar | `1090:19483` | `/admin/biblioteca/manuais/[id]/editar` |
| Arquivos 3D / Upload | `1090:19662` | `/admin/biblioteca/3d/upload` |
| Fotos | `1090:19827` | `/admin/biblioteca/fotos` |
| Fotos / Card de interação | `1090:20008` | inline modal |

---

### Central de Mensagens (`1090:20406`)

| Tela | Node ID | Rota |
|---|---|---|
| Mensagens 1 (lista) | `1090:20407` | `/admin/mensagens` |
| Mensagens 2 (thread) | `1090:20527` | `/admin/mensagens/[id]` |
| Mensagens 3 (resposta) | `1090:20659` | `/admin/mensagens/[id]/responder` |

---

### Configurações (`1090:25867`)

| Tela | Node ID | Rota |
|---|---|---|
| Configurações | `1090:18287` | `/admin/configuracoes` |

---

### Histórico (`1489:4758`)

| Tela | Node ID | Rota |
|---|---|---|
| Histórico (audit log) | `1489:4759` | `/admin/historico` |

---

## Sidebar Nav — Ordem do Figma

1. Home → `/admin`
2. Produtos → `/admin/produtos`
3. Banners → `/admin/banners`
4. Biblioteca → `/admin/biblioteca`
5. Central de Mensagens → `/admin/mensagens`
6. Configurações → `/admin/configuracoes`
7. Histórico → `/admin/historico`

---

## Notas de Design

- Todas as telas têm dimensão base 1440×1024px (desktop)
- Background da área de conteúdo: `#F2F3F7` (Home) / `#E8ECFB` (demais telas)
- Sidebar background implícito: `#222222` (dark) — confirmar via MCP
- A rota `/admin` não usa locale prefix (não é locale-aware)
- Auth guard: telas de `/admin/*` requerem sessão ativa; `/admin/login` é pública
