# 0003: Server Components by default

Status: Accepted

## Context

App Router lets every component choose between rendering on the server or the client. Defaulting to Client Components ships more JavaScript than most of this site's content needs, since most sections are static or fetch data once at render time.

## Decision

Components are Server Components by default. Add `"use client"` only where a component needs event handlers, React hooks, or browser APIs. Server Components fetch data at render time and never carry `"use client"` themselves.

- Shared presentational primitives in `src/components/ui/` must not contain data hooks.
- Route-co-located sections in `src/app/[route]/_components/` may contain data hooks but are not shared across routes.

## Consequences

Interactivity has to be isolated into small client boundaries instead of marking whole sections client-side. This keeps the client bundle smaller and pushes data fetching toward the server, but requires deciding the Server/Client split for every new component instead of defaulting to one mode everywhere.

Full conventions: `.agents/rules/component-architecture.md` and `.agents/rules/site-components.md`.
