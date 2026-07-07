"use client";

import { YouTubeEmbed } from "@/components/ui/youtube-embed";
import { getYouTubeEmbedUrl } from "@/lib/utils/product";
import { Box, Code, FileText, ImageIcon, Images, Video } from "lucide-react";
import dynamic from "next/dynamic";
import type { BlockRegistry } from "./block-manager";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminTextarea } from "./admin-input";
import { AdminTextEditor } from "./admin-text-editor";
import { LibraryAssetPicker } from "./library-asset-picker";
import {
  readLibraryAssetRef,
  writeLibraryAssetRef,
  type LibraryAssetRef,
  type LibraryPickedAsset,
} from "./library-asset-ref";

// three.js is client-only and heavy — load the 3D preview lazily, never on SSR.
const Model3DViewer = dynamic(
  () => import("@/components/ui/model-3d-viewer").then((m) => m.Model3DViewer),
  { ssr: false },
);

const fieldLabel = "mb-1 block text-xs font-medium text-muted-foreground";

function str(data: Record<string, unknown>, key: string): string {
  return typeof data[key] === "string" ? (data[key] as string) : "";
}

type ProductImageBlockAsset = LibraryAssetRef;
type Model3DFileAsset = LibraryAssetRef;
type Model3DBackgroundAsset = LibraryAssetRef;
type GalleryImageAsset = LibraryPickedAsset;

const IMAGE_BLOCK_ASSET_KEYS = {
  libraryIdKey: "library_id",
  fileUrlKey: "file_url",
} as const;
const MODEL3D_FILE_KEYS = {
  libraryIdKey: "modelFile",
  fileUrlKey: "file_url",
} as const;
const MODEL3D_BACKGROUND_KEYS = {
  libraryIdKey: "backgroundImage",
  fileUrlKey: "backgroundImageUrl",
} as const;

/** Shared optional title + description fields (IMAGE, VIDEO, GALLERY). */
function HeadingFields({
  data,
  onChange,
}: {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
}) {
  return (
    <>
      <div>
        <label className={fieldLabel}>Título (opcional)</label>
        <Input
          value={str(data, "title")}
          onChange={(e) => onChange({ ...data, title: e.target.value })}
          placeholder="Título do bloco"
        />
      </div>
      <div>
        <label className={fieldLabel}>Descrição (opcional)</label>
        <AdminTextarea
          rows={2}
          value={str(data, "description")}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
          placeholder="Descrição do bloco"
        />
      </div>
    </>
  );
}

/**
 * Product page-block types and their editors. Data shapes follow the ClickUp
 * data model (products.page_blocks[].data):
 *   IMAGE   { library_id, file_url?, title?, description? }
 *   VIDEO   { url, title?, description? }
 *   HTML    { content }
 *   MODEL3D { modelFile, file_url?, backgroundColor, backgroundImage, backgroundImageUrl }
 *   TEXT    { content }
 *   GALLERY { images: { library_id, file_url? }[], title?, description? }
 *
 * Every block also carries an optional `data.style` object (fullWidth,
 * backgroundColor, backgroundImageUrl, customId, customCss) edited in the
 * shared "Estilização" tab. MODEL3D's backgroundColor/Image feed the 3D canvas
 * and are distinct from the universal wrapper styling.
 */
export const PRODUCT_BLOCK_REGISTRY: BlockRegistry = {
  TEXT: {
    label: "Texto / Descritiva",
    description: "Bloco de texto rico.",
    icon: FileText,
    defaultData: { content: "", title: "", align: "left" },
    Form: ({ data, onChange }) => (
      <div className="space-y-3">
        <div>
          <label className={fieldLabel}>Título (opcional)</label>
          <Input
            value={str(data, "title")}
            onChange={(e) => onChange({ ...data, title: e.target.value })}
            placeholder="Título do bloco"
          />
        </div>
        <AdminTextEditor
          value={str(data, "content")}
          onChange={(v) => onChange({ ...data, content: v })}
          placeholder="Conteúdo do bloco..."
        />
        <div>
          <label className={fieldLabel}>Alinhamento</label>
          <Select
            value={str(data, "align") || "left"}
            onValueChange={(value) =>
              onChange({ ...data, align: value ?? "left" })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Esquerda</SelectItem>
              <SelectItem value="center">Centro</SelectItem>
              <SelectItem value="right">Direita</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    ),
  },
  IMAGE: {
    label: "Imagem",
    description: "Imagem que ocupa a largura ou lateral do layout.",
    icon: ImageIcon,
    defaultData: {
      library_id: "",
      file_url: "",
      title: "",
      description: "",
      layout: "full",
    },
    Form: ({ data, onChange }) => (
      <div className="space-y-3">
        <div>
          <label className={fieldLabel}>Layout</label>
          <Select
            value={str(data, "layout") || "full"}
            onValueChange={(value) =>
              onChange({ ...data, layout: value ?? "full" })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full">Imagem Full</SelectItem>
              <SelectItem value="side">Imagem Side</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <HeadingFields data={data} onChange={onChange} />
        <LibraryAssetPicker
          type="IMAGE"
          variant="image"
          value={
            readLibraryAssetRef(
              data,
              IMAGE_BLOCK_ASSET_KEYS,
            ) satisfies ProductImageBlockAsset
          }
          onChange={(a) =>
            onChange(writeLibraryAssetRef(data, IMAGE_BLOCK_ASSET_KEYS, a))
          }
        />
      </div>
    ),
  },
  VIDEO: {
    label: "Vídeo",
    description: "Exibe um vídeo incorporado por link (youtube / vimeo).",
    icon: Video,
    defaultData: { url: "", title: "", description: "" },
    Form: ({ data, onChange }) => (
      <div className="space-y-3">
        <HeadingFields data={data} onChange={onChange} />
        <div>
          <label className={fieldLabel}>URL do vídeo (YouTube)</label>
          <Input
            value={str(data, "url")}
            onChange={(e) => onChange({ ...data, url: e.target.value })}
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </div>
        {getYouTubeEmbedUrl(str(data, "url")) ? (
          <div>
            <label className={fieldLabel}>Pré-visualização</label>
            <YouTubeEmbed url={str(data, "url")} />
          </div>
        ) : null}
      </div>
    ),
  },
  HTML: {
    label: "Seção livre (HTML)",
    description: "Permite inserir um conteúdo HTML personalizado.",
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
    label: "Arquivo 3D",
    description: "Exibe um modelo 3d interativo (.glb / .gltf).",
    icon: Box,
    defaultData: {
      modelFile: "",
      file_url: "",
      backgroundColor: "",
      backgroundImage: "",
      backgroundImageUrl: "",
    },
    Form: ({ data, onChange }) => (
      <div className="space-y-3">
        <LibraryAssetPicker
          type="MODEL3D"
          variant="file"
          accept=".glb,model/gltf-binary"
          value={
            readLibraryAssetRef(
              data,
              MODEL3D_FILE_KEYS,
            ) satisfies Model3DFileAsset
          }
          onChange={(a) =>
            onChange(writeLibraryAssetRef(data, MODEL3D_FILE_KEYS, a))
          }
        />
        <div>
          <label className={fieldLabel}>Cor de fundo (opcional)</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              aria-label="Selecionar cor de fundo"
              value={str(data, "backgroundColor") || "#121212"}
              onChange={(e) =>
                onChange({ ...data, backgroundColor: e.target.value })
              }
              className="h-9 w-10 shrink-0 cursor-pointer rounded border border-border bg-card"
            />
            <Input
              value={str(data, "backgroundColor")}
              onChange={(e) =>
                onChange({ ...data, backgroundColor: e.target.value })
              }
              placeholder="#121212"
            />
          </div>
        </div>
        <div>
          <label className={fieldLabel}>Imagem de fundo (opcional)</label>
          <LibraryAssetPicker
            type="IMAGE"
            variant="image"
            value={
              readLibraryAssetRef(
                data,
                MODEL3D_BACKGROUND_KEYS,
              ) satisfies Model3DBackgroundAsset
            }
            onChange={(a) =>
              onChange(writeLibraryAssetRef(data, MODEL3D_BACKGROUND_KEYS, a))
            }
          />
        </div>
        {str(data, "file_url") ? (
          <div>
            <label className={fieldLabel}>Pré-visualização</label>
            <div className="h-64 overflow-hidden rounded-md border border-border">
              <Model3DViewer
                key={str(data, "file_url")}
                url={str(data, "file_url")}
                backgroundColor={str(data, "backgroundColor") || undefined}
                backgroundImage={str(data, "backgroundImageUrl") || undefined}
              />
            </div>
          </div>
        ) : null}
      </div>
    ),
  },
  GALLERY: {
    label: "Galeria",
    description: "Várias imagens.",
    icon: Images,
    hideFromMenu: true,
    defaultData: { images: [], title: "", description: "" },
    Form: ({ data, onChange }) => {
      const images = Array.isArray(data.images)
        ? (data.images as GalleryImageAsset[])
        : [];
      return (
        <div className="space-y-2">
          <HeadingFields data={data} onChange={onChange} />
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
