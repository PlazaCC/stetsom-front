---
description: 'Use when deciding where to put a constant or shared data while the project uses mocks. Covers data.ts creation, inline constants, and API mock placement.'
applyTo: 'src/**/*.{ts,tsx}'
---

# Mock Data Constants — Where Does This Constant Belong?

While the project has no real backend, **do not create `data.ts` files to share constants across routes or components**. Follow the decision tree below every time you need to share a piece of data.

## Decision Tree

```
Is this data something the real API would eventually return?
├── YES → Does it fit an existing type in src/lib/api/contracts.ts?
│         ├── YES → Add the field to the mock payload in src/lib/mock/
│         │         and expose it via src/lib/api/server.ts
│         └── NO  → Update contracts.ts first (add type/field),
│                   then update mock payload, then expose via server.ts.
│                   Append a changelog entry to docs/ia/context.json.
└── NO  → Is it used only inside one single component/file?
          ├── YES → Define inline at the top of that file as
          │         SCREAMING_SNAKE_CASE const. No separate file needed.
          └── NO  → Is it used only within one route's _components/ folder?
                    ├── YES → A local data.ts in that route's _components/ is OK.
                    └── NO  → Re-evaluate: this is almost certainly API data
                               missing from the mock. Apply the YES branch above.
```

## Examples

```ts
// ❌ Wrong — cross-route import from a data.ts
import { ABOUT_STATS } from '../sobre/_components/data'

// ✅ Correct — data belongs in the API mock; consume via payload prop
// contracts.ts: stats: CompanyStat[]
// site.ts: export const COMPANY_STATS: CompanyStat[] = [...]
// server.ts: getSiteAboutPayload() returns aboutPayload.stats
{section.stats.map((stat) => ( ... ))}

// ✅ Correct — static UI data used in one file, define inline
const GALLERY_IMAGES = ['/img/a.jpg', '/img/b.jpg'] as const

// ✅ Correct — static config used only within this route's _components/
// local data.ts is OK only for this narrow case
```

## Key Rule

A `data.ts` file is only justified when the constant:
1. Is **not** API data (would never come from the backend), AND
2. Is used in **more than one file**, AND
3. Is **scoped to a single route** (`_components/` folder)

Cross-route sharing always signals missing API data — fix the mock, not the import path.
