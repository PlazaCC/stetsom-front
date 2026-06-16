"use client";

/**
 * CMS Design System — living styleguide.
 * Renders every foundational token + primitive in all states so the design
 * system can be verified visually in the browser (guardrail against drift).
 * Reference doc: docs/ia/figma/CMS_DESIGN_SYSTEM.md
 */

import { AdminPageHeader } from "@/app/admin/_components/admin-page-header";
import { AdminPanel } from "@/app/admin/_components/admin-panel";
import {
  AdminInput,
  AdminLabel,
  AdminSelect,
  AdminTextarea,
} from "@/app/admin/_components/crud/admin-input";
import {
  CmsButton,
  type CmsButtonProps,
} from "@/app/admin/_components/crud/cms-button";
import { StatusBadge } from "@/app/admin/_components/crud/status-badge";
import { Plus } from "lucide-react";

const COLOR_TOKENS: { name: string; className: string; hex: string }[] = [
  { name: "background", className: "bg-background", hex: "#F2F3F7" },
  { name: "card / panel", className: "bg-card", hex: "#FAFAFA" },
  { name: "primary", className: "bg-cms-primary", hex: "#4375E2" },
  { name: "primary-hover", className: "bg-cms-primary-hover", hex: "#3A67CC" },
  {
    name: "primary-subtle",
    className: "bg-cms-primary-subtle",
    hex: "#EDF2FD",
  },
  { name: "border", className: "bg-border", hex: "#D9D9D9" },
  { name: "text", className: "bg-foreground", hex: "#1A1A1A" },
  { name: "text-muted", className: "bg-cms-text-muted", hex: "#838383" },
];

const BUTTON_VARIANTS: CmsButtonProps["variant"][] = [
  "filled",
  "light",
  "outline",
  "subtle",
  "default",
  "danger",
];

const BUTTON_SIZES: CmsButtonProps["size"][] = ["xs", "sm", "md", "lg"];

const STATUSES = [
  "PUBLISHED",
  "DRAFT",
  "SCHEDULED",
  "ACTIVE",
  "INACTIVE",
  "DISCONTINUED",
];

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
        {title}
      </h2>
      <AdminPanel className="p-5">{children}</AdminPanel>
    </section>
  );
}

export default function StyleguidePage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader title="Design System" />

      <Section title="Tipografia (Geist)">
        <div className="space-y-1">
          <p className="text-2xl font-bold text-foreground">
            Heading — bold 24
          </p>
          <p className="text-base font-medium text-foreground">
            Body medium — 16
          </p>
          <p className="text-sm text-foreground">Body — 14</p>
          <p className="text-sm text-muted-foreground">
            Muted — secondary text
          </p>
        </div>
      </Section>

      <Section title="Cores">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {COLOR_TOKENS.map((t) => (
            <div key={t.name} className="space-y-1.5">
              <div
                className={`h-14 rounded-md border border-border ${t.className}`}
              />
              <div className="text-xs font-medium text-foreground">
                {t.name}
              </div>
              <div className="text-xs text-muted-foreground">{t.hex}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Botões — variantes">
        <div className="flex flex-wrap gap-3">
          {BUTTON_VARIANTS.map((variant) => (
            <CmsButton key={variant} variant={variant}>
              {variant}
            </CmsButton>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {BUTTON_SIZES.map((size) => (
            <CmsButton key={size} size={size}>
              <Plus /> Size {size}
            </CmsButton>
          ))}
          <CmsButton disabled>Disabled</CmsButton>
        </div>
      </Section>

      <Section title="Inputs">
        <div className="grid max-w-xl gap-4">
          <div>
            <AdminLabel htmlFor="sg-input">Texto</AdminLabel>
            <AdminInput id="sg-input" placeholder="Digite algo…" />
          </div>
          <div>
            <AdminLabel htmlFor="sg-select">Select</AdminLabel>
            <AdminSelect id="sg-select" defaultValue="a">
              <option value="a">Opção A</option>
              <option value="b">Opção B</option>
            </AdminSelect>
          </div>
          <div>
            <AdminLabel htmlFor="sg-textarea">Textarea</AdminLabel>
            <AdminTextarea id="sg-textarea" rows={3} placeholder="Descrição…" />
          </div>
        </div>
      </Section>

      <Section title="Status badges">
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <StatusBadge key={s} status={s} />
          ))}
        </div>
      </Section>
    </div>
  );
}
