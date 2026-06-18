"use client";

import {
  AdminFormSection,
  AdminFormSectionContent,
  AdminFormSectionTitle,
} from "@/app/admin/_components/crud/admin-form-section";
import { AdminLabel } from "@/app/admin/_components/crud/admin-input";
import { I18nInput } from "@/app/admin/_components/crud/i18n-input";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ProductStatus, I18nString } from "@/api/stetsom/model";

interface Category {
  id: string;
  name: string;
  slug: string;
}
interface Subcategory {
  id: string;
  name: string;
  slug: string;
  category_id: string;
}
interface TemplateOption {
  id: string;
  name: string;
  category_id: string;
}

export interface ProductInfo {
  name: I18nString;
  slug: I18nString;
  description: I18nString;
  sku: string;
  category_id: string;
  subcategory_id: string;
  template_id: string;
  status: ProductStatus;
  is_discontinued: boolean;
  is_featured: boolean;
  is_spotlight: boolean;
  launch_date: string;
  launch_time: string;
  available_locales: ("pt" | "en" | "es")[];
}

interface ProductWizardStep1Props {
  info: ProductInfo;
  categories: Category[];
  subcategories: Subcategory[];
  templates: TemplateOption[];
  onPatch: (patch: Partial<ProductInfo>) => void;
}

export function ProductWizardStep1({
  info,
  categories,
  subcategories,
  templates,
  onPatch,
}: ProductWizardStep1Props) {
  const filteredSubcategories = subcategories.filter(
    (s) => s.category_id === info.category_id,
  );
  const filteredTemplates = templates.filter(
    (t) => t.category_id === info.category_id,
  );

  return (
    <div className="flex-1">
      <AdminFormSection title="Identificação">
        <AdminFormSectionContent>
          <I18nInput
            label="Nome do produto"
            required
            value={info.name}
            onChange={(name) => onPatch({ name })}
            placeholder="Ex: ST-4000EQ"
          />

          <I18nInput
            label="Slug (URL)"
            value={info.slug}
            onChange={(slug) => onPatch({ slug })}
            placeholder="st-4000eq"
          />

          <div>
            <AdminLabel>SKU</AdminLabel>
            <Input
              value={info.sku}
              onChange={(e) => onPatch({ sku: e.target.value })}
              placeholder="Código único"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <AdminLabel>Categoria *</AdminLabel>
              <Select
                value={info.category_id}
                onValueChange={(value) =>
                  onPatch({
                    category_id: value ?? "",
                    subcategory_id: "",
                    template_id: "",
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Selecione...</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <AdminLabel>Linha (subcategoria)</AdminLabel>
              <Select
                value={info.subcategory_id}
                onValueChange={(value) =>
                  onPatch({ subcategory_id: value ?? "" })
                }
                disabled={
                  !info.category_id || filteredSubcategories.length === 0
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">
                    {filteredSubcategories.length === 0
                      ? "Nenhuma"
                      : "Selecione..."}
                  </SelectItem>
                  {filteredSubcategories.map((sub) => (
                    <SelectItem key={sub.id} value={sub.id}>
                      {sub.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <AdminLabel>Template de atributos</AdminLabel>
              <Select
                value={info.template_id}
                onValueChange={(value) => onPatch({ template_id: value ?? "" })}
                disabled={!info.category_id || filteredTemplates.length === 0}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">
                    {filteredTemplates.length === 0 ? "Nenhum" : "Selecione..."}
                  </SelectItem>
                  {filteredTemplates.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-6 pt-1">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={info.is_featured}
                onChange={(e) => onPatch({ is_featured: e.target.checked })}
                className="size-4 accent-primary"
              />
              <span className="text-sm text-foreground">Destaque</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={info.is_spotlight}
                onChange={(e) => onPatch({ is_spotlight: e.target.checked })}
                className="size-4 accent-primary"
              />
              <span className="text-sm text-foreground">Spotlight</span>
            </label>
          </div>
        </AdminFormSectionContent>

        <AdminFormSectionTitle title="Descrição" className="border-t" />

        <AdminFormSectionContent>
          <I18nInput
            multiline
            value={info.description}
            onChange={(description) => onPatch({ description })}
            placeholder="Descrição curta do produto..."
          />
        </AdminFormSectionContent>
      </AdminFormSection>
    </div>
  );
}
