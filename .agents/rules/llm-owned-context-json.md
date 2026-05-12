---
description: 'Use when editing any file, implementing features, fixing bugs, refactoring, or updating docs. Covers mandatory maintenance of docs/ia/context.json as an LLM-owned history with compaction and deduplication.'
applyTo: '**/*'
---

# LLM Owned Context JSON Guidelines

- After any project change, update docs/ia/context.json in the same work batch.
- For each context entry, record timestamp, change summary, rationale, affected files, and outcome.
- Keep entries concise and structured; prefer short fields over long narrative text.
- Compact context aggressively: merge overlapping entries, remove repeated facts, and avoid unchanged duplication.
- Preserve JSON validity and stable key ordering to reduce noisy diffs.
- Never store secrets, tokens, credentials, or large raw code blocks in docs/ia/context.json.
- If file size starts hurting performance, summarize older entries while preserving key decisions and outcomes.
