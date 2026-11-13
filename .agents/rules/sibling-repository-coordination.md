---
description: 'Read when a task may involve the Stetsom frontend or backend, OpenAPI contracts, Orval generation, or the neighboring stetsom-front and stetsom-api repositories. Covers repository identification, sibling discovery, and safe cross-repository execution.'
---

# Stetsom Repository Coordination

## Repository Identity

- **Current repository:** `stetsom-front` — Next.js public site and admin CMS UI.
- **Sibling repository:** `../stetsom-api` — Fastify + Zod + Prisma backend and the authoritative OpenAPI contract.
- The repositories are siblings in the same parent directory. Discover the backend from this repository with `../stetsom-api`; do not assume a similarly named directory elsewhere is the intended project.

## Select the Correct Repository Before Editing

1. Classify the task before running commands or editing files:
   - Next.js pages/components, Tailwind, BFF handlers, Orval-generated client usage, or CMS UI → `stetsom-front`.
   - Backend routes, Zod schemas, OpenAPI, domains, Prisma/MongoDB, authentication enforcement, or API behavior → `stetsom-api`.
   - API contract changes consumed by the UI → coordinate both repositories in this order: API contract first, then frontend generation and usage.
2. Confirm the target repository by reading its `AGENTS.md` and relevant `.agents/rules/` before making changes.
3. Run commands with an explicit working directory. Never run a backend/database command from `stetsom-front`, or a frontend command from `stetsom-api`.
4. Treat each repository as an independent Git working tree. Check status in the target repository and preserve pre-existing user changes.

## Cross-Repository Contract Workflow

- Zod schemas registered in `../stetsom-api/src/schemas/` and its OpenAPI document are the API source of truth. Never add a frontend-only API field or hand-maintained duplicate type.
- After a backend contract change, regenerate client code in this repository with its documented `pnpm api:generate` workflow; do not edit generated files manually.
- A frontend-only UI change does not require backend edits. A backend-only implementation change does not require frontend edits unless it changes the documented contract or behavior consumed by the frontend.
- State clearly which repository or repositories a task affects before implementing cross-repository work.
