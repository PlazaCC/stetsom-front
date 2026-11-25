"use client";

import { useState } from "react";
import type { I18nString } from "@/api/stetsom/model";
import {
  I18N_LOCALES,
  I18nLocaleTabs,
  type I18nLocale,
} from "@/app/admin/_components/crud/i18n-locale-tabs";
import { AdminFieldError } from "@/app/admin/_components/crud/admin-field-error";
import { Field, FieldLabel } from "@/components/ui/field";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { decodeHtmlEntities } from "@/lib/utils/plain-text";
import {
  BlockTextEditor,
  type BlockTextEditorVariant,
} from "./block-text-editor";

export function RichI18nInput({
  label,
  variant,
  value,
  onChange,
  errors,
  onClearError,
  fieldPath,
  placeholder,
}: {
  label: string;
  variant: Exclude<BlockTextEditorVariant, "full">;
  value: I18nString;
  onChange: (value: I18nString) => void;
  errors?: Partial<Record<I18nLocale, string>>;
  onClearError?: (locale: I18nLocale) => void;
  fieldPath?: string;
  placeholder?: string;
}) {
  const [locale, setLocale] = useState<I18nLocale>("pt");
  return (
    <Field data-field-path={fieldPath}>
      <Tabs
        value={locale}
        onValueChange={(value) => setLocale(value as I18nLocale)}
        className="gap-1.5"
      >
        <div className="flex items-end gap-2">
          <FieldLabel className="mb-0">{label}</FieldLabel>
          <I18nLocaleTabs value={value} errors={errors} />
        </div>
        {I18N_LOCALES.map(({ id }) => (
          <TabsContent key={id} value={id} keepMounted={false}>
            <BlockTextEditor
              placeholder={placeholder}
              variant={variant}
              label={`${label} (${id.toUpperCase()})`}
              initialContent={
                (value[id] ?? "").trimStart().startsWith("<")
                  ? value[id]
                  : decodeHtmlEntities(value[id])
              }
              onChange={(html) => {
                onClearError?.(id);
                onChange({
                  ...value,
                  [id]: id === "pt" ? html : html || undefined,
                });
              }}
            />
            <AdminFieldError
              id={`${fieldPath ?? label}.${id}-error`}
              message={errors?.[id]}
            />
          </TabsContent>
        ))}
      </Tabs>
    </Field>
  );
}
