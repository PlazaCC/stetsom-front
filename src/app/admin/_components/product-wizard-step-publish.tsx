"use client";

import { AdminLabel } from "@/app/admin/_components/crud/admin-input";
import {
  AdminFormSection,
  AdminFormSectionContent,
  AdminFormSectionTitle,
} from "@/app/admin/_components/crud/admin-form-section";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ProductInfo } from "@/app/admin/_components/product-wizard-step1";
import type { WizardProductSpec } from "@/app/admin/_components/product-wizard-types";
import type { ProductStatus } from "@/api/stetsom/model";

interface ProductWizardStepPublishProps {
  info: ProductInfo;
  specs: WizardProductSpec[];
  categoryName: string | undefined;
  subcategoryName: string | undefined;
  onPatch: (patch: Partial<ProductInfo>) => void;
}

export function ProductWizardStepPublish({
  info,
  specs,
  categoryName,
  subcategoryName,
  onPatch,
}: ProductWizardStepPublishProps) {
  function toggleLocale(locale: "pt" | "en" | "es") {
    if (locale === "pt") return;
    const current = info.available_locales;
    const next = current.includes(locale)
      ? current.filter((l) => l !== locale)
      : [...current, locale];
    onPatch({ available_locales: next as ("pt" | "en" | "es")[] });
  }

  return (
    <div className="space-y-6">
      <AdminFormSection
        title="Idiomas disponíveis"
        description="Selecione em quais idiomas o produto será exibido."
      >
        <AdminFormSectionContent>
          <label className="flex cursor-not-allowed items-center gap-2 rounded-md border border-border bg-muted/50 px-4 py-3">
            <input
              type="checkbox"
              checked
              disabled
              className="accent-primary"
            />
            <span className="text-sm font-medium text-foreground">
              🇧🇷 Português
            </span>
            <span className="text-xs text-muted-foreground">(obrigatório)</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2 rounded-md border border-border bg-card px-4 py-3 hover:bg-muted/50">
            <input
              type="checkbox"
              checked={info.available_locales.includes("en")}
              onChange={() => toggleLocale("en")}
              className="accent-primary"
            />
            <span className="text-sm font-medium text-foreground">
              🇺🇸 English
            </span>
          </label>
          <label className="flex cursor-pointer items-center gap-2 rounded-md border border-border bg-card px-4 py-3 hover:bg-muted/50">
            <input
              type="checkbox"
              checked={info.available_locales.includes("es")}
              onChange={() => toggleLocale("es")}
              className="accent-primary"
            />
            <span className="text-sm font-medium text-foreground">
              🇪🇸 Español
            </span>
          </label>
        </AdminFormSectionContent>

        <AdminFormSectionTitle
          title="Data e horário de publicação"
          description="Defina quando o produto estará disponível no site."
          className="border-t"
        />

        <AdminFormSectionContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <AdminLabel>Data de lançamento</AdminLabel>
              <Input
                type="date"
                value={info.launch_date}
                onChange={(e) => onPatch({ launch_date: e.target.value })}
              />
            </div>
            <div>
              <AdminLabel>Horário (opcional)</AdminLabel>
              <Input
                type="time"
                value={info.launch_time}
                onChange={(e) => onPatch({ launch_time: e.target.value })}
              />
            </div>
          </div>
        </AdminFormSectionContent>

        <AdminFormSectionTitle
          title="Status de publicação"
          description="Defina quando o produto estará disponível no site."
          className="border-t"
        />

        <AdminFormSectionContent>
          <div>
            <AdminLabel>Status</AdminLabel>
            <Select
              value={info.status}
              onValueChange={(value) =>
                value && onPatch({ status: value as ProductStatus })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">Rascunho</SelectItem>
                <SelectItem value="PUBLISHED">Publicado</SelectItem>
                <SelectItem value="SCHEDULED">Agendado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <label className="flex cursor-pointer items-start gap-3 rounded-md border border-border p-3 hover:bg-muted/50">
            <input
              type="checkbox"
              checked={info.is_discontinued}
              onChange={(e) => onPatch({ is_discontinued: e.target.checked })}
              className="mt-0.5 accent-primary"
            />
            <div>
              <span className="text-sm font-medium text-foreground">
                Produto descontinuado
              </span>
              <p className="text-xs text-muted-foreground">
                Marque esta opção para indicar que o produto não é mais
                fabricado. Ele continuará visível no catálogo mas será
                identificado como descontinuado.
              </p>
            </div>
          </label>
        </AdminFormSectionContent>

        <AdminFormSectionTitle
          title="Resumo do produto"
          description="Defina quando o produto estará disponível no site."
          className="border-t"
        />

        <AdminFormSectionContent>
          <dl className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm">
            <div>
              <dt className="text-xs text-muted-foreground">Nome</dt>
              <dd className="font-medium text-foreground">
                {info.name.pt || "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Slug</dt>
              <dd className="font-mono text-foreground">
                {info.slug.pt || "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Categoria</dt>
              <dd className="text-foreground">{categoryName ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Linha</dt>
              <dd className="text-foreground">{subcategoryName ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Especificações</dt>
              <dd className="text-foreground">{specs.length} registradas</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">SKU</dt>
              <dd className="text-foreground">{info.sku || "—"}</dd>
            </div>
          </dl>
        </AdminFormSectionContent>
      </AdminFormSection>
    </div>
  );
}
