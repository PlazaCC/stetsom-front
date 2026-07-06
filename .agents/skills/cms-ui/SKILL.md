---
name: cms-ui
description: 'Build any Stetsom CMS/admin interface with the project shadcn setup (base-nova / Base UI): pick the right primitive, install missing ones correctly, and follow the project composition patterns for layout, dialogs, tabs, tables and forms (react-hook-form + zod). Use when creating or editing any admin/CMS screen, form, dialog, table, or when you need a shadcn component that is not installed yet. Triggers: create cms screen, build admin ui, admin form, cms form, add shadcn component, install component, dialog, modal, tabs, data table, form validation, react-hook-form, zod, formulário do cms, tela do admin.'
argument-hint: '[screen/component you are building, e.g. "banners edit dialog"]'
---

# CMS UI — shadcn in Stetsom Front

How to build admin/CMS interfaces with this project's component system. Read this
before adding a screen, form, dialog, table, or any `src/components/ui` primitive.

## Ground rules

- **Style is `base-nova`** (Base UI under the hood, **not** Radix). Every primitive
  wraps `@base-ui/react/*` and uses `cn()` + `cva`. When you add a component with the
  CLI it pulls the Base UI variant — don't hand-write a Radix version.
- **Never hardcode colors/sizes.** Use tokens (`.claude/rules/tailwind.md`). `cn()` (`@/lib/utils`) merges classes with
  tailwind-merge, so later utilities win over a primitive's defaults.
- **Server Component by default**; add `"use client"` only for state/effects/handlers.
- Presentational primitives live in `src/components/ui/`; route-specific sections in
  `src/app/<route>/_components/`. See `.claude/rules/component-architecture.md`.
- The admin shell owns the page scroll — `<main>` is the only scroll container. Don't
  nest scroll containers unless the screen deliberately fills `<main>` and owns a single
  inner scroll (see the biblioteca and product-editor layouts).

## Installing a component

```bash
pnpm dlx shadcn@latest add <component> [<component> ...]
```

- The CLI prompts to overwrite files that already exist (`button.tsx`, `label.tsx`, …).
  **Answer no** to keep the project versions — pipe `n` answers when running
  non-interactively: `printf 'n\nn\nn\n' | pnpm dlx shadcn@latest add <component>`.
- `base-nova` does **not** ship a `form` item — for forms use react-hook-form + zod
  directly (see below), not `shadcn add form`.
- After adding, the file lands in `src/components/ui/`. Re-check its imports resolve to
  `@base-ui/react/*` and it uses the project `cn()`.

## Already installed (`src/components/ui/`)

`accordion` · `breadcrumb` · `button` · `checkbox` · `collapsible` · `combobox` ·
`dialog` · `dropdown-menu` · `field` · `input` · `input-group` · `label` ·
`navigation-menu` · `pagination` · `progress` · `radio-group` · `select` ·
`separator` · `skeleton` · `sonner` (toast) · `switch` · `table` · `tabs` ·
`textarea` · `toggle` · `toggle-group` · `tooltip`.

Project-specific (not shadcn): `container`, `cta-button`, `section-label`, `logo`,
`product-card`, `flag-icons`, `language-switcher`, `model-3d-viewer`, `youtube-embed`.

Common ones **not yet installed** (add on demand): `sheet`, `alert-dialog`, `popover`,
`hover-card`, `context-menu`, `command`, `avatar`, `card`, `badge`, `alert`,
`aspect-ratio`, `slider`, `calendar`, `date-picker`, `sidebar`, `scroll-area`, `menubar`.

## Which primitive do I need?

| Need | Use |
|---|---|
| Modal edit/create form | `dialog` |
| Destructive confirm | `AdminConfirmDialog` (`admin/_components/crud`) — already built |
| Side drawer | `sheet` (install) |
| Sectioned form / labelled input | `field` (`Field`, `FieldLabel`, `FieldError`, `FieldDescription`) |
| Single-select from many, searchable | `combobox` |
| Small fixed set of options | `select` or `radio-group` |
| On/off | `switch` |
| Segmented single choice (grid/table toggle) | `toggle-group` (single-select; see note) |
| In-page sub-navigation | `tabs` |
| Multilingual text (`I18nString`) | `I18nInput` (`admin/_components/crud`) — already built |
| Tabular data | `table` (raw) or a `@tanstack/react-table` data table |
| Loading placeholder | `skeleton` + a progress bar |
| Toast feedback | `sonner` |
| List pagination (numbered) | `AdminPagination` (`admin/_components/crud`) |

## Composition patterns

### Dialog (Base UI)

`Root` uses `open` + `onOpenChange(open)`; Escape and backdrop click both call it.
`DialogContent` centers a popup and renders the close (X). Override its defaults via
`className` (tailwind-merge wins), e.g. a split layout:

```tsx
<Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
  <DialogContent showCloseButton className="max-w-3xl overflow-hidden p-0 sm:max-w-3xl md:max-h-[85vh]">
    <div className="grid md:grid-cols-[1fr_360px]">{/* preview | panel */}</div>
  </DialogContent>
</Dialog>
```

Dialogs are portalled and own their own scroll — a `max-h-[85vh]` + inner
`overflow-y-auto` is fine here and does not violate the shell scroll rule.

### Tabs (Base UI)

Controlled with `value` + `onValueChange(value: string)`. `TabsContent` accepts
`keepMounted={false}` to mount only the active panel.

### Toggle group (Base UI)

Single-select still exposes an **array** API. Wire it as:

```tsx
<ToggleGroup value={[mode]} onValueChange={(v: string[]) => { const next = v[0]; if (next) setMode(next as Mode); }} variant="outline" size="sm">
  <ToggleGroupItem value="grid" aria-label="Grade"><LayoutGrid /></ToggleGroupItem>
</ToggleGroup>
```

The `onValueChange` param is typed `string[]` (the wrapper doesn't forward the generic).
Guard against the empty array so one item stays selected.

### Layout wrappers

`AdminListPage` / `AdminPanel` / `AdminFormSection` (`admin/_components/`) give the
standard bordered admin surfaces. `AdminSearchInput`, `AdminPagination`,
`AdminConfirmDialog`, `AdminFileUpload`, `LibraryAssetPicker` are ready-made.

## Forms — react-hook-form + zod (project standard)

`react-hook-form`, `zod` and `@hookform/resolvers` are installed. Because zod 4 is
Standard-Schema compliant and `base-nova` has no `form` item, use
**`standardSchemaResolver`** (not `zodResolver` — its types drift against zod 4 here).

```tsx
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";

const schema = z.object({ name: z.string().min(1, "Obrigatório"), alt: z.object({ pt: z.string() }) });
type Values = z.infer<typeof schema>;

const form = useForm<Values>({ resolver: standardSchemaResolver(schema), defaultValues });

const mutation = useMutation({
  mutationFn: (v: Values) => patchApiThing(id, v),   // generated Orval fn
  onSuccess: onSaved,
});

<form onSubmit={form.handleSubmit((v) => mutation.mutate(v))}>
  <Field data-invalid={!!form.formState.errors.name}>
    <FieldLabel htmlFor="name">Nome</FieldLabel>
    <Input id="name" aria-invalid={!!form.formState.errors.name} {...form.register("name")} />
    <FieldError errors={[form.formState.errors.name]} />
  </Field>

  {/* Controlled primitives (I18nInput, Select, Switch) go through Controller */}
  <Controller control={form.control} name="alt" render={({ field }) => (
    <I18nInput label="Alt" value={field.value} onChange={field.onChange} />
  )} />
</form>
```

Rules:
- **Uncontrolled inputs** (`Input`, `Textarea`): `{...form.register("field")}`.
- **Controlled primitives** (`I18nInput`, `Select`, `Switch`, `Combobox`, `RadioGroup`):
  wrap in `Controller` and bind `value` + `onChange` (never `register`).
- Submit through a react-query `useMutation` calling the **generated Orval** function.
  Never `fetch()` stetsom-api directly (`.claude/rules/api-integration.md`).
- Surface API failures with `toApiError(err)` from `@/api/stetsom/orval-client`; branch on
  `err.code`, display `err.message`, never branch on the message text.
- Every visible label/placeholder goes through next-intl messages and mock i18n uses the
  `pt` key, not `pt-BR` (`.claude/rules/i18n-multilanguage.md`).

## Reference rules

`.claude/rules/`: `component-architecture.md`, `styling-practices.md`, `tailwind.md`,
`code-conventions.md`, `api-integration.md`, `i18n-multilanguage.md`,
`product-data-schema.md`.
