"use client";

import type { I18nString } from "@/api/stetsom/model";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel } from "@/components/ui/field";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrFlag, EsFlag, UsFlag } from "@/components/ui/flag-icons";

type Locale = "pt" | "en" | "es";

const LOCALES: {
  id: Locale;
  Flag: React.ComponentType;
  required?: boolean;
  label: string;
}[] = [
  { id: "pt", Flag: BrFlag, label: "🇧🇷", required: true },
  { id: "en", Flag: UsFlag, label: "🇺🇸" },
  { id: "es", Flag: EsFlag, label: "🇪🇸" },
];

interface I18nInputProps {
  label?: string;
  /** Current i18n value — `pt` is the only required key. */
  value: I18nString | undefined;
  onChange: (value: I18nString) => void;
  required?: boolean;
  multiline?: boolean;
  placeholder?: string;
  className?: string;
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
  className,
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
                  {!filled && (
                    <span className="size-1.5 rounded-full bg-primary" />
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
          return (
            <TabsContent key={loc.id} value={loc.id} keepMounted={false}>
              {multiline ? (
                <Textarea
                  className="min-h-24"
                  required={loc.required && required}
                  placeholder={placeholder}
                  value={fieldValue}
                  onChange={(e) => set(loc.id, e.target.value)}
                />
              ) : (
                <Input
                  required={loc.required && required}
                  placeholder={placeholder}
                  value={fieldValue}
                  onChange={(e) => set(loc.id, e.target.value)}
                />
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </Field>
  );
}
