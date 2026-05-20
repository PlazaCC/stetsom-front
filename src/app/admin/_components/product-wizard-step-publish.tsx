"use client";

import {
  AdminInput,
  AdminLabel,
} from "@/app/admin/_components/crud/admin-input";
import { AdminFormSection } from "@/app/admin/_components/crud/admin-form-section";
import type { ProductInfo } from "@/app/admin/_components/product-wizard-step1";
import type { ProductSpec } from "@/lib/api/contracts";
import { CATALOG_CATEGORIES, CATALOG_SUBCATEGORIES } from "@/lib/mock/catalog";

interface ProductWizardStepPublishProps {
  info: ProductInfo;
  specs: ProductSpec[];
  onInfoChange: (key: keyof ProductInfo, value: string) => void;
}

export function ProductWizardStepPublish({
  info,
  specs,
  onInfoChange,
}: ProductWizardStepPublishProps) {
  const category = CATALOG_CATEGORIES.find((c) => c.id === info.category_id);
  const subcategory = CATALOG_SUBCATEGORIES.find(
    (s) => s.id === info.subcategory_id,
  );

  return (
    <div className="space-y-6">
      <AdminFormSection
        title="Data e horário de publicação"
        description="Defina quando o produto estará disponível no site."
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <AdminLabel>Data de lançamento</AdminLabel>
            <AdminInput
              type="date"
              value={info.launch_date}
              onChange={(e) => onInfoChange("launch_date", e.target.value)}
            />
          </div>
          <div>
            <AdminLabel>Horário (opcional)</AdminLabel>
            <AdminInput type="time" defaultValue="00:00" />
          </div>
        </div>
      </AdminFormSection>

      <AdminFormSection title="Status de publicação">
        <div className="flex flex-col gap-3">
          {(["ACTIVE", "DISCONTINUED"] as const).map((s) => (
            <label
              key={s}
              className="flex cursor-pointer items-start gap-3 rounded-md border border-border p-3 hover:bg-muted/50"
            >
              <input
                type="radio"
                name="publish-status"
                value={s}
                checked={info.status === s}
                onChange={() => onInfoChange("status", s)}
                className="mt-0.5 accent-brand"
              />
              <div>
                <span className="text-sm font-medium text-foreground">
                  {s === "ACTIVE" ? "Ativo" : "Descontinuado"}
                </span>
                <p className="text-xs text-muted-foreground">
                  {s === "ACTIVE"
                    ? "O produto ficará visível no catálogo para os visitantes do site."
                    : "O produto não será exibido no catálogo mas continuará salvo no sistema."}
                </p>
              </div>
            </label>
          ))}
        </div>
      </AdminFormSection>

      <AdminFormSection title="Resumo do produto">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <div>
            <dt className="text-xs text-muted-foreground">Nome</dt>
            <dd className="font-medium text-foreground">{info.name || "—"}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Slug</dt>
            <dd className="font-mono text-foreground">{info.slug || "—"}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Categoria</dt>
            <dd className="text-foreground">{category?.name ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Linha</dt>
            <dd className="text-foreground">{subcategory?.name ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Especificações</dt>
            <dd className="text-foreground">{specs.length} registradas</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Badge</dt>
            <dd className="text-foreground">{info.badge || "—"}</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-xs text-muted-foreground">Idiomas</dt>
            <dd className="flex gap-2">
              <span className="rounded bg-muted px-2 py-0.5 text-xs font-medium">
                🇧🇷 PT-BR
              </span>
            </dd>
          </div>
        </dl>
      </AdminFormSection>
    </div>
  );
}
