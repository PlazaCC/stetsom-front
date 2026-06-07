"use client";

import { Box, Code, FileText, ImageIcon, Images, Video } from "lucide-react";
import type { BlockRegistry } from "./block-builder";
import { AdminInput } from "./admin-input";
import { AdminTextEditor } from "./admin-text-editor";
import { LibraryAssetPicker } from "./library-asset-picker";

const fieldLabel = "mb-1 block text-xs font-medium text-muted-foreground";

function str(data: Record<string, unknown>, key: string): string {
  return typeof data[key] === "string" ? (data[key] as string) : "";
}

/**
 * Product page-block types and their editors. Data shapes follow the ClickUp
 * data model (products.page_blocks[].data):
 *   IMAGE   { library_id, file_url?, backgroundColor }
 *   VIDEO   { url, backgroundColor }
 *   HTML    { content }
 *   MODEL3D { modelFile, file_url?, backgroundColor }
 *   TEXT    { content }
 *   GALLERY { images: { library_id, file_url? }[] }
 */
export const PRODUCT_BLOCK_REGISTRY: BlockRegistry = {
  TEXT: {
    label: "Texto",
    description: "Bloco de texto rico.",
    icon: FileText,
    defaultData: { content: "" },
    Form: ({ data, onChange }) => (
      <AdminTextEditor
        value={str(data, "content")}
        onChange={(v) => onChange({ ...data, content: v })}
        placeholder="Conteúdo do bloco..."
      />
    ),
  },
  IMAGE: {
    label: "Imagem",
    description: "Imagem única com cor de fundo.",
    icon: ImageIcon,
    defaultData: { library_id: "", file_url: "", backgroundColor: "" },
    Form: ({ data, onChange }) => (
      <div className="space-y-3">
        <LibraryAssetPicker
          type="IMAGE"
          variant="image"
          value={{
            library_id: str(data, "library_id"),
            file_url: str(data, "file_url"),
          }}
          onChange={(a) =>
            onChange({
              ...data,
              library_id: a?.library_id ?? "",
              file_url: a?.file_url ?? "",
            })
          }
        />
        <div>
          <label className={fieldLabel}>Cor de fundo (opcional)</label>
          <AdminInput
            value={str(data, "backgroundColor")}
            onChange={(e) =>
              onChange({ ...data, backgroundColor: e.target.value })
            }
            placeholder="#121212"
          />
        </div>
      </div>
    ),
  },
  VIDEO: {
    label: "Vídeo",
    description: "Vídeo do YouTube ou Vimeo.",
    icon: Video,
    defaultData: { url: "", backgroundColor: "" },
    Form: ({ data, onChange }) => (
      <div className="space-y-3">
        <div>
          <label className={fieldLabel}>URL do vídeo</label>
          <AdminInput
            value={str(data, "url")}
            onChange={(e) => onChange({ ...data, url: e.target.value })}
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </div>
        <div>
          <label className={fieldLabel}>Cor de fundo (opcional)</label>
          <AdminInput
            value={str(data, "backgroundColor")}
            onChange={(e) =>
              onChange({ ...data, backgroundColor: e.target.value })
            }
            placeholder="#121212"
          />
        </div>
      </div>
    ),
  },
  HTML: {
    label: "HTML",
    description: "Conteúdo HTML customizado.",
    icon: Code,
    defaultData: { content: "" },
    Form: ({ data, onChange }) => (
      <AdminTextEditor
        value={str(data, "content")}
        onChange={(v) => onChange({ ...data, content: v })}
        placeholder="<section>...</section>"
      />
    ),
  },
  MODEL3D: {
    label: "Modelo 3D",
    description: "Arquivo .glb interativo.",
    icon: Box,
    defaultData: { modelFile: "", file_url: "", backgroundColor: "" },
    Form: ({ data, onChange }) => (
      <div className="space-y-3">
        <LibraryAssetPicker
          type="MODEL3D"
          variant="file"
          accept=".glb,model/gltf-binary"
          value={{
            library_id: str(data, "modelFile"),
            file_url: str(data, "file_url"),
          }}
          onChange={(a) =>
            onChange({
              ...data,
              modelFile: a?.library_id ?? "",
              file_url: a?.file_url ?? "",
            })
          }
        />
        <div>
          <label className={fieldLabel}>Cor de fundo (opcional)</label>
          <AdminInput
            value={str(data, "backgroundColor")}
            onChange={(e) =>
              onChange({ ...data, backgroundColor: e.target.value })
            }
            placeholder="#121212"
          />
        </div>
      </div>
    ),
  },
  GALLERY: {
    label: "Galeria",
    description: "Várias imagens.",
    icon: Images,
    defaultData: { images: [] },
    Form: ({ data, onChange }) => {
      const images = Array.isArray(data.images)
        ? (data.images as { library_id: string; file_url?: string }[])
        : [];
      return (
        <div className="space-y-2">
          {images.map((img, i) => (
            <LibraryAssetPicker
              key={i}
              type="IMAGE"
              variant="image"
              value={img}
              onChange={(a) => {
                const next = [...images];
                if (a)
                  next[i] = { library_id: a.library_id, file_url: a.file_url };
                else next.splice(i, 1);
                onChange({ ...data, images: next });
              }}
            />
          ))}
          <LibraryAssetPicker
            type="IMAGE"
            variant="image"
            value={null}
            onChange={(a) => {
              if (a)
                onChange({
                  ...data,
                  images: [
                    ...images,
                    { library_id: a.library_id, file_url: a.file_url },
                  ],
                });
            }}
          />
        </div>
      );
    },
  },
};
