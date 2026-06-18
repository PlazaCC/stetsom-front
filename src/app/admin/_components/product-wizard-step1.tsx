"use client";

import { AdminFormSection } from "@/app/admin/_components/crud/admin-form-section";
import {
  AdminInput,
  AdminLabel,
  AdminSelect,
} from "@/app/admin/_components/crud/admin-input";
import { I18nInput } from "@/app/admin/_components/crud/i18n-input";
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
    <div className="space-y-6">
      <AdminFormSection title="Identificação">
        <div className="space-y-4">
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
            <AdminInput
              value={info.sku}
              onChange={(e) => onPatch({ sku: e.target.value })}
              placeholder="Código único"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <AdminLabel>Categoria *</AdminLabel>
              <AdminSelect
                value={info.category_id}
                onChange={(e) =>
                  onPatch({
                    category_id: e.target.value,
                    subcategory_id: "",
                    template_id: "",
                  })
                }
              >
                <option value="">Selecione...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </AdminSelect>
            </div>

            <div>
              <AdminLabel>Linha (subcategoria)</AdminLabel>
              <AdminSelect
                value={info.subcategory_id}
                onChange={(e) => onPatch({ subcategory_id: e.target.value })}
                disabled={
                  !info.category_id || filteredSubcategories.length === 0
                }
              >
                <option value="">
                  {filteredSubcategories.length === 0
                    ? "Nenhuma"
                    : "Selecione..."}
                </option>
                {filteredSubcategories.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </AdminSelect>
            </div>
          </div>

          <div>
            <AdminLabel>Template de atributos</AdminLabel>
            <AdminSelect
              value={info.template_id}
              onChange={(e) => onPatch({ template_id: e.target.value })}
              disabled={!info.category_id || filteredTemplates.length === 0}
            >
              <option value="">
                {filteredTemplates.length === 0 ? "Nenhum" : "Selecione..."}
              </option>
              {filteredTemplates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </AdminSelect>
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
        </div>
      </AdminFormSection>

      <AdminFormSection title="Descrição">
        <I18nInput
          multiline
          value={info.description}
          onChange={(description) => onPatch({ description })}
          placeholder="Descrição curta do produto..."
        />
      </AdminFormSection>
    </div>
  );
}
