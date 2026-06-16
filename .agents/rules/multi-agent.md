# Multi-Agent Coordination

Stetsom Front uses a **dual-install pattern** to support multiple AI agents: Claude Code (CLI) and VSCode Copilot Chat.

## Agent Locations

| Agent | Directory Structure | Purpose |
|-------|---------------------|---------|
| **Claude Code** | `.claude/rules/` (auto-loaded) | Primary agent with global context |
| | `.claude/skills/` | Agent-specific skills |
| | `.claude/settings.json` | PreToolUse hooks (graphify enforcement) |
| **VSCode Copilot Chat** | `.agents/skills/` | Auto-discovered skills |
| | `.agents/rules/` | Rules for agent behavior |

## Graphify Integration

**MANDATORY: Always use graphify before reading source files.**

### Priority Chain (for Read/Glob tools)
1. Check `graphify-out/graph.json` exists
2. Run `graphify query "<question>"` to get scoped subgraph
3. Only read files if graphify confirms scope
4. Include graphify prompt in all subagent operations

### PreToolUse Hooks
The `settings.json` file enforces graphify-first queries via:
- **Read/Glob matcher:** Catches file reads and pattern searches
- Emits additionalContext when graph is available

### Agent-Specific Behavior

**Claude Code:**
- Can rebuild graph via `/graphify` skill
- Can run `graphify . --update` for incremental builds
- Hooks apply to all tool calls
- Codex-sific deployment scripts available

**VSCode Copilot Chat:**
- **Read-only access** to graph (`graphify-out/`)
- **Cannot regenerate** graph (use Claude Code CLI `/graphify`)
- Skills loaded from `.agents/skills/` auto-discovered
- Rules from `.agents/rules/` apply automatically

**Codex:**
- Similar to VSCode Copilot Chat (no git commit access)
- Use `.agents/rules/AGENTS.md` for guidance
- Supports claimable deploy endpoints (see deploy-to-vercel skill)

## Graphify Documentation

See `.claude/skills/graphify/SKILL.md` for full usage instructions.

## Regenerating the Graph

Run in Claude Code CLI terminal:
```bash
graphify install --project
graphify .
```

Recommended after:
- Adding or removing 5+ source files
- Major refactor or modularization pass
- Before a full design-fidelity-audit

## Graph Structure (Frontend)

**God nodes (most-connected abstractions):**
1. `cn()` — Universal Tailwind class merger (41 edges)
2. `Button()` — Button component (7 edges)
3. `buttonVariants` — Button variants (6 edges)

**Main communities:**
- Utilities (contains `cn`, navigation, dropdowns)
- Pages & Routes (product listing, route types)
- UI Components (hero, FAQ, support page)
- Technology Stack (Next.js config, fonts, providers)

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
```

## Example Workflow

**Scenario:** Finding all files that use the Barlow font

1. **VSCode Copilot Chat agent:** Runs
   ```bash
   graphify query "what files import Barlow font"
   ```

2. **Read output:**
   - JSON shows edges pointing to `font-barlow` node
   - Report lists affected components and pages

3. **Optional:** Read specific files if needed
   ```bash
   # AFTER graphify oriented you
   grep -r "Barlow" src/
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

## Resources

- **Full documentation:** See `.claude/skills/graphify/SKILL.md`
- **Multi-agent config:** See `.agents/rules/multi-agent.md`
- **Official docs:** https://github.com/safishamsi/graphify