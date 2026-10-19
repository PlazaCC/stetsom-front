"use client";

import { AdminInput } from "@/app/admin/_components/crud/admin-input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  CalendarDays,
  Languages,
  Layers,
  PackageCheck,
  Tag,
  type LucideIcon,
} from "lucide-react";
import type { WizardAction, WizardLocale, WizardState } from "./wizard-store";

const LOCALES: { id: WizardLocale; label: string }[] = [
  { id: "pt", label: "Português" },
  { id: "en", label: "Inglês" },
  { id: "es", label: "Espanhol" },
];

const LINE_OPTIONS = [
  { label: "Em linha", discontinued: false },
  { label: "Descontinuado", discontinued: true },
];

interface StepPublishProps {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
  compact?: boolean;
}

/** One publishing setting: title and hint on top, its control beneath. */
function PublishSection({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-md border border-border bg-card px-4 py-3.5">
      <div className="flex items-start gap-2.5">
        <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          {description && (
            <p className="mt-0.5 text-xs text-muted-foreground">
              {description}
            </p>
          )}
          <div className="mt-3">{children}</div>
        </div>
      </div>
    </section>
  );
}

export function StepPublish({
  state,
  dispatch,
  compact = false,
}: StepPublishProps) {
  /** pt is the fallback locale and is always published. */
  function isPublished(locale: WizardLocale): boolean {
    return locale === "pt" || state.available_locales.includes(locale);
  }

  /** A locale can only be published once its own product name is filled in. */
  function canPublish(locale: WizardLocale): boolean {
    return locale === "pt" || Boolean(state.name[locale]?.trim());
  }

  function toggleLocale(locale: WizardLocale, enabled: boolean) {
    const next = enabled
      ? [...state.available_locales, locale]
      : state.available_locales.filter((l) => l !== locale);

    dispatch({
      type: "patch_info",
      patch: { available_locales: [...new Set(next)] },
    });
  }

  return (
    <div className={cn("flex flex-col gap-3", !compact && "max-w-2xl")}>
      <PublishSection
        icon={Languages}
        title="Publicar nos idiomas"
        description="Português é sempre publicado. Os outros idiomas exigem o nome do produto traduzido."
      >
        <div className="flex flex-col gap-2.5">
          {LOCALES.map((loc) => {
            const locked = loc.id === "pt";
            const blocked = !canPublish(loc.id);

            return (
              <label
                key={loc.id}
                className={cn(
                  "flex items-center gap-2.5 text-sm text-foreground",
                  locked || blocked ? "cursor-not-allowed" : "cursor-pointer",
                )}
              >
                <Switch
                  size="sm"
                  checked={isPublished(loc.id)}
                  disabled={locked || blocked}
                  onCheckedChange={(checked) => toggleLocale(loc.id, checked)}
                />
                <span className={cn(blocked && "text-muted-foreground")}>
                  {loc.label}
                </span>
                {blocked && (
                  <span className="text-xs text-muted-foreground">
                    — preencha o nome em {loc.label.toLowerCase()}
                  </span>
                )}
              </label>
            );
          })}
        </div>
      </PublishSection>

      <PublishSection
        icon={CalendarDays}
        title="Data de lançamento"
        description="Deixe em branco para publicar imediatamente."
      >
        <div className="flex flex-wrap gap-2">
          <AdminInput
            type="date"
            value={state.launch_date}
            onChange={(e) =>
              dispatch({
                type: "patch_info",
                patch: { launch_date: e.target.value },
              })
            }
            className="w-auto"
          />
          <AdminInput
            type="time"
            value={state.launch_time}
            onChange={(e) =>
              dispatch({
                type: "patch_info",
                patch: { launch_time: e.target.value },
              })
            }
            className="w-auto"
          />
        </div>
      </PublishSection>

      <PublishSection
        icon={Tag}
        title="Situação"
        description="Marca o produto como fora de linha no site."
      >
        <div
          role="radiogroup"
          aria-label="Situação do produto"
          className="flex flex-wrap items-center gap-x-6 gap-y-2"
        >
          {LINE_OPTIONS.map((opt) => {
            const checked = state.is_discontinued === opt.discontinued;
            return (
              <label
                key={opt.label}
                className="flex cursor-pointer items-center gap-2 text-sm text-foreground"
              >
                <span
                  className={cn(
                    "flex size-4 items-center justify-center rounded-full border",
                    checked ? "border-primary" : "border-border",
                  )}
                >
                  {checked && (
                    <span className="size-2 rounded-full bg-primary" />
                  )}
                </span>
                <input
                  type="radio"
                  name="publish-discontinued"
                  className="sr-only"
                  checked={checked}
                  onChange={() =>
                    dispatch({
                      type: "patch_info",
                      patch: { is_discontinued: opt.discontinued },
                    })
                  }
                />
                {opt.label}
              </label>
            );
          })}
        </div>
      </PublishSection>

      <PublishSection
        icon={PackageCheck}
        title="Produto de exportação"
        description="Aparece na listagem de produtos de exportação."
      >
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-foreground">
          <Switch
            size="sm"
            checked={state.is_export}
            onCheckedChange={(checked) =>
              dispatch({ type: "patch_info", patch: { is_export: checked } })
            }
          />
          Disponível para exportação
        </label>
      </PublishSection>

      <PublishSection
        icon={Layers}
        title="Variações do produto"
        description="Edite as variações no passo Specs."
      >
        {state.variations.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {state.variations.map((variation) => (
              <span
                key={variation.id}
                className="rounded-md border border-border bg-muted/50 px-2 py-0.5 text-xs font-medium text-foreground"
              >
                {variation.label || "Sem nome"}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">—</p>
        )}
      </PublishSection>
    </div>
  );
}
