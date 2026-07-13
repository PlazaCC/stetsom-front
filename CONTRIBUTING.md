# Contributing to Stetsom Front

Stetsom Front is the institutional website and admin CMS for Stetsom. The internal engineering team maintains this repository.

The repository is public, but external pull requests are not accepted. Report bugs through GitHub Issues. Report security vulnerabilities as described in [SECURITY.md](./SECURITY.md).

## Getting Started

See the [README](./README.md) for the stack, commands, and project structure. See [Develop Environment Setup](./docs/DEVELOP-ENVIRONMENT.md) for local variables, mock data, and Vercel environments.

```bash
pnpm install
pnpm dev
```

## Standards

Read `AGENTS.md`, `CLAUDE.md`, and `.agents/rules/` before changing the codebase. Commits follow [Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `style:`, `test:`, or `perf:`.

Husky runs local checks before each commit. It formats staged supported files, fixes staged TypeScript files with ESLint, and runs `pnpm tsc --noEmit`.

## Branches

| Branch | Purpose | Deployment |
| --- | --- | --- |
| `develop` | Active development. Direct commits are allowed. | [Development](https://stetsom-develop.vercel.app) with mock data |
| `main` | Production. Receives release and hotfix pull requests only. | [Production](https://stetsom-prod.vercel.app) |

Use `develop` for normal work. Create a short-lived branch only when direct work is impractical, then open a pull request into `develop`.

The development environment currently uses mock data. This is temporary while the dedicated API environment is provisioned. Do not add mock-only behavior to new features.

The final domain `https://stetsom.com.br` is not wired up yet. Production currently serves from the Vercel domain above.

## Daily Work

```bash
git switch develop
git pull origin develop

# Make changes and commit them.
git add .
git commit -m "feat: add new section to home page"
git push origin develop
```

Pushing to `develop` deploys the development environment. The full CI suite runs when a pull request targets `develop` or `main`.

## Release

1. Update `develop` and run the local checks:

   ```bash
   git switch develop
   git pull origin develop
   pnpm tsc --noEmit
   pnpm lint
   pnpm build
   ```

2. Open a pull request from `develop` into `main`.

   ```bash
   gh pr create --base main --head develop --title "<summary>" --body "<what changed>"
   ```

3. Wait for `build-and-lint` and the Vercel preview.
4. Review the preview and merge with a merge commit.

Configure the `main` ruleset to require the pull request and its checks. Merging deploys production. `sync-develop.yml` then fast-forwards `develop` to `main`.

The `/release` skill can prepare the release PR after the same local checks. It does not replace the GitHub review and merge process.

## Hotfixes

For a critical production fix, branch from `main` and open a pull request back into `main`.

```bash
git switch main
git pull origin main
git switch -c hotfix/<description>

# Make the fix and push it.
git add .
git commit -m "fix: <what was broken>"
git push origin hotfix/<description>
```

After the hotfix merges, update `develop` manually:

```bash
git switch develop
git pull origin develop
git merge main
git push origin develop
```

## Versioning

Create tags manually for milestone releases:

```bash
git tag v0.2.0
git push origin v0.2.0
```

## Pull Requests

Use the [pull request template](./.github/pull_request_template.md). Before merging, confirm:

- [ ] `build-and-lint` passes
- [ ] The Vercel preview was reviewed
- [ ] The change was manually tested
- [ ] Documentation was updated when needed
- [ ] No secrets or sensitive data are included
