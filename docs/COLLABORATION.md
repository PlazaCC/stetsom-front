# Collaboration Guide

How we build and ship Stetsom Front.

## Git Flow

We use a **trunk-based Git Flow** with two permanent branches:

| Branch | Purpose | Deploy |
|--------|---------|--------|
| `main` | Production. Only receives merges from `develop` or hotfix PRs. | Vercel production |
| `develop` | Active development. Commits land here directly. | Vercel dev (mocks) |

No feature branches by default — commit directly to `develop`. For complex changes, you may create a short-lived branch off `develop` and open a PR back into `develop`, but this is the exception, not the rule.

## Daily Workflow

```bash
git checkout develop
git pull origin develop

# ... implement, commit directly ...
git add .
git commit -m "feat: add new section to home page"
git push origin develop
```

All commits must follow [Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `style:`, `test:`, `perf:`.

## Releases

When you are ready to ship to production:

1. Run `/release` — this opens a PR from `develop` into `main`
2. Vercel creates a **preview deployment** automatically for the PR
3. Review the preview URL — validate the site visually
4. Merge the PR using **merge commit**

On merge, the **release workflow** runs automatically:

1. `semantic-release` analyzes commits since the last tag
2. Determines the next version (`feat:` = minor bump, `fix:` = patch bump)
3. Creates a Git tag (e.g. `v0.2.0`)
4. Generates release notes from commit history
5. Creates a GitHub Release
6. Vercel deploys `main` to production (single deploy — no extra commit)
7. **Auto-syncs `develop`** by merging `main` back into `develop` — branches never diverge

No manual version bumping. No extra commits on main. No manual tags. No manual sync.

## Versioning

Versioning is fully automated via `semantic-release`:

- `feat:` commits → **minor** bump (`0.1.0` → `0.2.0`)
- `fix:` commits → **patch** bump (`0.1.0` → `0.1.1`)
- Breaking changes (footer `BREAKING CHANGE:`) → major bump

Tags are created automatically. Release notes are published on the GitHub Release page.

## Hotfixes

For critical production bugs:

```bash
git checkout main
git pull origin main
git checkout -b hotfix/<description>
# ... fix the bug ...
git add .
git commit -m "fix: <what was broken>"
git push origin hotfix/<description>
```

Open a PR from `hotfix/<description>` into `main`. After merging:

```bash
git checkout develop
git pull origin develop
git merge main   # backport the fix into develop
git push origin develop
```

## Environment Variables

| Environment | `USE_MOCK_DATA` | API target | Branch |
|-------------|-----------------|------------|--------|
| Local dev | `1` (optional) | `localhost:3333` | `develop` |
| Vercel dev | `1` | mock (`data.json`) | `develop` |
| PR preview | `1` (inherits from dev) | mock | PR |
| Production | _(not set)_ | real API | `main` |

The dev and preview environments use mock data (`USE_MOCK_DATA=1`) so no backend API is required. Production uses the real API.

See `docs/DEVELOP-ENVIRONMENT.md` for the full setup guide.

## PR Checklist

Before merging a release PR (`develop` → `main`):

- [ ] TypeScript passes (`pnpm tsc --noEmit`)
- [ ] ESLint passes (`pnpm lint`)
- [ ] Build passes (`pnpm build`)
- [ ] Preview URL reviewed and approved
- [ ] No `BREAKING CHANGE` commits without explicit team discussion