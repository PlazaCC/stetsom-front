"use client";

import {
  AdminInput,
  AdminLabel,
} from "@/app/admin/_components/crud/admin-input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { CalendarDays, Languages, Tag } from "lucide-react";
import type { WizardAction, WizardLocale, WizardState } from "./wizard-store";

const LOCALES: { id: WizardLocale; label: string }[] = [
  { id: "pt", label: "Português" },
  { id: "en", label: "Inglês" },
  { id: "es", label: "Espanhol" },
];

interface StepPublishProps {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
  compact?: boolean;
}

export function StepPublish({
  state,
  dispatch,
  compact = false,
}: StepPublishProps) {
  const variations = state.variations.map((v) => v.label).join(", ");

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
    <div>
      <div
        className={cn(
          "grid gap-6",
          compact
            ? "grid-cols-1"
            : "grid-cols-[repeat(auto-fill,minmax(250px,1fr))]",
        )}
      >
        <div>
          <AdminLabel className="flex items-center gap-1.5">
            <CalendarDays className="size-4 text-muted-foreground" />
            Data de lançamento
          </AdminLabel>
          <div className="flex gap-2">
            <AdminInput
              type="date"
              value={state.launch_date}
              onChange={(e) =>
                dispatch({
                  type: "patch_info",
                  patch: { launch_date: e.target.value },
                })
              }
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
            />
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">
            Deixe em branco para publicar imediatamente.
          </p>
        </div>

        <div>
          <AdminLabel className="flex items-center gap-1.5">
            <Tag className="size-4 text-muted-foreground" />
            Linha
          </AdminLabel>
          <div className="flex items-center gap-6 pt-2">
            {[
              { label: "Em linha", discontinued: false },
              { label: "Descontinuado", discontinued: true },
            ].map((opt) => (
              <label
                key={opt.label}
                className="flex cursor-pointer items-center gap-2 text-sm text-foreground"
              >
                <span
                  className={cn(
                    "flex size-4 items-center justify-center rounded-full border",
                    state.is_discontinued === opt.discontinued
                      ? "border-primary"
                      : "border-border",
                  )}
                >
                  {state.is_discontinued === opt.discontinued && (
                    <span className="size-2 rounded-full bg-primary" />
                  )}
                </span>
                <input
                  type="radio"
                  name="publish-discontinued"
                  className="sr-only"
                  checked={state.is_discontinued === opt.discontinued}
                  onChange={() =>
                    dispatch({
                      type: "patch_info",
                      patch: { is_discontinued: opt.discontinued },
                    })
                  }
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <AdminLabel className="flex items-center gap-1.5">
            <Languages className="size-4 text-muted-foreground" />
            Publicar nos idiomas
          </AdminLabel>
          <div className="flex flex-col gap-2 pt-2">
            {LOCALES.map((loc) => {
              const locked = loc.id === "pt";
              const blocked = !canPublish(loc.id);

              return (
                <label
                  key={loc.id}
                  className={cn(
                    "flex items-center gap-2 text-sm text-foreground",
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
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Variações do produto</p>
          <p className="mt-1 text-sm font-medium text-foreground">
            {variations || "—"}
          </p>
        </div>
      </div>
    </div>
  );
}
