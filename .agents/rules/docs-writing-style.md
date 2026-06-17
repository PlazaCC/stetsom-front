---
description: 'Use when writing or editing any documentation file (README, AGENTS.md, docs/**). Covers voice, punctuation, table format, file tree annotations, and README section structure.'
applyTo: '**/*.md'
---

# Documentation Writing Style

## Voice

- Direct and documentary. No marketing tone, no filler.
- Imperative for instructions. Declarative for descriptions.
- Forbidden phrases: "make sure to", "simply", "just", "easily", "feel free".

## Punctuation

No parentheses for side notes — rewrite as a separate sentence or cut entirely.

```
❌ Credentials for `pnpm mock:dump` (only needed when refreshing fixtures).
✅ Credentials for `pnpm mock:dump`. Required only when refreshing fixtures.
```

No em-dashes for inline asides — use a period and start a new sentence.
No semicolons in prose — split into two sentences.
Colons are allowed to introduce a list or a value (`Format: {bucket}.s3.{region}.amazonaws.com`).

## Tables

**Commands** — verb phrase, no trailing period.

```
✅ Start development server
❌ Starts the development server.
```

**Env vars** — purpose first, constraints or format as a second sentence.

```
✅ S3 bucket hostname for `next/image`. Format: `{bucket}.s3.{region}.amazonaws.com`.
❌ S3 bucket hostname for `next/image` (`{bucket}.s3.{region}.amazonaws.com`).
```

**Stack** — variant or theme in the Version column, not in the Tech column.

```
✅ | shadcn/ui | base-nova |
❌ | shadcn/ui (base-nova) | — |
```

## File Tree Annotations

Annotations after `←` are lowercase with no trailing punctuation and no parentheses.
Multiple purposes use a comma, not `+` or `/`.

```
✅ ← BFF route handlers, auth, upload
❌ ← BFF route handlers + auth + upload

✅ ← next-intl locale wrapper
❌ ← next-intl locale wrapper (pt-BR = no prefix)
```

## README Structure

Standard sections in order: Getting Started → Commands → Stack → Project Structure → Environment Variables → Code Quality → Deploy.

**Getting Started** — install command and dev command only. No "open localhost" line.

**Do not include:**
- Operational runbooks (e.g. refreshing mock data, seeding a database) — those belong in `docs/`. README references only the relevant env var.
- "Why" explanations — those belong in ADRs or inline comments.
- Content already documented in `CLAUDE.md` or `AGENTS.md`.
