---
name: graphify
description: '(Re)generate the codebase knowledge graph for Stetsom Front. Builds a clustered community graph from all source files and writes results to graphify-out/. Use after major structural changes, large refactors, or when codebase orientation is needed. Trigger: /graphify'
argument-hint: '[optional: path or glob to scope the graph — defaults to entire codebase]'
---

# Graphify — Stetsom Front Knowledge Graph

## Output Location

All graph artifacts are written to `graphify-out/` in the project root:

```
graphify-out/
  GRAPH_REPORT.md    ← Human-readable summary (start here)
  graph.html         ← Interactive visualization (open in browser)
  graph.json         ← Full graph data
  manifest.json      ← Run metadata
  cost.json          ← Token cost of last run
  cache/ast/         ← AST cache (do not edit)
```

## When to Regenerate

- After adding or removing 5+ source files
- After a major modularization or refactor pass
- When a new agent joins the project and needs codebase orientation
- Before running `design-fidelity-audit` on a new area of the codebase

## Reading the Graph Report

`graphify-out/GRAPH_REPORT.md` contains:

1. **God Nodes** — the most-connected abstractions. Currently: `cn()` (41 edges), `Button()` (7), `buttonVariants` (6). Touch these carefully — changes ripple everywhere.
2. **Communities** — logical clusters of related code. The main clusters are: Utilities, Pages & Routes, UI Components, Technology Stack.
3. **Knowledge Gaps** — isolated nodes with ≤1 connection. These are candidates for documentation or integration.
4. **Surprising Connections** — inferred edges the graph discovered that aren't obvious from reading the code.

## Invocation

The `graphify` skill is registered globally via the harness. Invoke it with `/graphify` in Claude Code. It will:

1. Crawl all files matching the default or provided glob
2. Extract AST-level symbols and relationships
3. Build a graph with community detection
4. Write all artifacts to `graphify-out/`
5. Print a summary of god nodes and communities

## Stetsom Front Context

Key facts about this codebase that inform graph interpretation:

- **`cn()`** from `src/lib/utils.ts` is intentionally universal — it's the Tailwind class merger. High edge count is expected, not a smell.
- **`Button()`** from `src/components/ui/button.tsx` should only be imported where interaction is needed — unexpected usages in server components are a smell.
- **`_components/`** directories are co-located and route-scoped — edges between different route's `_components/` indicate unintended coupling.
- **`src/components/ui/`** is the shared layer — components here should have many inbound edges from pages/sections.
