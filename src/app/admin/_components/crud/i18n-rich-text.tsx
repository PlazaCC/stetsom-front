"use client";

import type { I18nString } from "@/api/stetsom/model";
import { RichTextEditor } from "@/components/editor/rich-text/rich-text-editor";
import type { RichTextProfile } from "@/components/editor/rich-text/extension";
import { Field, FieldLabel } from "@/components/ui/field";
import { BrFlag, EsFlag, UsFlag } from "@/components/ui/flag-icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

type Locale = "pt" | "en" | "es";

const LOCALES: { id: Locale; Flag: React.ComponentType; label: string }[] = [
  { id: "pt", Flag: BrFlag, label: "PT" },
  { id: "en", Flag: UsFlag, label: "EN" },
  { id: "es", Flag: EsFlag, label: "ES" },
];

/** An empty ProseKit document serialises to this — treated as "no content". */
const EMPTY_HTML_PATTERNS = ["", "<p></p>", "<p><br></p>", "<p><br/></p>"];

function isEmptyHtml(html: string): boolean {
  return EMPTY_HTML_PATTERNS.includes(html.trim());
}

interface I18nRichTextProps {
  label?: string;
  value: I18nString | undefined;
  onChange: (value: I18nString) => void;
  /** Capability set — must match the profile the API applies to this field. */
  profile?: RichTextProfile;
  required?: boolean;
  placeholder?: string;
  className?: string;
}

/**
 * The rich-text counterpart of `I18nInput`: edits an `I18nString` whose values
 * are sanitized HTML, through PT/EN/ES tabs.
 *
 * Only the active tab is mounted, which doubles as the remount that seeds the
 * editor with that locale's content — the editor is uncontrolled by design.
 */
export function I18nRichText({
  label,
  value,
  onChange,
  profile = "content",
  required,
  placeholder,
  className,
}: I18nRichTextProps) {
  const [active, setActive] = useState<Locale>("pt");
  const current: I18nString = value ?? { pt: "" };

  function set(locale: Locale, html: string) {
    const next: I18nString = { ...current, pt: current.pt ?? "" };
    // An empty document is stored as "" rather than "<p></p>", so downstream
    // "has content?" checks keep working on the raw value.
    const normalized = isEmptyHtml(html) ? "" : html;
    if (locale === "pt") next.pt = normalized;
    else next[locale] = normalized || undefined;
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
              const filled = Boolean(current[loc.id]);
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

        {LOCALES.map((loc) => (
          <TabsContent key={loc.id} value={loc.id} keepMounted={false}>
            <RichTextEditor
              profile={profile}
              initialHTML={current[loc.id] ?? ""}
              onChange={(html) => set(loc.id, html)}
              placeholder={placeholder}
            />
          </TabsContent>
        ))}
      </Tabs>
    </Field>
  );
}
