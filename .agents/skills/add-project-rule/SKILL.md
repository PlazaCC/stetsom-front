---
name: add-project-rule
description: 'Create or update agent rules for all runtimes using the dual-install pattern: the real file lives in .agents/rules/<topic>.md (VS Code Copilot), and .claude/rules/<topic>.md (Claude Code CLI) is a symlink mirror. Both folders are auto-discovered — no edits to AGENTS.md or .github/copilot-instructions.md needed. Use when adding coding conventions, framework rules, file-type standards, or project-specific guidelines every agent must follow. Triggers: "add rule", "create rule", "add project rule", "add coding conventions", "add project guidelines", "agent rules", "project rules".'
argument-hint: 'Rule topic, e.g. "Fastify route conventions" or "TypeScript strict patterns for API files"'
---

# Add Project Rule

Cria regras para todos os runtimes de agente usando o **padrão dual-install** — um arquivo real, um symlink espelho:

| Runtime              | Pasta de regras  | Papel |
| -------------------- | ---------------- | ----- |
| VS Code Copilot Chat | `.agents/rules/` | Canônico — o arquivo real fica aqui |
| Claude Code CLI      | `.claude/rules/` | Symlink espelho de `.agents/rules/` — nunca uma segunda cópia real |

Ambas as pastas são descobertas automaticamente — não é necessário editar `AGENTS.md`, `CLAUDE.md` ou `.github/copilot-instructions.md`.

## When to Use

- Adicionar convenções que todos os agentes devem seguir (padrões de framework, aliases, nomenclatura)
- Criar regras com escopo de arquivo (ex: rotas de API, arquivos de teste, componentes)
- Registrar padrões descobertos durante uma conversa como guia permanente de agente
- Atualizar regras existentes após evolução do codebase

## Procedure

### 1. Coletar conteúdo da regra

Do usuário ou da conversa, extrair:

- **Tópico**: qual tecnologia, padrão ou domínio cobre?
- **Regras**: declarações concretas e acionáveis (evitar conselhos vagos)
- **applyTo** (opcional): glob de arquivos para escopo — ex: `src/app/**/*.tsx`
- **Palavras-chave de trigger**: para regras on-demand, quais palavras de tarefa a ativam?

**Bom formato de regra:**

```markdown
- Sempre aguardar `params` e `searchParams` — são tipos `Promise` no Next.js 16
- Nunca escrever `@/src/...` — o alias `@/*` já mapeia para `src/`
```

**Anti-patterns a evitar:**

- Vago: "Escreva código limpo"
- Duplicar docs: copiar/colar do README
- Misturar domínios: TypeScript + design de API + estilos num mesmo bloco

### 2. Criar arquivo em `.agents/rules/`

Crie `.agents/rules/<topic>.md` com frontmatter de `.instructions.md`:

```markdown
---
description: 'Use when <palavras-chave de tarefa>. Covers <o quê>.'
applyTo: '**/<glob>' # omitir se for puramente on-demand (descoberta por description)
---

# <Tópico> Guidelines

- <regra>
- <regra>
```

> O campo `description` é a chave para descoberta on-demand pelo VS Code Copilot.
> Use palavras-chave ricas que descrevam quando a regra deve ser aplicada.

### 3. Symlink de `.claude/rules/`

`.agents/rules/` é a única cópia real — nunca crie um segundo arquivo real. Da raiz do repositório, crie um symlink relativo:

```bash
ln -s ../../.agents/rules/<topic>.md .claude/rules/<topic>.md
```

O mesmo padrão se aplica ao adicionar uma nova **skill**, um nível de diretório mais profundo:

```bash
mkdir -p .claude/skills/<name>
ln -s ../../../.agents/skills/<name>/SKILL.md .claude/skills/<name>/SKILL.md
```

### 4. Validar

- [ ] `.agents/rules/<topic>.md` existe, frontmatter válido, é um **arquivo real**
- [ ] `readlink .claude/rules/<topic>.md` resolve para `../../.agents/rules/<topic>.md`
- [ ] `cat .claude/rules/<topic>.md` lê o mesmo conteúdo transparentemente através do symlink
- [ ] `description` contém palavras-chave ricas para descoberta
- [ ] `applyTo` glob é específico — evitar `"**"` salvo se a regra realmente se aplica a tudo
- [ ] Regras são concretas e acionáveis, não vagas

### 5. Anunciar

Informar:

- Quais arquivos foram criados
- Exemplo: como a regra será ativada na prática
- Se relevante, mencionar que a regra cobre ambos os runtimes automaticamente

## Examples

### Regra de alias de path

**`.agents/rules/path-alias.md`** (arquivo real, `.claude/rules/path-alias.md` faz symlink para ele):

```markdown
---
description: 'Use when importing modules in TypeScript/TSX files. Covers the @/* path alias convention.'
applyTo: 'src/**/*.{ts,tsx}'
---

# Path Alias

- `@/*` mapeia para `src/` — nunca escreva `@/src/...` (resolve para `src/src/...` e falha)
```

---

### Regra de rotas de API (on-demand)

**`.agents/rules/api-routes.md`** (arquivo real, `.claude/rules/api-routes.md` faz symlink para ele):

```markdown
---
description: 'Use when writing Fastify route handlers, Zod validation schemas, or Prisma queries. Covers conventions for the Stetsom backend API.'
---

# API Route Conventions

- Todas as rotas usam validação Zod via `fastify-type-provider-zod`
- Prisma client é injetado via `fastify.prisma` — nunca instanciar diretamente
- Retornar 422 para erros de validação, 404 para não encontrado, 409 para conflitos
```

## Runtime Coverage Matrix

| Pasta            | VS Code Copilot Chat | Claude Code CLI |
| ---------------- | :------------------: | :-------------: |
| `.agents/rules/` |          ✅          |       ❌        |
| `.claude/rules/` |          ❌          |       ✅        |

> Criar o arquivo em `.agents/rules/` e o symlink em `.claude/rules/` garante cobertura total dos dois runtimes.
> O conteúdo no symlink é transparente — nenhuma adaptação necessária.
