"use client";

import type { I18nString } from "@/api/stetsom/model";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel } from "@/components/ui/field";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminFieldError } from "./admin-field-error";
import { BrFlag, EsFlag, UsFlag } from "@/components/ui/flag-icons";

export type I18nLocale = "pt" | "en" | "es";
type Locale = I18nLocale;

const LOCALES: {
  id: Locale;
  Flag: React.ComponentType;
  required?: boolean;
  label: string;
}[] = [
  { id: "pt", Flag: BrFlag, label: "PT", required: true },
  { id: "en", Flag: UsFlag, label: "EN" },
  { id: "es", Flag: EsFlag, label: "ES" },
];

interface I18nInputProps {
  label?: string;
  /** Current i18n value — `pt` is the only required key. */
  value: I18nString | undefined;
  onChange: (value: I18nString) => void;
  required?: boolean;
  multiline?: boolean;
  placeholder?: string;
  /** Native input type for single-line fields (e.g. `url`). */
  type?: "text" | "url";
  /** Locales whose value failed validation — flags the tab and the input. */
  invalid?: Partial<Record<Locale, boolean>>;
  /** API field path prefix, e.g. `name` produces `name.pt`. */
  fieldPath?: string;
  className?: string;
  errors?: Partial<Record<Locale, string>>;
  onClearError?: (locale: Locale) => void;
}

/**
 * Single field that edits an `I18nString` ({ pt, en?, es? }) through PT/EN/ES
 * tabs. PT is always required. Reused across every CMS form that persists a
 * multilingual value (products, categories, templates, attributes, banners,
 * blocks). Built on shadcn `Field`, `Tabs` and `Input`/`Textarea`.
 */
export function I18nInput({
  label,
  value,
  onChange,
  required,
  multiline,
  placeholder,
  type = "text",
  invalid,
  fieldPath,
  className,
  errors,
  onClearError,
}: I18nInputProps) {
  const [active, setActive] = useState<Locale>("pt");
  const current: I18nString = value ?? { pt: "" };

  function set(locale: Locale, text: string) {
    const next: I18nString = { ...current, pt: current.pt ?? "" };
    if (locale === "pt") next.pt = text;
    else next[locale] = text || undefined;
    onChange(next);
  }

  return (
    <Field className={className}>
      <Tabs
        value={active}
        onValueChange={(v) => setActive(v as Locale)}
        className="gap-1.5"
      >
        <div className="flex items-end gap-2">
          {label && (
            <FieldLabel className="mb-0">
              {label}
              {required && <span className="text-destructive">*</span>}
            </FieldLabel>
          )}
          <TabsList className="ml-auto gap-0.5">
            {LOCALES.map((loc) => {
              const filled = loc.id === "pt" ? !!current.pt : !!current[loc.id];
              const isInvalid = Boolean(invalid?.[loc.id] || errors?.[loc.id]);
              return (
                <TabsTrigger
                  key={loc.id}
                  value={loc.id}
                  className="flex cursor-pointer gap-1.5"
                >
                  <loc.Flag />
                  <span className="text-xs leading-2 font-semibold uppercase">
                    {loc.label}
                  </span>
                  {isInvalid ? (
                    <span className="size-1.5 rounded-full bg-destructive" />
                  ) : (
                    !filled && (
                      <span className="size-1.5 rounded-full bg-primary" />
                    )
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        {/* Only the active panel is mounted (keepMounted={false}). Keeping
            inactive fields mounted previously produced a full-width off-screen
            box that expanded the document's horizontal scroll. */}
        {LOCALES.map((loc) => {
          const fieldValue =
            (loc.id === "pt" ? current.pt : current[loc.id]) ?? "";
          const isInvalid = Boolean(invalid?.[loc.id] || errors?.[loc.id]);
          return (
            <TabsContent key={loc.id} value={loc.id} keepMounted={false}>
              {multiline ? (
                <Textarea
                  className="min-h-24"
                  required={loc.required && required}
                  aria-invalid={isInvalid || undefined}
                  aria-describedby={
                    errors?.[loc.id]
                      ? `${fieldPath ?? label ?? "field"}.${loc.id}-error`
                      : undefined
                  }
                  name={fieldPath ? `${fieldPath}.${loc.id}` : undefined}
                  placeholder={placeholder}
                  value={fieldValue}
                  onChange={(e) => {
                    onClearError?.(loc.id);
                    set(loc.id, e.target.value);
                  }}
                />
              ) : (
                <Input
                  type={type}
                  required={loc.required && required}
                  aria-invalid={isInvalid || undefined}
                  aria-describedby={
                    errors?.[loc.id]
                      ? `${fieldPath ?? label ?? "field"}.${loc.id}-error`
                      : undefined
                  }
                  name={fieldPath ? `${fieldPath}.${loc.id}` : undefined}
                  placeholder={placeholder}
                  value={fieldValue}
                  onChange={(e) => {
                    onClearError?.(loc.id);
                    set(loc.id, e.target.value);
                  }}
                />
              )}
              <AdminFieldError
                id={`${fieldPath ?? label ?? "field"}.${loc.id}-error`}
                message={errors?.[loc.id]}
              />
            </TabsContent>
          );
        })}
      </Tabs>
    </Field>
  );
}
