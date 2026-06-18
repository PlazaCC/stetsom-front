"use client";

import type { Attribute, Template } from "@/api/stetsom/model";
import { Copy } from "lucide-react";
import { useState } from "react";
import type { WizardSpec } from "./wizard-store";

interface TemplatePickerProps {
  templates: Template[];
  attributes: Attribute[];
  categoryId: string;
  onApply: (specs: WizardSpec[]) => void;
}

function buildSpecs(tpl: Template, attributes: Attribute[]): WizardSpec[] {
  return [...tpl.attributes]
    .sort((a, b) => a.order - b.order)
    .map((ta, i) => ({
      id: `spec-tpl-${ta.attribute_id}-${i}`,
      attribute_id: ta.attribute_id,
      attribute_name: attributes.find((a) => a.id === ta.attribute_id)?.name,
      value: { pt: "" },
      order: i,
      highlighted: false,
    }));
}

export function TemplatePicker({
  templates,
  attributes,
  categoryId,
  onApply,
}: TemplatePickerProps) {
  const [pickKey, setPickKey] = useState(0);
  const options = templates.filter((t) => t.category_id === categoryId);
  const disabled = !categoryId || options.length === 0;

  return (
    <div className="relative inline-flex items-center">
      <Copy className="pointer-events-none absolute left-3 size-4 text-muted-foreground" />
      <select
        key={pickKey}
        defaultValue=""
        disabled={disabled}
        onChange={(e) => {
          const tpl = options.find((t) => t.id === e.target.value);
          if (tpl) onApply(buildSpecs(tpl, attributes));
          setPickKey((k) => k + 1);
        }}
        className="rounded-md border border-border bg-card py-2 pr-3 pl-9 text-sm font-medium text-foreground focus:ring-1 focus:ring-primary focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
      >
        <option value="">
          {disabled ? "Sem template" : "Aplicar template"}
        </option>
        {options.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name.pt}
          </option>
        ))}
      </select>
    </div>
  );
}
