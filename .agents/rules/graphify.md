# Graphify Usage for Non-Claude Agents

## Overview

This document explains how VSCode Copilot Chat agents should use the graphify knowledge graph. Note that VSCode Copilot Chat agents have **read-only access** to the graph — they cannot regenerate it.

## Access

**Read the graph:**
- `graphify-out/graph.json` — Full graph data (JSON)
- `graphify-out/graph.html` — Interactive visualization (open in browser)
- `graphify-out/GRAPH_REPORT.md` — Human-readable summary (god nodes, communities, knowledge gaps)

**Stetsom Front specific:**
- **God nodes:** `cn()` (41 edges), `Button()` (7 edges), `buttonVariants` (6 edges)
- **Communities:** Utilities, Pages & Routes, UI Components, Technology Stack

## How to Use

### 1. Codebase Orientation (New Area)

1. Read `graphify-out/GRAPH_REPORT.md`
2. Identify which community your target file belongs to
3. Look up its god nodes to understand what it depends on

Example:
```bash
# Read the report first
cat graphify-out/GRAPH_REPORT.md

# The report will show communities like:
# - Utilities (contains cn, navigation, dropdowns)
# - Pages & Routes (product listing, route types)
# - UI Components (hero, FAQ, support page)
# - Technology Stack (Next.js config, fonts, providers)
```

### 2. Impact Analysis (Before a Change)

1. Find your target symbol in `graph.json` under `"nodes"`
2. Look at all edges where it appears as `source` or `target`
3. Any `target` nodes with high `degree` are high-risk ripple targets

Example (JSON query):
```json
{
  "nodes": [
    {
      "id": "cn",
      "type": "function",
      "degree": 41,
      "edges": [...]
    }
  ]
}
```

### 3. Finding Hidden Dependencies

The GRAPH_REPORT.md "Surprising Connections" section lists inferred edges that aren't obvious from reading the code. Check these before refactoring.

Example edge:
```
cn ↔ Button
Relation: INFERRED — "Common Tailwind utility function used throughout UI components"
```

## Recommended Workflow

### For VSCode Copilot Chat Agents

**Step 1:** Always start with graphify when exploring codebase
```bash
graphify query "what components use the cn utility?"
```

**Step 2:** Read the output
- JSON: Use graph.json directly (parse it)
- Markdown: Read GRAPH_REPORT.md for high-level insights

**Step 3:** Only read files if graphify doesn't have enough info
```bash
# AFTER graphify has oriented you
grep -r "cn(" src/
```

**Step 4:** Document your findings
- Mention which graph nodes you used
- Note any surprising connections discovered

### When to Use Graphify

✅ **Do use graphify when:**
- Exploring unfamiliar codebase area
- Understanding dependencies between components
- Finding all usages of a specific utility/function
- Understanding Tailwind class mergers
- Looking for hidden coupling

❌ **Don't use graphify when:**
- Modifying/debugging specific lines (graphify is read-only)
- Need exact line numbers (graphify shows files, not line numbers)
- Looking for literal strings in code
- Need to see actual code implementation

## Graph Structure (Frontend)

**God nodes (most-connected abstractions):**
1. `cn()` — Universal Tailwind class merger (41 edges)
   - Found in: `src/lib/utils.ts`
   - Used in: virtually every component
   - **Touch carefully:** Changing this affects the entire UI

2. `Button()` — Button component (7 edges)
   - Found in: `src/components/ui/button.tsx`
   - Used in: navigation, forms, calls-to-action

3. `buttonVariants` — Button variants (6 edges)
   - Found in: `src/components/ui/button.tsx`
   - Used in: consistent button styling across app

**Main communities:**
- Utilities (contains `cn`, navigation, dropdowns)
- Pages & Routes (product listing, route types)
- UI Components (hero, FAQ, support page)
- Technology Stack (Next.js config, fonts, providers)

## Regenerating the Graph

**You CANNOT regenerate the graph** — use Claude Code CLI instead.

To regenerate:
```bash
# In Claude Code CLI
cd /path/to/stetsom-front
/graphify
```

## Subagent Integration

When invoking subagents (especially Codex), include graphify context:
```markdown
## Instructions for Subagent

1. Before using any Read/Glob commands:
   ```bash
   graphify query "<your exploration question>"
   ```

2. Read the graph output:
   - `graphify-out/GRAPH_REPORT.md` for overview
   - `graphify-out/graph.json` for detailed analysis

3. Only read files if graphify doesn't provide enough information

4. Report which graph nodes you consulted in your findings

5. **Important:** Do NOT modify the graph (read-only access)
```

## Error Handling

**If graphify-out doesn't exist:**
- Claude Code agent should rebuild: `/graphify`
- VSCode Copilot Chat agent should ask Claude Code to rebuild
- Or ask user: "Should I rebuild the knowledge graph first?"

**If graphify-out exists but is stale:**
- Claude Code agent should rebuild: `graphify . --update`
- VSCode Copilot Chat agent should notify user: "The graph is stale (last run: [date]). Recommend rebuilding."

## Performance Notes

- Graphify extraction is **fast** (AST via tree-sitter)
- Semantic analysis (INFERRED edges) can be slower (depends on LLM backend)
- `graphify-out/cache/` contains parsed ASTs for incremental builds
- Committing `cache/ast/` improves speed for subsequent builds

## Special Considerations

### `cn()` Utility
- **Central utility:** This is the Tailwind class merger function
- **High edge count (41) is expected**, not a smell
- Changes ripple everywhere through the UI
- Don't refactor unless absolutely necessary

### `_components/` Directories
- Co-located with routes (not shared)
- Edges between different route's `_components/` indicate unintended coupling
- Graphify can identify this pattern for refactoring guidance

### `src/components/ui/` Shared Layer
- Shared components should have many inbound edges from pages/sections
- Edges going FROM here TO other layers suggest coupling issues

## Resources

- **Full documentation:** See `.claude/skills/graphify/SKILL.md`
- **Multi-agent config:** See `.agents/rules/multi-agent.md`
- **Official docs:** https://github.com/safishamsi/graphify