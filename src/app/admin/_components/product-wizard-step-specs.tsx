"use client";

import {
  AdminInput,
  AdminLabel,
} from "@/app/admin/_components/crud/admin-input";
import { AdminFormSection } from "@/app/admin/_components/crud/admin-form-section";
import type { ProductSpec } from "@/lib/api/contracts";
import { GripVertical, Plus, Trash2 } from "lucide-react";

interface ProductWizardStepSpecsProps {
  specs: ProductSpec[];
  onChange: (specs: ProductSpec[]) => void;
}

function newSpec(order: number): ProductSpec {
  return {
    id: `spec-${Date.now()}-${Math.random()}`,
    attribute: "",
    value: "",
    order,
  };
}

export function ProductWizardStepSpecs({
  specs,
  onChange,
}: ProductWizardStepSpecsProps) {
  function addRow() {
    onChange([...specs, newSpec(specs.length + 1)]);
  }

  function removeRow(id: string) {
    onChange(
      specs.filter((s) => s.id !== id).map((s, i) => ({ ...s, order: i + 1 })),
    );
  }

  function updateRow(id: string, field: "attribute" | "value", value: string) {
    onChange(specs.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  }

  return (
    <div className="space-y-6">
      <AdminFormSection
        title="Especificações técnicas"
        description="Defina os atributos e valores que serão exibidos na tabela de especificações do produto."
      >
        <div className="overflow-hidden rounded-md border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="w-8 px-2 py-2" />
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">
                  Atributo
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">
                  Valor
                </th>
                <th className="w-10 px-2 py-2" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {specs.map((spec) => (
                <tr key={spec.id} className="group">
                  <td className="px-2 py-2">
                    <GripVertical className="size-4 cursor-grab text-muted-foreground opacity-0 group-hover:opacity-100" />
                  </td>
                  <td className="px-3 py-2">
                    <AdminInput
                      value={spec.attribute}
                      onChange={(e) =>
                        updateRow(spec.id, "attribute", e.target.value)
                      }
                      placeholder="Ex: Potência RMS"
                      className="h-8 text-sm"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <AdminInput
                      value={spec.value}
                      onChange={(e) =>
                        updateRow(spec.id, "value", e.target.value)
                      }
                      placeholder="Ex: 4000W"
                      className="h-8 text-sm"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <button
                      type="button"
                      onClick={() => removeRow(spec.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}

              {specs.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-6 text-center text-sm text-muted-foreground"
                  >
                    Nenhuma especificação adicionada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <button
          type="button"
          onClick={addRow}
          className="mt-2 flex items-center gap-1.5 text-sm font-medium text-brand hover:underline"
        >
          <Plus className="size-4" />
          Adicionar especificação
        </button>
      </AdminFormSection>

      <AdminFormSection
        title="Variações (opcional)"
        description="Defina as variações disponíveis para este produto, como impedâncias ou potências."
      >
        <div className="flex flex-wrap gap-2">
          {["1 ohm", "2 ohms", "4 ohms"].map((v) => (
            <span
              key={v}
              className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-foreground"
            >
              {v}
            </span>
          ))}
          <div className="flex items-center gap-1">
            <AdminLabel className="text-xs text-muted-foreground">
              Em breve: editor de variações
            </AdminLabel>
          </div>
        </div>
      </AdminFormSection>
    </div>
  );
}
