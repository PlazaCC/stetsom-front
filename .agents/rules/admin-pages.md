---
description: 'Use when creating or editing admin layout, shell, or page structure. Covers the three-zone shell, config-driven header, style scoping, auth boundary, and the Server/Client component split.'
applyTo: 'src/app/admin/**/*.{ts,tsx}'
---

# Admin Pages — Layout, Shell & Structure

## Three-Zone Shell

Every admin page lives in a three-zone layout:

| Zone | Component | Behavior |
|---|---|---|
| Sidebar | `<AdminSidebar>` | Collapsible drawer on mobile (`fixed` + scrim), static on desktop (`lg:static`) |
| Header | `<AdminShellHeader>` | Fixed top bar: breadcrumb, title, tab bar — driven by config |
| Content | `<AdminPageLayout>` | Scrollable `<main>` with optional fixed footer (via `footer` prop) |

```tsx
// layout composition
<AdminShell>
  <AdminSidebar />
  <div className="flex flex-1 flex-col overflow-hidden">
    <AdminShellHeader />
    <main className="flex-1 overflow-y-auto">
      <AdminPageLayout footer={...}>
        {children}
      </AdminPageLayout>
    </main>
  </div>
</AdminShell>
```

## Config-Driven Header

All route metadata lives in `@/lib/cms/config.ts` — a static map keyed by route pattern:

- Title, icon, tab bar definitions, breadcrumb visibility, sidebar visibility
- `resolveRoute()` matches live pathnames to patterns (treating `[param]` segments as wildcards)
- `buildBreadcrumb()` walks URL prefixes to build the trail
- `resolveTabs()` climbs the URL hierarchy to find the nearest ancestor with tabs

Pages never render their own `<h1>` or `<nav>`. Override the title dynamically:
- Server Component: `<SetRouteLabel label="Product Name" />`
- Client Component: `useRouteLabel("Product Name")`

## Style Scoping

Admin styles are scoped under `.cms`:

- Apply `<div className="cms">` in `src/app/admin/layout.tsx`
- `src/app/admin/admin.css` remaps shadcn tokens (`--primary`, `--card`, `--background`, etc.) to CMS-specific CSS variables
- Components use semantic shadcn classes (`bg-card`, `text-primary`, `text-muted-foreground`) — they resolve to the CMS look inside `.cms`
- Avoid `cms-`-prefixed classes for common cases; use `var(--cms-*)` only for admin.css internals

## Auth Boundary

- **No middleware or layout guard.** Authentication is enforced at the API level — the BFF proxy returns 401 for unauthenticated requests
- Each admin page handles 401 gracefully: "Session expired" message with login link
- Three dedicated API routes: `/api/auth/login`, `/api/auth/refresh`, `/api/auth/logout`
- Tokens stored as HttpOnly cookies: `admin_token` (path `/`, 8h) and `admin_refresh_token` (path `/api/auth/refresh`, 7d)
- Login page is a client form — hides sidebar chrome via `pathname === "/admin/login"` check in shell

## Server/Client Component Boundary

- Keep page files as Server Components when they only render client components via props
- Draw `"use client"` at the component that introduces interactivity (hooks, event handlers), not at the page file
- Keep layout-only components as Server Components: `<AdminPageLayout>`, `<AdminFormSection>`, `<AdminPanel>`, `<StatusBadge>`, `<AdminEmptyState>`, `<AdminActionBar>`, `<CmsButton>`