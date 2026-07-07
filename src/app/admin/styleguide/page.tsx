"use client";

/**
 * CMS Design System — living styleguide.
 * Renders every foundational token + primitive in all states so the design
 * system can be verified visually in the browser (guardrail against drift).
 * Reference doc: docs/ia/figma/CMS_DESIGN_SYSTEM.md
 */

import { AdminPanel } from "@/app/admin/_components/admin-panel";
import {
  AdminDataTable,
  type AdminTableColumn,
} from "@/app/admin/_components/crud/admin-data-table";
import {
  AdminLabel,
  AdminTextarea,
} from "@/app/admin/_components/crud/admin-input";
import {
  AdminRowAction,
  AdminRowActions,
} from "@/app/admin/_components/crud/admin-row-actions";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

type SampleRow = {
  id: string;
  name: string;
  category: string;
  status: string;
};

const SAMPLE_ROWS: SampleRow[] = [
  {
    id: "1",
    name: "ST-4000EQ",
    category: "Amplificadores",
    status: "PUBLISHED",
  },
  { id: "2", name: "Vulcan 5K", category: "Amplificadores", status: "DRAFT" },
  { id: "3", name: "HL-1200", category: "Alto-falantes", status: "SCHEDULED" },
  { id: "4", name: "NX-2000", category: "Módulos", status: "INACTIVE" },
];

const TABLE_COLUMNS: AdminTableColumn<SampleRow>[] = [
  {
    key: "name",
    header: "Nome",
    render: (row) => (
      <span className="font-medium text-foreground">{row.name}</span>
    ),
  },
  {
    key: "category",
    header: "Categoria",
    render: (row) => (
      <span className="text-muted-foreground">{row.category}</span>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (row) => <StatusBadge status={row.status} />,
  },
  {
    key: "actions",
    header: "",
    headerClassName: "text-right",
    className: "text-right",
    render: () => (
      <AdminRowActions>
        <AdminRowAction>Editar</AdminRowAction>
        <AdminRowAction variant="destructive">Excluir</AdminRowAction>
      </AdminRowActions>
    ),
  },
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
    <div className="space-y-8 px-4 py-4 lg:px-11.75 lg:py-7.25">
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
            <Input id="sg-input" placeholder="Digite algo…" />
          </div>
          <div>
            <AdminLabel htmlFor="sg-select">Select</AdminLabel>
            <Select defaultValue="a">
              <SelectTrigger id="sg-select" className="w-full">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="a">Opção A</SelectItem>
                <SelectItem value="b">Opção B</SelectItem>
              </SelectContent>
            </Select>
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

      <Section title="Tabelas">
        {/* AdminDataTable needs a bounded-height parent to render its scroll body. */}
        <div className="h-64">
          <AdminDataTable
            columns={TABLE_COLUMNS}
            data={SAMPLE_ROWS}
            keyExtractor={(row) => row.id}
            emptyTitle="Nenhum registro"
          />
        </div>
      </Section>
    </div>
  );
}
