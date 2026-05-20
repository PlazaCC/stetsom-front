"use client";

import {
  AdminInput,
  AdminLabel,
  AdminSelect,
  AdminTextarea,
} from "@/app/admin/_components/crud/admin-input";
import { AdminTagInput } from "@/app/admin/_components/crud/admin-tag-input";
import { AdminFormSection } from "@/app/admin/_components/crud/admin-form-section";
import type { ProductStatus } from "@/lib/api/contracts";
import { CATALOG_CATEGORIES } from "@/lib/mock/catalog";

export interface ProductInfo {
  name: string;
  slug: string;
  category_id: string;
  status: ProductStatus;
  description: string;
  thumbnail_url: string;
  video_url: string;
  launch_date: string;
  spec_tags: string[];
}

interface ProductWizardStep1Props {
  info: ProductInfo;
  onChange: (key: keyof ProductInfo, value: string | string[]) => void;
}

export function ProductWizardStep1({
  info,
  onChange,
}: ProductWizardStep1Props) {
  return (
    <AdminFormSection
      title="Informações básicas"
      description="Dados principais do produto exibidos no catálogo."
    >
      <div className="space-y-4">
        <div>
          <AdminLabel>Nome do produto</AdminLabel>
          <AdminInput
            required
            value={info.name}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="Ex: ST-4000EQ"
          />
        </div>

        <div>
          <AdminLabel>Slug (URL)</AdminLabel>
          <AdminInput
            value={info.slug}
            onChange={(e) => onChange("slug", e.target.value)}
            placeholder="st-4000eq"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            /produtos/{info.slug || "slug-do-produto"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <AdminLabel>Categoria</AdminLabel>
            <AdminSelect
              value={info.category_id}
              onChange={(e) => onChange("category_id", e.target.value)}
            >
              <option value="">Selecione...</option>
              {CATALOG_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </AdminSelect>
          </div>

          <div>
            <AdminLabel>Status</AdminLabel>
            <AdminSelect
              value={info.status}
              onChange={(e) => onChange("status", e.target.value)}
            >
              <option value="ACTIVE">Ativo</option>
              <option value="DISCONTINUED">Descontinuado</option>
            </AdminSelect>
          </div>
        </div>

        <div>
          <AdminLabel>Data de lançamento</AdminLabel>
          <AdminInput
            type="date"
            value={info.launch_date}
            onChange={(e) => onChange("launch_date", e.target.value)}
          />
        </div>

        <div>
          <AdminLabel>Descrição</AdminLabel>
          <AdminTextarea
            rows={4}
            value={info.description}
            onChange={(e) => onChange("description", e.target.value)}
            placeholder="Descrição completa do produto..."
          />
        </div>

        <div>
          <AdminLabel>URL da thumbnail</AdminLabel>
          <AdminInput
            value={info.thumbnail_url}
            onChange={(e) => onChange("thumbnail_url", e.target.value)}
            placeholder="/uploads/thumbnail.png"
          />
        </div>

        <div>
          <AdminLabel>URL do vídeo (opcional)</AdminLabel>
          <AdminInput
            type="url"
            value={info.video_url}
            onChange={(e) => onChange("video_url", e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </div>

        <div>
          <AdminLabel>Especificações técnicas</AdminLabel>
          <p className="mb-2 text-xs text-muted-foreground">
            Digite no formato{" "}
            <code className="rounded bg-muted px-1">Chave: Valor</code> e
            pressione Enter.
          </p>
          <AdminTagInput
            tags={info.spec_tags}
            onChange={(tags) => onChange("spec_tags", tags)}
            placeholder="Potência: 4000W"
          />
        </div>
      </div>
    </AdminFormSection>
  );
}
