"use client";

import type { PageSection } from "@/lib/api/contracts";
import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";
import { useState } from "react";

interface SocialFeedData {
  handle?: string;
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  postsCount?: number;
}

interface Props {
  section: PageSection;
  onChange: (data: Record<string, unknown>) => void;
}

export function SectionFormSocialFeed({ section, onChange }: Props) {
  const raw = section.data as SocialFeedData;
  const [data, setData] = useState<SocialFeedData>(raw);

  function update(patch: Partial<SocialFeedData>) {
    const next = { ...data, ...patch };
    setData(next);
    onChange(next as Record<string, unknown>);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 rounded-[12px] border border-border bg-card px-4 py-3">
        <Globe className="size-5 shrink-0 text-pink-500" />
        <p className="text-sm text-muted-foreground">
          O feed é carregado automaticamente via API do Instagram. Configure o
          perfil abaixo.
        </p>
      </div>

      <div className="rounded-[12px] border border-border bg-card p-4 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Perfil
        </p>
        <FieldGroup label="Handle (@)">
          <input
            type="text"
            value={data.handle ?? ""}
            onChange={(e) => update({ handle: e.target.value })}
            placeholder="@stetsom"
            className={inputClass}
          />
        </FieldGroup>
        <FieldGroup label="Número de posts exibidos">
          <input
            type="number"
            min={1}
            max={12}
            value={data.postsCount ?? 5}
            onChange={(e) => update({ postsCount: Number(e.target.value) })}
            className={cn(inputClass, "max-w-32")}
          />
        </FieldGroup>
      </div>

      <div className="rounded-[12px] border border-border bg-card p-4 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Textos
        </p>
        <FieldGroup label="Título da seção">
          <input
            type="text"
            value={data.title ?? ""}
            onChange={(e) => update({ title: e.target.value })}
            placeholder="ex: Siga a Stetsom"
            className={inputClass}
          />
        </FieldGroup>
        <FieldGroup label="Subtítulo">
          <input
            type="text"
            value={data.subtitle ?? ""}
            onChange={(e) => update({ subtitle: e.target.value })}
            placeholder="ex: Fique por dentro das novidades..."
            className={inputClass}
          />
        </FieldGroup>
        <div className="grid gap-3 sm:grid-cols-2">
          <FieldGroup label="Label do botão">
            <input
              type="text"
              value={data.ctaLabel ?? ""}
              onChange={(e) => update({ ctaLabel: e.target.value })}
              placeholder="ex: Ver perfil"
              className={inputClass}
            />
          </FieldGroup>
          <FieldGroup label="Link do botão">
            <input
              type="text"
              value={data.ctaHref ?? ""}
              onChange={(e) => update({ ctaHref: e.target.value })}
              placeholder="https://instagram.com/stetsom"
              className={inputClass}
            />
          </FieldGroup>
        </div>
      </div>
    </div>
  );
}

function FieldGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClass = cn(
  "h-9 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground",
  "placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-brand",
);
